import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FinishComponent } from './finish.component'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [FinishComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: FinishComponent
    }])
  ]
})
export class FinishModule { }
