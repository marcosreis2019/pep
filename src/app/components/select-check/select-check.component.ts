import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { QuestionariosModels } from 'src/app/_store/_modules/atendimento/atendimento.questionario.model'
import { Subscription, Observable } from 'rxjs'

@Component({
  selector: 'select-check',
  templateUrl: './select-check.component.html',
  styleUrls: ['./select-check.component.scss']
})
export class SelectCheckComponent implements OnInit, OnDestroy {
  @ViewChild('pop', { static: false }) popOver: ElementRef
  @ViewChild('generatorHolder', { static: false }) fatherPop: ElementRef

  @Input() placeholder = 'Selecione um ou mais'
  @Input() addClass = ''
  @Input() options: any[] = []
  @Input() forceCloseWhen$?: Observable<boolean>

  @Output() export: EventEmitter<any>

  plcHolder: string
  defaultPlcHolder: string
  toShow: boolean
  totalFocus: number = 0

  focus: boolean

  selecteds: QuestionariosModels.SelectCheckOption[]
  optionsToShow: QuestionariosModels.SelectCheckOption[]

  sub$: Subscription

  constructor(private el: ElementRef) {
    this.selecteds = []
    this.toShow = false
    this.export = new EventEmitter()
  }

  ngOnInit() {
    this.plcHolder = this.placeholder
    this.defaultPlcHolder = this.placeholder
    this.optionsToShow = this.convert(this.options)
    this.sub()
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe()
    }
  }

  sub() {
    if (this.forceCloseWhen$) {
      this.sub$ = this.forceCloseWhen$.subscribe(() => {
        this.toShow = false
        this.totalFocus = 0
      })
    }
  }
  convert(arr: any[]): QuestionariosModels.SelectCheckOption[] {
    return arr.map(e => {
      return { ...e, selected: false }
    })
  }

  transform(selected, index) {
    this.optionsToShow[index].selected = selected
    this.selecteds = this.optionsToShow.filter(e => e.selected)
  }

  onFocus() {
    this.focus = true
  }

  onClick() {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const fatherPos = this.getXY(this.fatherPop.nativeElement.getBoundingClientRect())

    const posX = windowWidth - fatherPos.x < 420 ? windowWidth - 420 : fatherPos.x
    const posY = windowHeight - fatherPos.y < 270 ? windowHeight - 270 : fatherPos.y + 40

    this.popOver.nativeElement.style.left = posX + 'px'
    this.popOver.nativeElement.style.top = posY + 'px'
    if (this.totalFocus == 0) {
      this.toShow = true
      this.totalFocus++
    } else if (this.totalFocus == 1) {
      this.toShow = false
      this.totalFocus = 0
    }
  }

  getXY(el) {
    const { x, y } = el
    return { x, y }
  }

  apply() {
    const len = this.selecteds.length
    const toExport = this.selecteds.map(e => e.original.id)

    this.plcHolder = len
      ? this.getPlaceholder(len, this.selecteds[0].label, this.optionsToShow.length)
      : this.defaultPlcHolder

    this.export.emit(toExport)
    this.totalFocus = 0
    this.show()
  }

  private getPlaceholder(len: number, label: string, lenOptions: number): string {
    switch (true) {
      case len === 1:
        return label
      case len > 1 && len === lenOptions:
        return 'Todos selecionados'
      default:
        return `${len} selecionados`
    }
  }

  show(ev?) {
    this.toShow = !this.toShow
  }
}
