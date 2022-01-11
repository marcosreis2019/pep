import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Route } from '@angular/router'

import { NotFoundComponent } from './not-found.component'

const ROUTES: Route[] = [
  { path: '', component: NotFoundComponent }
]

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class NotFoundModule { }
