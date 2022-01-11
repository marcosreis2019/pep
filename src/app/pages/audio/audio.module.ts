import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioComponent } from './audio.component';
import { RouterModule } from '@angular/router';
import { DigitroService } from 'src/app/_store/services/digitro/digitro.service';
import { RecorderService } from 'src/app/_store/services/recorder/recorder.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AudioComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{path: '', component: AudioComponent}])
  ],
  providers: [DigitroService, RecorderService],
  exports: [RouterModule]
})
export class AudioModule { }
