import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { PEPState } from 'src/app/_store/store.models'
import { BeneficiarioActions } from 'src/app/_store/_modules/beneficiario/beneficiario.action'
import { BeneficiarioModels } from 'src/app/_store/_modules/beneficiario/beneficiario.model'
import { SubSink } from 'subsink'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'

export interface AlertEvent {
  type: string
  message: string
}

export interface BlockList<T> {
  title: string
  data$: Observable<T>
  notifySuccess$?: Observable<AlertEvent>
  notifyFail$?: Observable<AlertEvent>
  notify$?: Observable<AlertEvent>
  filters: string[]
  label: string
}

@Component({
  selector: 'block-list',
  templateUrl: './block-list.component.html',
  styleUrls: ['./block-list.component.scss']
})
export class BlockListComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('searchInp', { static: false }) searchInput: ElementRef
  @ViewChild('tooltip', { static: false }) tooltip: NgbTooltip
  @ViewChild('p1', { static: false }) popover: NgbPopover
  @ViewChild('p2', { static: false }) editMedicationPopover: NgbPopover

  @Input() info: BlockList<
    BeneficiarioModels.Condicao[] | BeneficiarioModels.Medicamento[] | BeneficiarioModels.Alergia[]
  >
  @Output() event: EventEmitter<{ type: string; label: string; data?: any }>
  @Input() acoes: boolean = true
  private subs = new SubSink()

  key: string
  label: string
  list: any[]
  listBackup: any[]
  limit: number
  isloading: boolean
  errorMessage: string

  searchEnabled: boolean
  selectedItem: any

  notification: string
  notificationClass: string
  mpi: string
  descricao = ''

  activePopover

  constructor(private store: Store<PEPState>) {
    this.event = new EventEmitter()
  }

  ngOnInit() {
    if (this.info) {
      if (this.info.label) {
        this.retriveLabel(this.info.label)
      }
      if (this.info.title) {
        this.descricao = this.info.title
      }
    }
    this.subs.add(
      this.store.select(BeneficiarioSelect.mpi).subscribe(data => {
        if (data) {
          this.mpi = data
          this.load()
        }
      })
    )
  }

  ngOnChanges() {
    this.reload()
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  load() {
    this.subs.add(
      this.info.data$.subscribe(
        list => {
          if (list && list.length) {
            this.setList(list)
            return
          }
          this.setList([])
        },
        e => {
          this.setList([])
          this.errorMessage = e
        }
      )
    )

    if (this.info.notify$) {
      this.subs.add(
        this.info.notify$.subscribe(content => {
          this.showTooltip(content)
        })
      )
    }

    if (this.info.notifySuccess$) {
      this.subs.add(
        this.info.notifySuccess$.subscribe(content => {
          if (content.message) {
            this.showTooltip(content)
          }
        })
      )
      this.subs.add(
        this.info.notifyFail$.subscribe(content => {
          if (content.message) {
            this.showTooltip(content)
          }
        })
      )
    }
  }

  reload() {
    this.list = undefined
    this.listBackup = undefined
    this.errorMessage = undefined
    this.activePopover = undefined
    this.subs.unsubscribe()
    this.load()
  }

  setList(
    list:
      | BeneficiarioModels.Condicao[]
      | BeneficiarioModels.Medicamento[]
      | BeneficiarioModels.Alergia[]
  ) {
    this.list = [...list]
    this.listBackup = [...list]
    this.limit = 5
  }

  retriveLabel(label: string) {
    const mapLabel = {
      condicao: 'condições de saúde registradas',
      medicamento: 'medicamentos registrados',
      agente: 'alergias registradas'
    }

    const l = mapLabel[label]

    this.label = l ? l : 'dado'
  }

  enableSearch() {
    this.searchEnabled = true
    this.setFocustSearch()
  }

  disableSearch() {
    this.searchEnabled = false
    this.search()
  }

  setFocustSearch() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus()
    }, 0)
  }

  clear() {
    this.key = undefined
    this.search()
    this.setFocustSearch()
  }

  search(key?: string) {
    if (!key || key === '') {
      this.list = [...this.listBackup]
      return
    }

    this.list = this.listBackup.filter(elem => {
      let res = false

      for (const i in this.info.filters) {
        const f = this.info.filters[i]
        if (
          elem[f]
            .toString()
            .toLowerCase()
            .includes(key.toLowerCase())
        ) {
          res = true
          break
        }
      }

      return res
    })
  }

  showMore() {
    this.limit = this.list.length
  }

  showLess() {
    this.limit = 5
  }

  add() {
    this.event.emit({ type: 'add', label: this.info.label })
  }

  openPopover(popover: NgbPopover, item?: any) {
    // se o this.popover ja esta aberto e a funcao é chamada de novo, é provavel que seja o popoveer de editar medicacao
    if (this.popover.isOpen() && popover) {
      this.editMedicationPopover = popover
      this.editMedicationPopover.open()
      return
    }
    this.selectedItem = undefined
    this.selectedItem = { ...item }
    this.popover.open()
  }

  closePopover() {
    if (this.editMedicationPopover && this.editMedicationPopover.isOpen()) {
      this.editMedicationPopover.close()
      return
    }
    this.popover.close()
    this.selectedItem = undefined
  }

  confirmCondition(condition) {
    const conditionToConfirm: any = { ...this.selectedItem }
    conditionToConfirm.confirmado = condition.confirmado === true ? true : false
    this.store.dispatch(
      BeneficiarioActions.putCondicao({ payload: { data: conditionToConfirm, mpi: this.mpi } })
    )
  }

  remove(item) {
    this.closePopover()
    // remove condicao
    if (item.condicao) {
      this.store.dispatch(
        BeneficiarioActions.deleteCondicao({ payload: { data: item, mpi: this.mpi } })
      )
    }
    // remove medicamento
    if (item.principio_ativo) {
      this.store.dispatch(
        BeneficiarioActions.deleteMedicamento({ payload: { data: item, mpi: this.mpi } })
      )
    }
    // remove alergia
    if (item.agente) {
      this.store.dispatch(
        BeneficiarioActions.deleteAlergia({ payload: { data: item, mpi: this.mpi } })
      )
    }
  }

  editMedication(medication: BeneficiarioModels.Medicamento) {
    if (medication) {
      this.store.dispatch(
        BeneficiarioActions.putMedicamento({ payload: { data: medication, mpi: this.mpi } })
      )
      this.closePopover()
    } else {
      console.error('O medicamento não é válido :', medication)
    }
  }

  showTooltip(content: { type: string; message: string }) {
    this.notification = content.message
    this.notificationClass = 'tooltip-' + content.type

    setTimeout(() => {
      this.tooltip.open()
    }, 100)

    setTimeout(() => {
      if (this.tooltip.isOpen()) {
        this.tooltip.close()
      }
    }, 2000)
  }
}
