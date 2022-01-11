import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ColorDirective } from './color/color.directive'
import { MaskDirective } from './mask/mask.directive'
import { ButtonDirective } from './button/button.directive'

@NgModule({
  declarations: [ButtonDirective, ColorDirective, MaskDirective],
  imports: [CommonModule],
  exports: [ButtonDirective, ColorDirective, MaskDirective]
})
export class DirectivesModule {}
