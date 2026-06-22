<script setup lang="ts">
import { ref } from 'vue'
import type { Batch, MineralType } from '../types'

const INITIAL_BATCHES: Batch[] = [
  {
    id: 'b-1',
    code: 'MINNL-GOLD-481A',
    mineralType: 'gold',
    weight: 245.5,
    purity: 91.2,
    date: '22/06/2026',
    location: 'Lavra Rio Novo - Frente A',
    partnerName: 'Meeiros de Itaituba',
    isOfflinePending: false,
    isSynced: true,
    valueBRL: 84648.5,
  },
  {
    id: 'b-2',
    code: 'MINNL-CASS-120C',
    mineralType: 'cassiterite',
    weight: 4200,
    purity: 74.5,
    date: '21/06/2026',
    location: 'Garimpo Chapadão - Frente Sul',
    partnerName: 'Cooperativa Ariquemes',
    isOfflinePending: false,
    isSynced: true,
    valueBRL: 39112.5,
  },
  {
    id: 'b-3',
    code: 'MINNL-GOLD-482M',
    mineralType: 'gold',
    weight: 112.8,
    purity: 88.5,
    date: '19/06/2026',
    location: 'Lavra Rio Novo - Frente B',
    partnerName: 'Equipe Serrinha',
    isOfflinePending: false,
    isSynced: true,
    valueBRL: 37920.0,
  },
]

const isOnline = ref(true)
const batches = ref<Batch[]>([...INITIAL_BATCHES])

const addWeight = ref('')
const addPurity = ref('')
const addMineral = ref<MineralType>('gold')
const addPartner = ref('Turma do Garimpo B1')
const addLocation = ref('Frente Grota Funda')

const syncLogs = ref<string[]>([])
const isSyncing = ref(false)

const mineralLabel = (t: MineralType) =>
  t === 'gold' ? 'Ouro' : t === 'cassiterite' ? 'Cassiterita' : 'Manganês'

const unitLabel = (t: MineralType) => (t === 'gold' ? 'g' : t === 'cassiterite' ? 'kg' : 't')

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function toggleConnection() {
  isOnline.value = !isOnline.value
  if (!isOnline.value) syncLogs.value = []
}

function handleAddBatch() {
  const weightNum = parseFloat(addWeight.value)
  const purityNum = parseFloat(addPurity.value)
  if (isNaN(weightNum) || isNaN(purityNum) || weightNum <= 0 || purityNum <= 0) return

  let basePrice = 380 // Ouro
  if (addMineral.value === 'cassiterite') basePrice = 12.5
  if (addMineral.value === 'manganese') basePrice = 0.85

  const calculatedValue = weightNum * (purityNum / 100) * basePrice
  const randomID = Math.floor(Math.random() * 1000)
  const dateStr = new Date().toLocaleDateString('pt-BR')

  const newBatch: Batch = {
    id: `b-${randomID}`,
    code: `MINNL-${addMineral.value.toUpperCase().substring(0, 4)}-${randomID}P`,
    mineralType: addMineral.value,
    weight: weightNum,
    purity: purityNum,
    date: dateStr,
    location: addLocation.value || 'Garimpo Principal',
    partnerName: addPartner.value || 'Meeiros de Parceria',
    isOfflinePending: !isOnline.value,
    isSynced: isOnline.value,
    valueBRL: calculatedValue,
  }

  batches.value = [newBatch, ...batches.value]
  addWeight.value = ''
  addPurity.value = ''
}

function handleSyncBatches() {
  if (isSyncing.value) return
  isSyncing.value = true
  syncLogs.value = ['Iniciando protocolo de Handshake com a nuvem...']

  setTimeout(() => {
    syncLogs.value = [...syncLogs.value, 'Autenticando chaves de segurança da lavra...']
  }, 800)

  setTimeout(() => {
    const unsyncedCount = batches.value.filter((b) => b.isOfflinePending).length
    syncLogs.value = [...syncLogs.value, `Sincronizando ${unsyncedCount} registro(s) pendente(s)...`]
  }, 1600)

  setTimeout(() => {
    syncLogs.value = [
      ...syncLogs.value,
      'Recalculando rateios e emitindo recibos digitais SHA-256...',
    ]
  }, 2400)

  setTimeout(() => {
    batches.value = batches.value.map((b) =>
      b.isOfflinePending ? { ...b, isOfflinePending: false, isSynced: true } : b,
    )
    syncLogs.value = [
      ...syncLogs.value,
      '✅ Base de dados do Garimpo integrada com sucesso ao Mineralnet Cloud!',
    ]
    isSyncing.value = false
    isOnline.value = true
  }, 3200)
}
</script>

<template>
  <section id="modo-campo" class="bg-slate-50 border-y border-slate-100">
    <div class="max-w-6xl mx-auto px-6 py-20">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="inline-block rounded-full bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 mb-4">
          Modo Campo · Demonstração ao vivo
        </span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">Tecnologia de lavra em tempo real</h2>
        <p class="mt-4 text-slate-600">
          Adicione lotes na frente de lavra, alterne o sinal de internet e veja como o sistema
          opera totalmente offline antes de sincronizar com a nuvem.
        </p>
      </div>

      <!-- App container -->
      <div class="rounded-3xl bg-white border border-slate-100 shadow-lg overflow-hidden">
        <!-- Console header -->
        <div class="border-b border-slate-100 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center font-bold">
              M
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                Console MINERAL NET — Controle de cargas
                <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">v3.4.1</span>
              </h3>
              <p class="text-xs text-slate-500">Garimpo inteligente &amp; ledger estanque</p>
            </div>
          </div>

          <!-- Online/offline switch -->
          <div class="flex items-center gap-3 rounded-full border border-slate-200 px-4 py-2 select-none bg-white">
            <span class="text-xs font-medium text-slate-500">Sinal na frente:</span>
            <button
              type="button"
              @click="toggleConnection"
              :class="[
                'relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300',
                isOnline ? 'bg-emerald-500' : 'bg-orange-400',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300',
                  isOnline ? 'translate-x-7' : 'translate-x-1',
                ]"
              />
            </button>
            <span
              :class="[
                'text-xs font-bold min-w-[92px]',
                isOnline ? 'text-emerald-600' : 'text-orange-600',
              ]"
            >
              {{ isOnline ? 'Online (sede)' : 'Offline (grota)' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12">
          <!-- Left: input form -->
          <div class="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/60">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
              <span>Entrada de dados</span>
              <span v-if="!isOnline" class="rounded-full bg-orange-100 text-orange-600 px-2 py-0.5 text-[10px] font-bold">
                Modo local
              </span>
            </h4>

            <form @submit.prevent="handleAddBatch" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-2">Classificação do minério</label>
                <div class="grid grid-cols-3 gap-1.5">
                  <button
                    v-for="m in (['gold', 'cassiterite', 'manganese'] as MineralType[])"
                    :key="m"
                    type="button"
                    @click="addMineral = m"
                    :class="[
                      'py-2 px-1 text-[11px] font-semibold rounded-lg border transition',
                      addMineral === m
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300',
                    ]"
                  >
                    {{ mineralLabel(m) }}
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-semibold text-slate-500 mb-1.5">
                    Massa ({{ addMineral === 'gold' ? 'g' : addMineral === 'cassiterite' ? 'kg' : 't' }})
                  </label>
                  <input
                    v-model="addWeight"
                    type="number"
                    required
                    step="0.1"
                    :placeholder="addMineral === 'gold' ? 'Ex: 125.5' : addMineral === 'cassiterite' ? 'Ex: 1200' : 'Ex: 40'"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-500 mb-1.5">Teor / Pureza %</label>
                  <input
                    v-model="addPurity"
                    type="number"
                    required
                    step="0.1"
                    placeholder="Ex: 92.5"
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1.5">Frente de origem</label>
                <input
                  v-model="addLocation"
                  type="text"
                  placeholder="Ex: Frente da Grota Funda"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-500 mb-1.5">Meeiro responsável</label>
                <input
                  v-model="addPartner"
                  type="text"
                  placeholder="Ex: Meeiros de Curió"
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-orange-500 transition"
                />
              </div>

              <button
                type="submit"
                class="w-full rounded-full py-3 bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
              >
                {{ isOnline ? 'Conciliar na nuvem' : 'Salvar no aparelho' }}
              </button>
            </form>

            <div
              v-if="!isOnline"
              class="mt-5 rounded-xl bg-orange-50 border border-orange-100 p-4 text-xs leading-relaxed text-orange-700"
            >
              Sinal de internet inoperante na grota. Módulo local ativado em sandbox criptografado.
              Todas as pesagens ficam na fila para envio seguro quando o sinal voltar.
            </div>
          </div>

          <!-- Right: ledger -->
          <div class="lg:col-span-8 p-6 flex flex-col">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Ledger de controle de cargas</h4>
                <p class="text-[11px] text-slate-400 mt-0.5">Integridade eletrônica para lavra legalizada</p>
              </div>

              <button
                v-if="batches.some((b) => b.isOfflinePending)"
                @click="handleSyncBatches"
                :disabled="isSyncing"
                :class="[
                  'text-xs font-semibold rounded-full px-4 py-2 transition-colors',
                  isSyncing
                    ? 'bg-slate-100 text-slate-400'
                    : 'bg-orange-500 text-white hover:bg-orange-600',
                ]"
              >
                {{ isSyncing ? 'Sincronizando...' : `Transmitir ${batches.filter((b) => b.isOfflinePending).length} lote(s)` }}
              </button>
            </div>

            <div class="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              <div
                v-for="batch in batches"
                :key="batch.id"
                :class="[
                  'rounded-xl border p-4 transition',
                  batch.isOfflinePending
                    ? 'border-orange-200 bg-orange-50/50'
                    : 'border-slate-100 bg-white hover:border-slate-200',
                ]"
              >
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      :class="[
                        'text-[10px] px-2 py-0.5 rounded-full font-semibold',
                        batch.mineralType === 'gold'
                          ? 'bg-amber-100 text-amber-700'
                          : batch.mineralType === 'cassiterite'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-600',
                      ]"
                    >
                      {{ mineralLabel(batch.mineralType) }}
                    </span>
                    <span class="text-xs font-bold text-slate-700">{{ batch.code }}</span>
                    <span
                      v-if="batch.isOfflinePending"
                      class="flex items-center gap-1.5 text-[10px] text-orange-600 font-semibold"
                    >
                      <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                      Aguardando sinal
                    </span>
                    <span v-else class="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold">
                      <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Verificado SHA-256
                    </span>
                  </div>

                  <div class="rounded-lg bg-slate-50 border border-slate-100 px-3 py-1">
                    <span class="text-[9px] text-slate-400 block">Est. bruto</span>
                    <span class="block text-sm font-bold text-orange-600">R$ {{ brl(batch.valueBRL) }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span class="block text-[10px] text-slate-400">Massa bruta</span>
                    <span class="font-semibold text-slate-700">
                      {{ batch.weight.toLocaleString('pt-BR') }} {{ unitLabel(batch.mineralType) }}
                    </span>
                  </div>
                  <div>
                    <span class="block text-[10px] text-slate-400">Teor real</span>
                    <span class="font-semibold text-slate-700">{{ batch.purity }}%</span>
                  </div>
                  <div>
                    <span class="block text-[10px] text-slate-400">Cota meeiro</span>
                    <span class="font-semibold text-slate-700 truncate block max-w-[120px]">{{ batch.partnerName }}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] text-slate-400">Ponto lavra</span>
                    <span class="font-semibold text-slate-700 truncate block max-w-[125px]">{{ batch.location }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="syncLogs.length > 0"
              class="mt-4 rounded-xl bg-slate-900 text-slate-300 p-3.5 font-mono text-[11px] space-y-1"
            >
              <span class="block uppercase text-[10px] font-bold tracking-widest text-orange-400 mb-1">
                Log de handshake criptográfico:
              </span>
              <p
                v-for="(log, idx) in syncLogs"
                :key="idx"
                :class="log.startsWith('✅') ? 'text-emerald-400' : ''"
              >
                {{ log }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
