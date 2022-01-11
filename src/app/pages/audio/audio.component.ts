import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RecorderService } from 'src/app/_store/services/recorder/recorder.service';
import { DigitroService } from 'src/app/_store/services/digitro/digitro.service';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent implements OnInit, OnDestroy {
  isRecording = false;
  recordedTime: any;
  blobUrl     : any;

  value: string

  constructor(
    private audioRecordingService: RecorderService, 
    private sanitizer            : DomSanitizer,
    private digitroAPI           : DigitroService  
  ) {
    this.value = ''
  }
  
  ngOnInit() {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isRecording = false;
    });
  
    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.recordedTime = time;
    });
  
    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      
      if (data && data.blob) {
        this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
        const file = this.convertToFile(data.blob)
        this.digitroAPI.postAudio(file)
          .subscribe(res => {
            this.getText(res)
          })
      }
    });
  }

  getText(res) {
    if (res.parts) {
      res.parts.forEach( p => {
        this.value += p.displaytext
        this.value += `\n`
      })
    }
  }

  convertToFile(blob: Blob): File {
    return new File([blob], 'audio', { type: blob.type })
  }

  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

}
