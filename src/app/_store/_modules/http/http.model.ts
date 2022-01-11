import { HttpHeaders, HttpParams } from '@angular/common/http'

export interface HttpOptions {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[]
      }
  observe?: 'body'
  params?:
    | HttpParams
    | {
        [param: string]: string | string[]
      }
  reportProgress?: boolean
  responseType?: 'json'
  withCredentials?: boolean
}

export interface HttpOptionsZip {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[]
      }
  observe?: 'body'
  params?:
    | HttpParams
    | {
        [param: string]: string | string[]
      }
  reportProgress?: boolean
  responseType?: 'blob'
  withCredentials?: boolean
}
