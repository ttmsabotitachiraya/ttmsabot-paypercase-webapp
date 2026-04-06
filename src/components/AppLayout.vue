<template>
  <div class="flex h-screen bg-yogurt overflow-hidden">

    <!-- ── Mobile overlay ── -->
    <Transition name="modal">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/40 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- ── Sidebar ── -->
    <aside
      class="fixed inset-y-0 left-0 z-30 flex-shrink-0
             transition-transform duration-300 ease-in-out
             lg:relative lg:translate-x-0 lg:flex lg:flex-col"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <AppSidebar @close="sidebarOpen = false" />
    </aside>

    <!-- ── Main column ── -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">

      <!-- Mobile top-bar -->
      <header
        class="lg:hidden flex items-center gap-3 bg-white border-b border-gray-100
               px-4 py-3 flex-shrink-0 shadow-sm"
      >
        <button
          @click="sidebarOpen = true"
          class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="เปิดเมนู"
        >
          <!-- Hamburger -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <LogoIcon :size="28" />
        <span class="font-bold text-darkberry text-sm">PayPerCase</span>
      </header>

      <!-- Scrollable page content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import LogoIcon   from './LogoIcon.vue'

const sidebarOpen = ref(false)
</script>
