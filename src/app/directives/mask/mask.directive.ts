import {
  Directive,
  Input,
  HostListener,
  Renderer2,
  ElementRef
} from '@angular/core'

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mask]'
})
export class MaskDirective {
  @Input() mask: string

  @HostListener('keyup', ['$event']) onKeyUp(event) {
    const target = event.target

    if (event.keyCode !== 8 && this.mask && this.mask !== '') {
      // REVIEW aparentemente, com js, existe um delay ao passar uma variavel de função à função.
      // Por isso, ao chamar no final dessa thread, o valor não é convertido totalmente pela regex
      // que remove todos os caracteres que não sejam do tipo número.
      this.setValue(target.value)
    }
  }

  constructor(private render: Renderer2, private el: ElementRef) {}

  private setValue(value) {
    if (this.render && this.el) {
      this.render.setProperty(
        this.el.nativeElement,
        'value',
        maskTo(this.mask, value.replace(/\D/g, ''))
      )
    }
  }
}

// NOTE se chamar diretamente passe o value já formatado com replace(/\D/g, '')
export function maskTo(type, value: string) {
  switch (type) {
    case 'date':
      return formatNumber('##/##/####', value)
    case 'time':
      return formatNumber('##:##', value)
    case 'cep':
      return formatNumber('##.###-###', value)
    case 'cpf':
      return formatNumber('###.###.###-##', value)
    case 'cnpj':
      return formatNumber('##.###.###/####-##', value)
    case 'phone':
      return formatNumber('(##) ?####-####', value)
    case 'real':
      return formatCurrency(value)
    case '':
      return value
    case undefined:
      return value
    default:
      return formatNumber(type, value)
  }
}

function formatCurrency(value: string) {
  if (value.length <= 1) {
    value = '0' + value
  }
  value = value.replace(/([0-9]{2})$/g, '.$1')
  const parsed = parseFloat(value)
  return parsed.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

// NOTE se chamar diretamente passe o value já formatado com replace(/\D/g, '')
function formatNumber(mask: string, value: string): string {
  let result = []
  let response

  if (mask.includes('?')) {
    const min = mask.match(/#/g)

    if (value.length <= min.length) {
      // TODO Remover caracter em branco após o ?
      result = replacement(mask.replace(/\?/g, '').split(''), value)
    } else {
      result = replacement(mask.replace(/\?/g, '#').split(''), value)
    }
  } else {
    result = replacement(mask.split(''), value)
  }

  response = result.join('').replace(/#(.*)/g, '') // remove todos os caracteres restantes que a partir de um # existente
  return response
}

function replacement(maskArr, value) {
  const result = []
  for (let index = 0, ponto = 0; index < maskArr.length; index++) {
    let replaced: string

    if (value[ponto] && maskArr[index] === '#') {
      replaced = maskArr[index].replace(/#/g, value[ponto])
      ponto++
    } else {
      replaced = maskArr[index]
    }

    result.push(replaced)
  }

  return result
}

// REVIEW Exemplos de uso caso preciso utilizar com JS Vanilla
// function exemploDeUsoComJSPuro() {
//   document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("<id-do-seu-input>").addEventListener('keyup', function (event) {
//       const value = event.target.value.replace(/\D/g, '')

//       const newValue = maskTo('cpf', value)

//       document.getElementById("<id-do-seu-input>").innerHTML = newValue
//     })
//   })
// }
