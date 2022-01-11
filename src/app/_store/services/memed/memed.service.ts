import { HttpClient } from '@angular/common/http'
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core'
import { Events } from 'src/app/providers/events/events.service'
import { CustomScript, LoadScriptService } from 'src/app/providers/load-script/load-script.service'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

declare var MdSinapsePrescricao: any
declare var MdHub: any

@Injectable({
  providedIn: 'root'
})
export class MemedService {
  private subs$ = new SubSink()
  private token = ''
  private memedApi: string
  private memedScript: string
  private render: Renderer2
  private loaded: boolean
  private baseMemedUrl: string

  constructor(
    rendererFactory: RendererFactory2,
    private http: HttpClient,
    private events: Events,
    private loadScriptServ: LoadScriptService,
    private store: Store<PEPState>
  ) {
    this.render = rendererFactory.createRenderer(null, null)
    this.loaded = false
    this.subs$.add(
      this.store.select(CredenciaisSelect.memedScript).subscribe(
        data => {
          this.memedScript = data
        },
        err => {
          console.error(err)
        }
      )
    )
    this.subs$.add(
      this.store.select(CredenciaisSelect.memedApi).subscribe(
        data => {
          this.memedApi = data
        },
        err => {
          console.error(err)
        }
      )
    )
    this.subs$.add(
      this.store.select(CredenciaisSelect.memedToken).subscribe(
        data => {
          this.token = data
        },
        err => {
          console.error(err)
        }
      )
    )
  }

  async init(color: string): Promise<any> {
    const script = this.getMemedScript(this.token, color)
    return this.loadScriptServ
      .load(script)
      .then(data => {
        if (data.loaded) {
          this.listenerStartMEMED()
          this.loaded = true
        }
      })
      .catch(e => {
        console.error(e, 'error ao carregar módulo memed')
      })
  }

  private getMemedScript = (token: string, color = '#576cff'): CustomScript => {
    return {
      name: 'memed',
      tag: 'script',
      attrs: [
        { name: 'type', value: 'text/javascript' },
        {
          name: 'src',
          value: this.memedScript
        },
        { name: 'data-color', value: color },
        { name: 'data-token', value: token }
      ],
      loaded: false
    }
  }

  checkMemed() {
    if (this.token) {
      this.init('#0071fe')
    }
  }

  listenerStartMEMED() {
    try {
      if (MdSinapsePrescricao) {
        MdSinapsePrescricao.event.add('core:moduleInit', (module: any) => {
          if (module.name === 'plataforma.prescricao') {
            this.listenerPrescricaoMEMED()
          }
        })
      } else {
        console.error('Módulo memed não carregado')
      }
    } catch (e) {
      console.error('memed error', e)
    }
  }

  private listenerPrescricaoMEMED() {
    try {
      MdHub.event.add('prescricaoSalva', (id: any) => {
        if (id) {
          this.getPrescricao(id)
        }
      })
    } catch (e) {
      console.error('memed error', e)
    }
  }

  remove() {
    const doc = this.render.selectRootElement('script', true)
    const doc2 = this.render.parentNode(doc) as Element
    const url = `script[src="${(this, this.memedScript)}"]`.toString()
    const doc3 = doc2.querySelector(url)
    if (doc && doc3) {
      this.render.removeChild(doc, doc3)
    }
  }

  async getPrescricao(id: number) {
    const url = `${this.memedApi}/prescricoes/${id}?token=${this.token}`
    const options = {
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/json'
      }
    }
    return this.http
      .get(url, options)
      .toPromise()
      .then(prescricao => {
        this.events.publish('nova-prescricao', prescricao)
      })
      .catch(e => console.error(e, 'error ao ler prescrição gerada MEMED'))
  }

  addPaciente(nome: string, idExterno: string) {
    if (this.token.toString() === '') {
      return false
    }
    if (this.loaded) {
      try {
        MdHub.command.send('plataforma.prescricao', 'setPaciente', {
          nome,
          idExterno
        })
      } catch (e) {
        console.error(e)
      }
    } else {
      console.error('MEMED não iniciado')
    }
    return this.loaded
  }

  getEspecialidades(): Observable<any> {
    const url = `${this.memedApi}/especialidades`
    return this.http.get<any>(url)
  }

  getCidades(uf): Observable<any> {
    return this.http.get(`${this.memedApi}/cidades?filter[uf]=${uf}&page[limit]=1000`)
  }
}
