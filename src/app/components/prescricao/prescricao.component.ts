import { Component, OnInit, Input } from '@angular/core'

interface Prescricao {
  data: any
}

@Component({
  selector: 'prescricao',
  templateUrl: './prescricao.component.html',
  styleUrls: ['./prescricao.component.scss']
})
export class PrescricaoComponent implements OnInit {
  @Input() prescricao: Prescricao

  dadosPrescricao
  medicamentos = []
  constructor() {}
  nomeMedico = ''
  data = ''
  horario = ''
  id = ''

  ngOnInit() {
    if (this.prescricao && this.prescricao.data) {
      this.data = this.prescricao.data.attributes.data
      this.horario = this.prescricao.data.attributes.horario
      this.id = this.prescricao.data.id
      this.nomeMedico = this.prescricao.data.attributes.medicos.nome_completo
      this.medicamentos = this.prescricao.data.attributes.medicamentos
    }
  }
}
