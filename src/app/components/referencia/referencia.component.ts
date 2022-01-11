import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'referencia',
  templateUrl: './referencia.component.html',
  styleUrls: ['./referencia.component.scss']
})
export class ReferenciaComponent implements OnInit {
  @Input() data: any
  profissionalReferenciado = undefined
  especialidade = ''

  constructor() {}

  ngOnInit() {
    if (this.data) {
      this.profissionalReferenciado = this.data.profissionalReferenciado
      if (this.data.especialidade && this.data.especialidade !== '') {
        this.especialidade = this.data.especialidade.descricao
      }
    }
  }
}
