import { Directive, OnInit, ElementRef, Renderer2 } from '@angular/core'

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[button]'
})
export class ButtonDirective implements OnInit {
  constructor(private render: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    if (this.render && this.el) {
      this.render.setStyle(this.el.nativeElement, 'cursor', 'pointer')
      this.render.setStyle(this.el.nativeElement, 'padding', '.313rem .625rem')
      this.render.setStyle(this.el.nativeElement, 'display', 'inline-block')
      this.render.setStyle(this.el.nativeElement, 'font-size', '1rem')
      this.render.setStyle(this.el.nativeElement, 'text-align', 'center')
      this.render.setStyle(this.el.nativeElement, 'line-height', '1rem')
      this.render.setStyle(this.el.nativeElement, 'border-radius', '1.4rem')
      this.render.setStyle(this.el.nativeElement, 'transition', '0.5s')
      this.render.setStyle(this.el.nativeElement, 'margin-left', '0.1rem')
      this.render.setStyle(this.el.nativeElement, 'margin-right', '0.1rem')
      this.render.setStyle(this.el.nativeElement, 'margin-bottom', '0.3rem')
      this.render.setStyle(this.el.nativeElement, 'border', '0')

      this.render.addClass(this.el.nativeElement, 'bg-primary')
      this.render.addClass(this.el.nativeElement, 'txt-light')
    }
  }
}
