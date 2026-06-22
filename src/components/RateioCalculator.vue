<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { CalculatorSettings, MineralType } from '../types'

const calc = reactive<CalculatorSettings>({
  mineralType: 'gold',
  marketPrice: 380,
  weight: 150,
  purity: 92,
  dieselCost: 15400,
  landownerPercentage: 10,
  plgPercentage: 10,
  meeirosPercentage: 35,
  reinvestmentPercentage: 45,
})

const unitLabel = (t: MineralType) => (t === 'gold' ? 'g' : t === 'cassiterite' ? 'kg' : 't')

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const grossValue = computed(() => calc.weight * (calc.purity / 100) * calc.marketPrice)
const netRatevel = computed(() => Math.max(0, grossValue.value - calc.dieselCost))
const landownerValue = computed(() => netRatevel.value * (calc.landownerPercentage / 100))
const plgValue = computed(() => netRatevel.value * (calc.plgPercentage / 100))
const meeirosValue = computed(() => netRatevel.value * (calc.meeirosPercentage / 100))
const reinvestmentValue = computed(() => netRatevel.value * (calc.reinvestmentPercentage / 100))

type PercentField =
  | 'landownerPercentage'
  | 'meeirosPercentage'
  | 'plgPercentage'
  | 'reinvestmentPercentage'

// Mantém o total de rateio em 100%, redistribuindo entre os demais campos.
function adjustPercentages(fieldChanged: PercentField, value: number) {
  const allFields: PercentField[] = [
    'landownerPercentage',
    'meeirosPercentage',
    'plgPercentage',
    'reinvestmentPercentage',
  ]
  const otherFields = allFields.filter((f) => f !== fieldChanged)
  const remaining = 100 - value
  const sumOthers = otherFields.reduce((sum, f) => sum + calc[f], 0)

  const next: Record<PercentField, number> = {
    landownerPercentage: calc.landownerPercentage,
    meeirosPercentage: calc.meeirosPercentage,
    plgPercentage: calc.plgPercentage,
    reinvestmentPercentage: calc.reinvestmentPercentage,
  }
  next[fieldChanged] = value

  if (sumOthers > 0) {
    otherFields.forEach((f) => {
      const ratio = calc[f] / sumOthers
      next[f] = Math.round(remaining * ratio * 10) / 10
    })
  } else {
    const equalShare = remaining / otherFields.length
    otherFields.forEach((f) => {
      next[f] = Math.round(equalShare * 10) / 10
    })
  }

  const finalSum =
    next.landownerPercentage +
    next.meeirosPercentage +
    next.plgPercentage +
    next.reinvestmentPercentage
  if (finalSum !== 100) {
    const last = otherFields[otherFields.length - 1]
    next[last] = Math.round((next[last] + (100 - finalSum)) * 10) / 10
  }

  Object.assign(calc, next)
}

function onPercent(field: PercentField, e: Event) {
  adjustPercentages(field, parseFloat((e.target as HTMLInputElement).value))
}

function handleSelectMineral(type: MineralType) {
  let price = 380,
    qty = 150,
    pure = 90,
    diesel = 15000
  if (type === 'cassiterite') {
    price = 125
    qty = 2100
    pure = 75
    diesel = 42005
  } else if (type === 'manganese') {
    price = 850
    qty = 450
    pure = 45
    diesel = 95200
  }
  calc.mineralType = type
  calc.marketPrice = price
  calc.weight = qty
  calc.purity = pure
  calc.dieselCost = diesel
}

const presets = [
  { type: 'gold' as MineralType, label: 'Ouro (Itaituba)', price: 'R$ 380/g' },
  { type: 'cassiterite' as MineralType, label: 'Cassiterita (Rondônia)', price: 'R$ 125/kg' },
  { type: 'manganese' as MineralType, label: 'Manganês (Sudeste PA)', price: 'R$ 850/t' },
]

const priceRange = computed(() => ({
  min: calc.mineralType === 'gold' ? 200 : calc.mineralType === 'cassiterite' ? 50 : 400,
  max: calc.mineralType === 'gold' ? 600 : calc.mineralType === 'cassiterite' ? 300 : 1500,
}))
const weightRange = computed(() => ({
  min: calc.mineralType === 'gold' ? 20 : calc.mineralType === 'cassiterite' ? 200 : 50,
  max: calc.mineralType === 'gold' ? 1000 : calc.mineralType === 'cassiterite' ? 20000 : 2000,
  step: calc.mineralType === 'gold' ? 5 : calc.mineralType === 'cassiterite' ? 50 : 10,
}))
const dieselMax = computed(() =>
  calc.mineralType === 'gold' ? 100000 : calc.mineralType === 'cassiterite' ? 150000 : 300000,
)
</script>

<template>
  <section id="simulador" class="max-w-6xl mx-auto px-6 py-20">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <!-- Left: context + presets -->
      <div class="lg:col-span-4 space-y-6">
        <div>
          <span class="inline-block rounded-full bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 mb-4">
            Matemática operacional
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">Rateio comissivo sem atrito</h2>
        </div>
        <p class="text-slate-600 leading-relaxed">
          Em garimpos e lavras de permissão (PLGs), o cálculo de comissão de parcerias é complexo:
          é preciso deduzir o óleo diesel, insumos, a porcentagem do dono da terra, o titular do
          direito de lavra e a comissão de meação.
        </p>
        <p class="text-slate-600 leading-relaxed">
          Simule abaixo com parâmetros reais das principais lavras brasileiras e veja a precisão
          matemática fornecida pelo ecossistema MINERAL NET.
        </p>

        <div class="rounded-2xl bg-slate-50 border border-slate-100 p-6">
          <h4 class="text-sm font-bold text-slate-900 mb-1">Predefinições operacionais</h4>
          <p class="text-xs text-slate-500 mb-4">Carregue predefinições de commodities nacionais:</p>
          <div class="space-y-2">
            <button
              v-for="p in presets"
              :key="p.type"
              @click="handleSelectMineral(p.type)"
              :class="[
                'w-full px-4 py-2.5 text-sm font-semibold rounded-xl border transition flex items-center justify-between',
                calc.mineralType === p.type
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
              ]"
            >
              <span>{{ p.label }}</span>
              <span class="text-xs text-slate-400">{{ p.price }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: sliders + live result -->
      <div class="lg:col-span-8 rounded-3xl bg-white border border-slate-100 shadow-lg p-6 sm:p-10">
        <h3 class="text-lg font-bold text-slate-900 mb-8">Calculadora de partição de lavras</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 pb-8 border-b border-slate-100">
          <!-- Lote data -->
          <div class="space-y-6">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              1. Dados do lote
            </h4>

            <div>
              <div class="flex justify-between items-center text-xs font-semibold mb-2">
                <span class="text-slate-500">Valor de mercado</span>
                <span class="text-orange-600">R$ {{ calc.marketPrice }} / {{ unitLabel(calc.mineralType) }}</span>
              </div>
              <input
                v-model.number="calc.marketPrice"
                type="range"
                :min="priceRange.min"
                :max="priceRange.max"
                class="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between items-center text-xs font-semibold mb-2">
                <span class="text-slate-500">Peso bruto extraído</span>
                <span class="text-slate-700">{{ calc.weight }} {{ unitLabel(calc.mineralType) }}</span>
              </div>
              <input
                v-model.number="calc.weight"
                type="range"
                :min="weightRange.min"
                :max="weightRange.max"
                :step="weightRange.step"
                class="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between items-center text-xs font-semibold mb-2">
                <span class="text-slate-500">Teor metalúrgico est.</span>
                <span class="text-slate-700">{{ calc.purity }}%</span>
              </div>
              <input
                v-model.number="calc.purity"
                type="range"
                min="20"
                max="100"
                class="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between items-center text-xs font-semibold mb-2">
                <span class="text-orange-600">Dedução de óleo diesel</span>
                <span class="text-orange-600">R$ {{ calc.dieselCost.toLocaleString('pt-BR') }}</span>
              </div>
              <input
                v-model.number="calc.dieselCost"
                type="range"
                min="0"
                :max="dieselMax"
                step="500"
                class="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          </div>

          <!-- Rateio sliders -->
          <div class="space-y-6">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>2. Rateio contratual</span>
              <span class="text-[10px] text-slate-400 normal-case">Total: 100%</span>
            </h4>

            <div>
              <div class="flex justify-between items-center text-xs font-semibold mb-2">
                <span class="text-slate-500">Trabalho meeiro</span>
                <span class="text-orange-600">{{ calc.meeirosPercentage }}%</span>
              </div>
              <input
                :value="calc.meeirosPercentage"
                @input="onPercent('meeirosPercentage', $event)"
                type="range"
                min="5"
                max="70"
                class="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between items-center text-xs font-semibold mb-2">
                <span class="text-slate-500">Concessionária PLG</span>
                <span class="text-orange-600">{{ calc.plgPercentage }}%</span>
              </div>
              <input
                :value="calc.plgPercentage"
                @input="onPercent('plgPercentage', $event)"
                type="range"
                min="0"
                max="50"
                class="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between items-center text-xs font-semibold mb-2">
                <span class="text-slate-500">Superficiário (dono da terra)</span>
                <span class="text-orange-600">{{ calc.landownerPercentage }}%</span>
              </div>
              <input
                :value="calc.landownerPercentage"
                @input="onPercent('landownerPercentage', $event)"
                type="range"
                min="0"
                max="30"
                class="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <div class="flex justify-between items-center text-xs font-semibold mb-2">
                <span class="text-slate-500">Empresa operadora</span>
                <span class="text-orange-600">{{ calc.reinvestmentPercentage }}%</span>
              </div>
              <input
                :value="calc.reinvestmentPercentage"
                @input="onPercent('reinvestmentPercentage', $event)"
                type="range"
                min="10"
                max="80"
                class="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <!-- Live report -->
        <div class="rounded-2xl bg-slate-50 border border-slate-100 p-6">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Simulador de divisão de ativos
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <div class="rounded-xl bg-white border border-slate-100 p-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Valor bruto lote</span>
              <span class="block text-lg font-bold text-slate-900 mt-1">R$ {{ brl(grossValue) }}</span>
            </div>
            <div class="rounded-xl bg-white border border-slate-100 border-l-4 border-l-orange-500 p-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">Dedução operacional</span>
              <span class="block text-lg font-bold text-slate-900 mt-1">- R$ {{ calc.dieselCost.toLocaleString('pt-BR') }}</span>
            </div>
            <div class="rounded-xl bg-white border border-slate-100 p-4">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Líquido a repartir</span>
              <span class="block text-lg font-bold text-emerald-600 mt-1">R$ {{ brl(netRatevel) }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <h5 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              Destinação das cotas operacionais
            </h5>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-orange-500 rounded-full" />
                <span class="text-slate-500">Trabalhadores meeiros ({{ calc.meeirosPercentage }}%)</span>
              </div>
              <span class="font-bold text-slate-900">R$ {{ brl(meeirosValue) }}</span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-slate-400 rounded-full" />
                <span class="text-slate-500">Concessionária PLG ({{ calc.plgPercentage }}%)</span>
              </div>
              <span class="font-bold text-slate-900">R$ {{ brl(plgValue) }}</span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-amber-600 rounded-full" />
                <span class="text-slate-500">Royalty do proprietário do solo ({{ calc.landownerPercentage }}%)</span>
              </div>
              <span class="font-bold text-slate-900">R$ {{ brl(landownerValue) }}</span>
            </div>

            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-indigo-500 rounded-full" />
                <span class="text-slate-500">Empresa operadora ({{ calc.reinvestmentPercentage }}%)</span>
              </div>
              <span class="font-bold text-orange-600">R$ {{ brl(reinvestmentValue) }}</span>
            </div>
          </div>

          <div class="mt-8 pt-5 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
            <span class="h-7 w-7 shrink-0 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">✓</span>
            <p class="leading-relaxed">
              Demonstrativo em conformidade com as regras operacionais. Recibos digitais podem ser
              emitidos automaticamente e transmitidos aos trabalhadores via redes de satélite.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
