import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class Events {

  private 
  private events
  
  constructor() {
    this.events = {}
  }

  publish(name: string, value: any) {
    const target: BehaviorSubject<any> = this.events[name]

    if (target) {
      target.next(value)
      return
    }
    
    this.events[name] = new BehaviorSubject<any>(undefined).next(value)
  }

  subscribe(name: string, callback) {
    if (!this.events[name]) {
      this.events[name] = new BehaviorSubject<any>(undefined)
    }

    this.events[name].subscribe(callback)
  }
}
