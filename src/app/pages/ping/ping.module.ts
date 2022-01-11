import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PingComponent } from './ping.component'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [PingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: PingComponent
    }])
  ]
})
export class PingModule { }
