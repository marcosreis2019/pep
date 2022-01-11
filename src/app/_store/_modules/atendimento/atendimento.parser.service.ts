import { Injectable } from '@angular/core'
import { type } from 'os'

import { UtilsService } from 'src/app/providers/utils/utils.service'
import { QuestionariosModels as Models } from 'src/app/_store/_modules/atendimento/atendimento.questionario.model'

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  constructor(private utilsServ: UtilsService) {}

  /**
   * Responsável por tranformar as respostas vindas de um dynamic form para
   * o padrão de questionários do res.
   *
   * Ao final do processo será retornado um array de AnswerRes contendo
   * o id do questionário no res, e as respostas para o mesmo.
   * @param {res: object}
   * @param {inputs: DynamicFormInput[]}
   * @return {AnswerRes[]}
   */
  transformAnswerToRes(
    res: object,
    inputs: Models.DynamicFormInput[]
  ): Models.Answers[] {
    // resgata os id de todas as perguntas no formulário
    const keys = Object.keys(res)
    const referencias: Models.Answers[] = []

    let pergunta, form_id, resposta: Models.RespostaConteudo, value, form

    keys.forEach(pergunta_id => {
      value = res[pergunta_id]
      if (value) {
        let label
        resposta = {} as Models.RespostaConteudo
        // resgata a pergunta original
        pergunta = inputs.find(i => i.id === pergunta_id)
        // resgata o id do formulário original da pergunta
        form_id = pergunta.origin.id
        // resgata a resposta dada pelo usuário
        resposta['paraAPI'] = pergunta.origin.getAnswer(pergunta_id, value)
        // verifica se já existe algum conjunto de respostas para o id do formulário atual
        if (pergunta.options) {
          if (pergunta.typeInput === 'select-check') {
            const item = pergunta.options.find(o => o.value === value[0])
            label = item.label
          } else {
            const item = pergunta.options.find(o => o.value === value)
            label = item.label
          }
          // label = item.label
        }
        form = referencias.find(p => p.form_id === form_id)
        
        if (value && Array.isArray(value)) {
          let labelRespostaArray: string[] = []
          value.forEach(respostTemp => {
            let label = pergunta.options.find(o => o.value === respostTemp).label
            labelRespostaArray.push(label)
            resposta.paraRelatorio = {
              labelPergunta: pergunta.label,
              labelsRespostas: labelRespostaArray
            }
            if (form) {
              form.answers.push({...resposta})
            }
          })
        } else {
          resposta.paraRelatorio = {} as Models.RespostaRelatorio
          resposta.paraRelatorio.labelPergunta = pergunta.label
          resposta.paraRelatorio.labelResposta = label || value
          if (form) {
            form.answers.push({...resposta})
          }
        }
        
        // caso não tenha o id, um novo objeto de referência de respostas será criado
        if (!form) {
          form = { form_id, answers: [] }
          form.answers.push({...resposta})
          referencias.push(form)
        }
      }
    })

    return referencias
  }

  /**
   * Responsável por converter um array de perguntas originadas do questionário do RES (qualirede)
   * para um um array de Dynamic inputs e um Form Group.
   *
   * O form group gerado será usado para válidações de no dynamic forms, e o dynamic inputs
   * fornecessem as configurações visuais do fomulário, como placeholder, valor inicial, limites,
   * formato de saída, tipo de input html e assim por diante.
   *
   * @param {perguntas: Pergunta[]}
   * @return {inputs: DynamicFormInput[], form: FormGroup }
   */
  parseToDynamicForm(perguntas: Models.Pergunta[]): Models.DynamicFormInput[] {
    return perguntas.map(input => {
      // converte a pergunta em dynamic input
      const inp = this.convert(input)
      // atribui o id da pergunta ao formControlName de um reactiveForm
      inp.id = '' + input.id
      return inp
    })
  }

  /**
   * Realiza a conversão direta de uma Pergunta para um Dynamic Input
   *
   * @param {input: Pergunta}
   * @return {DynamicFormInput}
   */
  private convert(input: Models.Pergunta): Models.DynamicFormInput {
    let size: number
    let options: {
      label: string
      value: number
      original: Models.OpcoesPergunta
    }[]

    if (input.opcoes_pergunta) {
      // resgata a quantidade total de opções - será utilizado para definir como: select, select-check, radio ou check
      size = input.opcoes_pergunta.length
      // cria as opções para um dynamic input
      options = input.opcoes_pergunta.map(o => {
        return {
          label: this.utilsServ.toCamelCaseWithPrepositions(o.opcao),
          value: o.id,
          original: o
        }
      })
    }

    // defini o tipo e o callback especifico para formação do tipo (ABERTA, UNICA_ESCOLHA, MULTIPLA_ESCOLHA)
    const t: { type: Models.InputType; callback: any } = this.checkType(
      input.tipo,
      size,
      input.tipo_input
    )
    return {
      label: this.formatLabel(input.questao),
      typeInput: t.type,
      typeData: 'text',
      addClass: 'form-item',
      plcholder: '',
      options,
      required: !!input.requerida,
      origin: {
        getAnswer: t.callback,
        id: input.idQuestionario
      }
    }
  }

  private checkType(
    type1: string, // tipo da pergunta recebida (ABERTA, UNICA_ESCOLHA, MULTIPLA_ESCOLHA)
    size?: number, // quantidade de opcoes_pergunta dentro de uma pergunta
    type2?: string // tipo de valor atribuido à respota da pergunta
  ): { type: Models.InputType; callback: any } {
    switch (true) {
      case type1 === Models.TipoPergunta.ABERTA:
        return this.checkOpen(type2)

      case type1 === Models.TipoPergunta.UNICA_ESCOLHA:
        return this.checkSingle(size)

      case type1 === Models.TipoPergunta.MULTIPLA_ESCOLHA:
        return this.checkMulti()
    }
  }

  /**
   * Defini o tipo e o callback para inputs de texto direto (tipo ABERTO)
   * @param {type: string}
   * @param {id: number}
   * @return {InputType, callback}
   */
  private checkOpen(type: string): { type: Models.InputType; callback: any } {
    const tp =
      type === Models.TipoInputPergunta.REAL
        ? Models.InputType.INPUT
        : Models.InputType.TEXTAREA

    return { type: tp, callback: Models.TEXT_RESPOSTA }
  }

  /**
   * Defini o tipo e o callback para inputs estruturado com única opção (tipo UNICA_ESCOLHA)
   * @param {type: string}
   * @param {id: number}
   * @return {InputType, callback}
   */
  private checkSingle(size: number): { type: Models.InputType; callback: any } {
    const tp = size <= 3 ? Models.InputType.RADIO : Models.InputType.SELECT

    return { type: tp, callback: Models.UNICA_RESPOSTA }
  }

  /**
   * Defini o tipo e o callback para inputs estruturado com única opção (tipo MULTIPLA_ESCOLHA)
   * @param {type: string}
   * @param {id: number}
   * @return {InputType, callback}
   */
  private checkMulti(): { type: Models.InputType; callback: any } {
    return {
      type: Models.InputType.SELECT_CHECK,
      callback: Models.MULTIPLA_RESPOSTA
    }
  }

  private formatLabel(title: string): string {
    return title ? this.utilsServ.toCamelCaseWithPrepositions(title) : undefined
  }
}
