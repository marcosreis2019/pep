import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {
  transform(date: string): string {
    const dateAr  = date.split('-').map(elem => +elem)
    const result = this.calcAge(new Date(dateAr[0], dateAr[1], dateAr[2]))
    return (result > 1) ? result + ' anos' : result + ' ano'
  }

  calcAge(dob): number {
    const diff = Date.now() - dob.getTime()
    const age = new Date(diff)
    return Math.abs(age.getUTCFullYear() - 1970)
  }
}
