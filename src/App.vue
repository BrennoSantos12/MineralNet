<script setup lang="ts">
import logo from './assets/logo.jpeg'

const year = new Date().getFullYear()

const services = [
  {
    title: "Planejamento de Lavra",
    desc: "Planeje a extração, sequencie blocos e acompanhe o avanço da mina com dados sempre atualizados.",
  },
  {
    title: "Controle de Produção",
    desc: "Registre toneladas movimentadas, teor e metas de produção por turno, frente e equipamento.",
  },
  {
    title: "Gestão de Frota",
    desc: "Monitore caminhões, escavadeiras e ciclos de transporte para reduzir paradas e otimizar custos.",
  },
  {
    title: "Geologia & Sondagem",
    desc: "Gerencie furos de sondagem, amostras, ensaios e teores em um banco de dados geológico unificado.",
  },
  {
    title: "Topografia & Volumes",
    desc: "Calcule volumes de pilhas, cubagem e avanço topográfico com precisão para o seu fechamento.",
  },
  {
    title: "Relatórios & Compliance",
    desc: "Gere relatórios para a ANM e indicadores de produção e segurança em poucos cliques.",
  },
]

const nav = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
]
</script>

<template>
  <div class="min-h-screen bg-white text-slate-800">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-black border-b border-white/10">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#inicio" class="flex items-center">
          <img :src="logo" alt="MINERAL NET" class="h-9 w-auto" />
        </a>
        <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a v-for="item in nav" :key="item.href" :href="item.href" class="hover:text-orange-500 transition-colors">
            {{ item.label }}
          </a>
        </nav>
        <a href="#contato"
          class="hidden md:inline-flex items-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
          Fale conosco
        </a>
      </div>
    </header>

    <!-- Hero -->
    <section id="inicio" class="relative overflow-hidden">
      <div class="max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span class="inline-block rounded-full bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 mb-6">
            Software para o setor mineral · Cuiabá / MT
          </span>
          <h1 class="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900">
            O software que gerencia toda a sua <span class="text-orange-500">mina</span>
          </h1>
          <p class="mt-6 text-lg text-slate-600 max-w-md">
            A MINERAL NET desenvolve um sistema completo para mineração: do planejamento de lavra ao
            controle de produção, frota, geologia e relatórios para a ANM — tudo em um só lugar.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <a href="#contato"
              class="inline-flex items-center rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition-colors">
              Agendar demonstração
            </a>
            <a href="#servicos"
              class="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:border-orange-500 hover:text-orange-500 transition-colors">
              Conhecer os módulos
            </a>
          </div>
        </div>
        <div class="relative">
          <div class="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-400 p-1.5 shadow-xl">
            <div class="rounded-[1.35rem] bg-black px-10 py-20 flex items-center justify-center">
              <img :src="logo" alt="MINERAL NET" class="w-full max-w-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Serviços -->
    <section id="servicos" class="bg-slate-50 border-y border-slate-100">
      <div class="max-w-6xl mx-auto px-6 py-20">
        <div class="text-center max-w-2xl mx-auto mb-14">
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">Módulos do sistema</h2>
          <p class="mt-4 text-slate-600">
            Tudo o que a sua mineradora precisa para operar, em uma única plataforma.
          </p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="service in services" :key="service.title"
            class="group rounded-2xl bg-white border border-slate-100 p-7 hover:border-orange-200 hover:shadow-lg transition-all">
            <div class="h-12 w-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-5 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900">{{ service.title }}</h3>
            <p class="mt-2 text-slate-600 text-sm leading-relaxed">{{ service.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sobre -->
    <section id="sobre" class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900">Sobre a MINERAL NET</h2>
        <p class="mt-6 text-slate-600 leading-relaxed">
          Sediada em Cuiabá / MT, a MINERAL NET é uma empresa de software especializada no setor
          mineral. Desde 2023 desenvolvemos um sistema sob medida para mineradoras, unindo
          planejamento, produção, geologia e gestão em uma plataforma feita para o dia a dia da mina.
        </p>
        <div class="mt-8 grid grid-cols-3 gap-6">
          <div>
            <div class="text-3xl font-extrabold text-orange-500">+3</div>
            <div class="text-sm text-slate-500">anos no setor</div>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-orange-500">6</div>
            <div class="text-sm text-slate-500">módulos integrados</div>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-orange-500">100%</div>
            <div class="text-sm text-slate-500">focado em mineração</div>
          </div>
        </div>
      </div>
      <ul class="space-y-4">
        <li v-for="item in ['Feito sob medida para mineradoras', 'Dados de produção em tempo real', 'Relatórios prontos para a ANM', 'Suporte técnico especializado']"
          :key="item" class="flex items-start gap-3">
          <span class="mt-1 h-5 w-5 shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">✓</span>
          <span class="text-slate-700">{{ item }}</span>
        </li>
      </ul>
    </section>

    <!-- Contato -->
    <section id="contato" class="bg-black text-white">
      <div class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
        <div>
          <h2 class="text-3xl md:text-4xl font-extrabold">Entre em contato</h2>
          <p class="mt-4 text-slate-300 max-w-md">
            Quer ver o sistema funcionando na sua mineradora? Fale com a gente e agende uma
            demonstração — respondemos rápido.
          </p>
          <a href="https://wa.me/5565992482899" target="_blank" rel="noopener noreferrer"
            class="mt-8 inline-flex items-center rounded-full bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition-colors">
            Chamar no WhatsApp
          </a>
        </div>
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <span class="text-orange-400 font-semibold w-24 shrink-0">E-mail</span>
            <a href="mailto:edinilson@mineralnet.com.br" class="text-slate-200 hover:text-orange-400 transition-colors">
              edinilson@mineralnet.com.br
            </a>
          </div>
          <div class="flex items-start gap-4">
            <span class="text-orange-400 font-semibold w-24 shrink-0">Telefone</span>
            <a href="tel:+5565992482899" class="text-slate-200 hover:text-orange-400 transition-colors">
              (65) 99248-2899
            </a>
          </div>
          <div class="flex items-start gap-4">
            <span class="text-orange-400 font-semibold w-24 shrink-0">Endereço</span>
            <span class="text-slate-200">
              Av. Miguel Sutil, 690 — Sala 303, Edif. Verona Tower<br />
              Jardim Paulista, Cuiabá / MT — CEP 78065-367
            </span>
          </div>
          <div class="flex items-start gap-4">
            <span class="text-orange-400 font-semibold w-24 shrink-0">CNPJ</span>
            <span class="text-slate-200">50.893.840/0001-07</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black border-t border-white/10">
      <div class="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
        <img :src="logo" alt="MINERAL NET" class="h-8 w-auto" />
        <span>© {{ year }} MINERAL NET LTDA. Todos os direitos reservados.</span>
      </div>
    </footer>
  </div>
</template>
