import { Directive, Renderer2, ElementRef, Input, OnInit } from '@angular/core'

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[color]'
})
export class ColorDirective implements OnInit {
  @Input() color: string
  constructor(private render: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    if (this.render && this.color) {
      const apply: { type: string; params: any } = this.getColor(this.color)
      switch (apply.type) {
        case 'true-color': // valor de uma cor hexadecimal
          this.render.setStyle(
            this.el.nativeElement,
            'background-color',
            apply.params.bg
          )
          this.render.addClass(this.el.nativeElement, apply.params.contrast)
          break
        case 'true-params':
          this.render.setStyle(
            this.el.nativeElement,
            'color',
            apply.params.contrast
          )
          this.render.setStyle(
            this.el.nativeElement,
            'background-color',
            apply.params.contrast
          )
          break
        case 'true-name': // nome de uma cor em scss
          this.render.addClass(this.el.nativeElement, apply.params.bg)
          this.render.addClass(this.el.nativeElement, apply.params.contrast)
          break
        default:
          // nenhum valor informado
          this.render.addClass(this.el.nativeElement, apply.params.bg)
          this.render.addClass(this.el.nativeElement, apply.params.contrast)
          break
      } // switch
    }
  }

  private getColor(str: string): { type: string; params: any } {
    if (!str) {
      // caso nenhum tenha sido passado

      return {
        type: 'default',
        params: {
          bg: 'bg-primary',
          contrast: 'contrast-primary'
        }
      }
    }

    if (str[0] === '#') {
      return {
        type: 'true-color',
        params: {
          bg: str,
          contrast: 'contrast-light'
        }
      }
    } else if (str.includes('{')) {
      const param = JSON.parse(str)
      return {
        type: 'true-params',
        params: {
          bg: param.bg,
          contrast: param.contrast
        }
      }
    } else {
      return {
        type: 'true-name',
        params: {
          bg: str,
          contrast: 'contrast-' + str
        }
      }
    }
  } // getColor
}
