import { NgModule } from '@angular/core'
import { AgePipe } from './age/age.pipe'
import { DateFormatPipe } from './date-format/date-format.pipe'
import { TimelineIconPipe } from './timeline-icon/timeline-icon.pipe'

@NgModule({
  declarations: [
    AgePipe,
    DateFormatPipe,
    TimelineIconPipe
  ],
  exports: [
    AgePipe,
    DateFormatPipe,
    TimelineIconPipe
  ]
})
export class PipesModule { }
