import { BeneficiarioModels } from 'src/app/_store/_modules/beneficiario/beneficiario.model'

interface BeneficiarioItemListState<T> {
  list: T[]
  createS: string
  createF: string
  deleteS: string
  deleteF: string
}

interface AlergiasState extends BeneficiarioItemListState<BeneficiarioModels.Alergia> {}
interface CondicoesState extends BeneficiarioItemListState<BeneficiarioModels.Condicao> {}
interface MedicamentosState extends BeneficiarioItemListState<BeneficiarioModels.Medicamento> {}

class BeneficiarioItemState<T> implements BeneficiarioItemListState<T> {
  list: T[]
  createS: string
  createF: string
  deleteS: string
  deleteF: string
  constructor() {
    this.list = []
    this.createF = undefined
    this.createS = undefined
    this.deleteF = undefined
    this.deleteS = undefined
  }
}

export class AlergiaState extends BeneficiarioItemState<BeneficiarioModels.Alergia>
  implements AlergiaState {}
export class CondicaoState extends BeneficiarioItemState<BeneficiarioModels.Condicao>
  implements CondicaoState {}
export class MedicamentoState extends BeneficiarioItemState<BeneficiarioModels.Medicamento>
  implements MedicamentoState {}

export interface TagList {
  auth: BeneficiarioModels.FilterTag[] // tags para visualização na folha de rosto
  admin: BeneficiarioModels.FilterTag[] // tags para visualização na folha de rosto
  health: BeneficiarioModels.FilterTag[] // tags para visualização na folha de rosto
}

export interface BeneficiarioState {
  dadosPessoais: BeneficiarioModels.DadosPessoais
  familia: any // informações básicas sobre dependentes
  familiaError: string
  condicoes: CondicoesState // codições de saúde constatas por CIDs
  medicamentos: MedicamentosState // medicamentos em uso
  alergias: AlergiasState // alergias confirmadas
  tags: TagList
  tagsError: string
  loading: boolean
}

export class BeneficiarioState implements BeneficiarioState {
  dadosPessoais: BeneficiarioModels.DadosPessoais = undefined
  familia = undefined
  familiaError: string = undefined
  alergias = new BeneficiarioItemState<BeneficiarioModels.Alergia>()
  condicoes = new BeneficiarioItemState<BeneficiarioModels.Condicao>()
  medicamentos = new BeneficiarioItemState<BeneficiarioModels.Medicamento>()
  tags: TagList = {
    auth: [{ tag: undefined, cor: undefined, data: [] }],
    admin: [{ tag: undefined, cor: undefined, data: [] }],
    health: [{ tag: undefined, cor: undefined, data: [] }]
  }
  tagsError: string = undefined
  loading = true
}
