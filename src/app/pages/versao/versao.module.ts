import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { VersaoComponent } from './versao.component'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [VersaoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: VersaoComponent
    }])
  ]
})
export class VersaoModule { }
