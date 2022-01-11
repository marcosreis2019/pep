import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  get(key: string) {
    // TODO make a promise
    const item = localStorage.getItem(key)
    return JSON.parse(item)
  }

  set(key: string, value: any) {
    // TODO make a promise
    const item = JSON.stringify(value)
    return localStorage.setItem(key, item)
  }
}
