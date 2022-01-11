import { Injectable } from '@angular/core'
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http'

export interface Responses<T> {
  status ?: string,
  code   ?: number | string,
  message?: string,
  data   ?: T
}


@Injectable({ providedIn: 'root'})
export class GenericService {
  constructor() {}
  protected  createOptions(token: string) {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    }
  }

  protected successHandler<T>(data: T, origin: string, message?: string): Responses<T> {
    return { data, message }
  }

  protected errorHandler(e: any | HttpErrorResponse, origin: string, msg?:string, code?: number | string): Responses<any> {
    return { status: 'error', message: msg, code }
  }

  protected isSuccessStatusCode(status: number): boolean {
    const s = +`${status}`.toString().substr(0, 2) // pega os dois primeiro digitos do status
    return s === 20
  }
}
