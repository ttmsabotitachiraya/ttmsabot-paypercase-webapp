<template>
    <aside class="flex flex-col h-full w-64 bg-white shadow-lg select-none">
        <!-- ── Brand ── -->
        <div
            class="flex items-center gap-3 px-5 py-5 border-b border-gray-100 flex-shrink-0"
        >
            <LogoIcon :size="40" class="flex-shrink-0" />
            <div class="min-w-0">
                <p class="font-bold text-darkberry leading-tight truncate">
                    PayPerCase
                </p>
                <p class="text-xs text-gray-400 truncate">
                    ระบบจัดการค่าตอบแทน
                </p>
            </div>
        </div>

        <!-- ── Navigation ── -->
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <RouterLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
                :class="
                    isActive(item.to)
                        ? 'bg-blueberry text-white shadow-sm'
                        : 'text-darkberry hover:bg-yogurt hover:text-blueberry'
                "
                @click="$emit('close')"
            >
                <!-- icon wrapper keeps colour consistent via currentColor -->
                <span class="flex-shrink-0 w-5 h-5" v-html="item.icon" />
                <span>{{ item.label }}</span>
            </RouterLink>
        </nav>

        <!-- ── Logout ── -->
        <div class="px-3 pb-5 flex-shrink-0 border-t border-gray-100 pt-3">
            <button
                class="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
                @click="handleLogout"
            >
                <!-- logout icon -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
                <span>ออกจากระบบ</span>
            </button>
        </div>
    </aside>
</template>

<script setup>
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LogoIcon from "./LogoIcon.vue";

defineEmits(["close"]);

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

/** Highlight the nav item whose path matches the current route */
function isActive(path) {
    return route.path === path || route.path.startsWith(path + "/");
}

async function handleLogout() {
    authStore.logout();
    await router.push({ name: "login" });
}

/* ─────────────────────────────────────────────────────────────────────────
   Nav items  — icons use currentColor so they inherit the link colour
   (white when active, darkberry/blueberry on hover)
───────────────────────────────────────────────────────────────────────── */
const navItems = [
    {
        to: "/import",
        label: "นำเข้าข้อมูล",
        icon: `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>`,
    },
    {
        to: "/records",
        label: "ประวัติค่าตอบแทน",
        icon: `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                 M9 5a2 2 0 002 2h2a2 2 0 002-2
                 M9 5a2 2 0 012-2h2a2 2 0 012 2
                 m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
      </svg>`,
    },
    {
        to: "/export",
        label: "ส่งออกรายงาน",
        icon: `
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0
                 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0
                 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>`,
    },
];
</script>
