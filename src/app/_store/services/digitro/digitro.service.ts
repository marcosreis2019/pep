import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DigitroService {

  constructor(
    private http: HttpClient
  ) { }

  postAudio(audio: File) {
    const options = { headers: new HttpHeaders({
      'limit'         : '1000000000',
      'processData'   : 'false',
      'Content-Type'  : audio.type,
      'Content-Length': audio.size.toString()
    })}

    const data = new FormData()
    data.append('arquivoAudio', audio)
    const urlAPI = 'http://35.199.124.9:3000/converteAudio'
    const url = 'http://services.retextoar.com.br:8000/process'
    return this.http.post(urlAPI, data)
  } 
}
