import { AtendimentoState } from './_modules/atendimento/atendimento.state'
import { BeneficiarioState } from './_modules/beneficiario/beneficiario.state'
import { CredenciaisState } from './_modules/credenciais/credenciais.state'
import { EmpresaState } from './_modules/empresa/empresa.state'
import { ErrorsStateModel } from './_modules/errors/errors.state'
import { ExamesState } from './_modules/exames/exames.state'
import { HistoricoState } from './_modules/historico/historico.store'
import { LocalState } from './_modules/local/local.state'
import { ProfissionalState } from './_modules/profissional/profissional.state'
import { ReferenciasState } from './_modules/referencias/referencias.state'
import { CanalState } from './_modules/telemedicina/canal.state'
import { AgendamentoState } from './_modules/agendamento/agendamento.state'
import { ReferenciaState } from './_modules/referencias/referencia.state'

// PEPState - Conjunto de dados referente ao estado atual do sistema
export interface PEPState {
  credenciais: CredenciaisState
  empresa: EmpresaState
  atendimento: AtendimentoState
  agendamento?: AgendamentoState
  beneficiario: BeneficiarioState
  historico?: HistoricoState
  referencias?: ReferenciasState
  referencia: ReferenciaState
  exames?: ExamesState
  profissional: ProfissionalState
  local: LocalState
  canal: CanalState
  auth?: {}
  errors: ErrorsStateModel
}

export const KEYS_TO_LOCAL_STORAGE: string[] = [
  'credenciais',
  'empresa',
  'atendimento',
  'agendamento',
  'beneficiario',
  'historico',
  'referencias',
  'referencia',
  'exames',
  'profissional',
  'local',
  'canal'
]
