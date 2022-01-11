import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { merge, Observable, of, Subject } from 'rxjs'
import { debounceTime, filter, mergeMap } from 'rxjs/operators'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import {
  EspecialidadeModel,
  EspecialidadesService
} from 'src/app/_store/services/especialidades/especialidades.service'
import { ReferenciasModels } from 'src/app/_store/_modules/referencias/referencias.models'
import { Profissional } from 'src/app/_store/_modules/profissional/profissional.model'

@Component({
  selector: 'form-referencias',
  templateUrl: './form-referencias.component.html',
  styleUrls: ['./form-referencias.component.scss']
})
export class FormReferenciasComponent implements OnInit, OnDestroy {
  @Output() saveEvent: EventEmitter<ReferenciasModels.ReferenciaPost>
  @Output() printEvent: EventEmitter<ReferenciasModels.Referencia>

  @ViewChild('instancePro', { static: true }) instancePro: NgbTypeahead
  @ViewChild('instanceEspec', { static: true }) instanceEspec: NgbTypeahead

  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  form: FormGroup
  editable: boolean
  msgAlert: string

  selectedPro: Profissional
  selectedEspec: EspecialidadeModel
  profissionalReferenciado: any

  listEspecialidadeCombo: any[] = []
  listEspecialidade: EspecialidadeModel[] = []
  especialidadeSelectedCombo: any = undefined

  willPrint: boolean

  private readonly onDestroy: Subject<void>

  constructor(
    private formBuilder: FormBuilder,
    private especialidadeServ: EspecialidadesService,
    private utilsServ: UtilsService
  ) {
    this.saveEvent = new EventEmitter()
    this.printEvent = new EventEmitter()
    this.onDestroy = new Subject()
    this.profissionalReferenciado = ''
  }

  ngOnInit() {
    this.especialidadeServ.getAll().subscribe(res => {
      this.listEspecialidade = res.data
      if (res && res.data && res.data.length > 0) {
        this.listEspecialidadeCombo = res.data.map(item => {
          return {
            label: item.descricao,
            value: item.id
          }
        })
      }
    })

    this.form = this.formBuilder.group({
      dataValidade: [undefined],
      especialidade: [undefined],
      profissionalReferenciado: [''],
      descricao: [undefined, Validators.required]
    })
  }

  ngOnDestroy() {
    this.onDestroy.next()
    this.onDestroy.complete()
  }

  setEspecialidadeSelectedCombo(e) {
    if (e && e.target) {
      this.especialidadeSelectedCombo = e.target.value
    }
  }

  save() {
    if (this.form.invalid) {
      return
    }

    const v = this.form.value

    this.msgAlert = undefined

    let especialidadeSelected = undefined

    if (this.listEspecialidade && this.listEspecialidade.length > 0) {
      this.listEspecialidade.forEach(especialidade => {
        if (
          this.especialidadeSelectedCombo &&
          especialidade.id == this.especialidadeSelectedCombo.value
        ) {
          especialidadeSelected = especialidade
        }
      })
    }

    if (!especialidadeSelected || (especialidadeSelected && !especialidadeSelected.id)) {
      this.msgAlert = 'A especialidade deve ser escolhida da lista fornecida.'
      return
    }

    const data: ReferenciasModels.ReferenciaPost = {
      dataValidade: v.dataValidade ? this.utilsServ.formatterDateToISOWithGMT(v.dataValidade) : '',
      descricao: v.descricao,
      especialidade: especialidadeSelected,
      profissionalReferenciado: v.profissionalReferenciado,
      localAtendimento: null,
      dataRealizacaoContraReferencia: undefined,
      textoContraReferencia: '',
      modified_by: ''
    }

    if (!this.willPrint) {
      this.saveEvent.emit(data)
    } else {
      var dataTemp: any = data
      this.printEvent.emit(dataTemp)
      this.willPrint = false
    }
    this.form.reset()
    return data
  }

  saveAndPrint() {
    this.willPrint = true
    this.save()
  }

  searchEspec = (text$: Observable<string>) => {
    const text = text$.pipe(debounceTime(200))
    const click = this.click$.pipe(filter(() => !this.instanceEspec.isPopupOpen()))
    const focus = this.focus$
    return merge(text, focus, click).pipe(
      mergeMap(term => {
        if (term != '') {
          return this.autoCompleteEspec(term)
        }
      })
    )
  }

  formatterPro = (x: Profissional) => {
    return x ? x.pessoa.nome_completo : ''
  }

  formatterEspec = (x: EspecialidadeModel) => {
    return x ? x.descricao : ''
  }

  private async autoCompleteEspec(name: string) {
    if (!name) {
      return of([])
    }
    const res = await this.especialidadeServ.getWithFilter(name)
    if (res) {
      if (res.length > 1) {
        return res
      }
      return [res]
    }
  }

  formatterProToShow(item: Profissional): string {
    let especialidade = ''
    if (item.especialidades.length) {
      especialidade = item.especialidades[0].descricao
    }
    return `${item.pessoa.nome_completo}, ${this.formatterEspecToPro(especialidade)} - ${
      item.ufConselho
    }`
  }

  formatterEspecToShow(item: EspecialidadeModel): string {
    if (item) {
      return item.descricao
    }
  }

  private formatterEspecToPro(espec: string) {
    let es = espec.replace(/_/g, ' ')
    es = this.utilsServ.toCamelCase(es)
    es = es.replace(/De/g, 'de')
    es = es.replace(/Da/g, 'da')
    es = es.replace(/Do/g, 'do')
    es = es.replace(/E/g, 'e')
    return es
  }

  selectPro(evt) {
    this.selectedPro = evt.item
  }

  selectEspec(evt) {
    this.selectedEspec = evt.item
  }

  checkSelectedPro() {
    if (!this.selectedPro) {
      // this.form.patchValue({
      //   profissionalReferenciado: undefined
      // })
    }
  }

  checkSelectedEspec() {
    if (!this.selectedEspec) {
      this.form.patchValue({
        especialidade: undefined
      })
    }
  }
}
