import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoActions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import { QuestionariosModels } from 'src/app/_store/_modules/atendimento/atendimento.questionario.model'
import { AtendimentoSelect as Select } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { SubSink } from 'subsink'

@Component({
  selector: 'dynamic-form-genarator',
  templateUrl: './dynamic-form-genarator.component.html',
  styleUrls: ['./dynamic-form-genarator.component.scss']
})
export class DynamicFormGenaratorComponent implements OnInit, OnDestroy {
  @Input() $inputs: Observable<QuestionariosModels.DynamicFormInput[]>
  @Input() origin: string
  @Input() parent: string

  @Output() export: EventEmitter<any>

  inputs: QuestionariosModels.DynamicFormInput[]

  isLoaded: boolean

  form: FormGroup
  bullets: string[]
  requiredQuestions = 0

  touched: boolean
  forceCloseOnScroll$ = new Subject<boolean>()

  private subs$ = new SubSink()
  public config: PerfectScrollbarConfigInterface = {}

  constructor(private store: Store<PEPState>, private formB: FormBuilder) {
    this.export = new EventEmitter()
  }

  ngOnInit() {
    this.isLoaded = false
    this.touched = false
    this.form = this.formB.group({})

    this.store.select(Select.subjetivoComplete).pipe(
      map(() => {
        this.store.dispatch(
          AtendimentoActions.answeredRequiredQuestionsSubjetivo({
            payload: true
          })
        )
      })
    )

    this.store.select(Select.objetivoComplete).pipe(
      map(() => {
        this.store.dispatch(
          AtendimentoActions.answeredRequiredQuestionsObjetivo({
            payload: true
          })
        )
      })
    )

    this.subs$.add(
      this.form.valueChanges.subscribe(res => {
        this.touched = this.checkInputValues(res)
      })
    )

    if (this.$inputs) {
      this.subs$.add(
        this.$inputs.subscribe(inputs => {
          this.prepareForm(inputs)
        })
      )
    }
  }

  ngOnDestroy() {
    this.touched = false
    this.subs$.unsubscribe()
  }

  monitory(evt: any) {
    this.forceCloseOnScroll$.next(true)
  }

  getOsbFromForceClose(): Observable<boolean> {
    return this.forceCloseOnScroll$.asObservable()
  }

  private prepareForm(inputs: QuestionariosModels.DynamicFormInput[]) {
    if (inputs.length) {
      inputs.forEach((input: QuestionariosModels.DynamicFormInput) => {
        const validators = input.required ? Validators.required : undefined
        const control = this.formB.control(undefined, validators)
        this.form.addControl(input.id, control)
      })
    }
    this.isLoaded = true
    this.inputs = inputs

    return
  }

  send() {
    const v = this.form.value // TODO possivel ajuste para quando o form nao tiver nenhuma resposta pois vai quebrar a requist de post resposta
    const body = { payload: { answers: v, inputs: this.inputs } }

    if (this.parent === 'subjetivo') {
      this.store.dispatch(
        AtendimentoActions.answeredRequiredQuestionsSubjetivo({
          payload: true
        })
      )
    }

    if (this.parent === 'objetivo') {
      this.store.dispatch(
        AtendimentoActions.answeredRequiredQuestionsObjetivo({
          payload: true
        })
      )
    }

    this.export.emit(body)
  }

  private checkInputValues(obj: object): boolean {
    return Object.keys(obj).some(key => obj[key])
  }
}
