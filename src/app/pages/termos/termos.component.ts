import { Component, OnDestroy, OnInit } from '@angular/core'
import { SubSink } from 'subsink'
import { ToastService } from 'angular-toastify'
import { TermosModels } from 'src/app/_store/_modules/termos/termos.model'
import { TermosService } from 'src/app/_store/_modules/termos/termos.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'termos',
  templateUrl: './termos.component.html',
  styleUrls: ['./termos.component.scss']
})
export class TermosComponent implements OnInit, OnDestroy {
  private subs$ = new SubSink()

  key$ = new Subject<string>()
  search = ''

  listTermo: TermosModels.Termo[]
  listProcessos: Array<string> = []
  termo: TermosModels.Termo = {
    id: 0,
    texto: '',
    ativo: true,
    processo: ''
  }

  imgLoading = require('../../../assets/icons/spinner.svg')

  loading = false
  loadingList = false
  title = 'Novo Termo'
  constructor(private termoService: TermosService, private toastService: ToastService) {}

  ngOnInit() {
    this.search = ''
    this.loadingList = true
    this.loadList()
  }

  loadList() {
    this.loadingList = true
    this.termoService.getAll().subscribe(
      res => {
        this.loadingList = false
        if (res && res.data && res.data.length > 0) {
          this.listTermo = res.data
        }
      },
      err => {
        this.loadingList = false
        this.toastService.error('Não foi possível carregar lista de Termos!')
        console.error(err)
      }
    )

    this.termoService.getAllProcessos().subscribe(
      res => {
        this.listProcessos = res.data && res.data.length ? res.data : []
      },
      err => {
        this.loadingList = false
        this.toastService.error('Não foi possível carregar lista de Termos!')
        console.error(err)
      }
    )
  }

  setTermo(obj) {
    this.termo = { ...obj }
    this.title = obj.processo
  }

  reset() {
    this.termo = {
      id: 0,
      texto: '',
      ativo: true,
      processo: ''
    }
    this.title = 'Novo Termo'
  }

  salvar() {
    this.loading = true
    if (this.termo.id) {
      this.update(this.termo.id, this.termo)
    } else {
      this.create(this.termo)
    }
  }

  create(termo) {
    this.subs$.add(
      this.termoService.post(termo).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Tipo Serviço cadastrado com sucesso!')
          this.loadList()
          this.termo.id = data
          this.title = termo.processo
        },
        err => {
          this.toastService.error('Não foi possível criar Tipo Serviço! ' + err.error.error)
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  update(id, termo) {
    this.subs$.add(
      this.termoService.put(id, termo).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Termo alterado com sucesso!')
          this.loadList()
        },
        err => {
          this.toastService.error('Não foi possível atualizar o Termo! ' + err.error.error)
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  isEmpty(obj) {
    if (!obj || obj.length <= 0) {
      return true
    }
    return false
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  loadProcessos() {}
}
