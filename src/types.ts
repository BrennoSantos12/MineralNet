export type MineralType = 'gold' | 'cassiterite' | 'manganese'

export interface Batch {
  id: string
  code: string
  mineralType: MineralType
  weight: number // gramas (ouro), kg (cassiterita) ou toneladas (manganês)
  purity: number // teor %
  date: string
  location: string
  partnerName: string
  isOfflinePending: boolean
  isSynced: boolean
  valueBRL: number
}

export interface CalculatorSettings {
  mineralType: MineralType
  marketPrice: number
  weight: number
  purity: number
  dieselCost: number
  landownerPercentage: number
  meeirosPercentage: number
  plgPercentage: number
  reinvestmentPercentage: number
}
