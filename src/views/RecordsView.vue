<template>
    <div class="p-6 max-w-full">
        <!-- ── Header ── -->
        <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
        >
            <div>
                <h1 class="text-2xl font-bold text-darkberry">
                    ประวัติค่าตอบแทน
                </h1>
                <p class="text-sm text-gray-500 mt-0.5">
                    ค้นหา ดู และจัดการข้อมูลการรักษาทั้งหมดในระบบ
                </p>
            </div>
            <div
                class="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm flex-shrink-0"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-blueberry"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0
                   002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0
                   002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
                ทั้งหมด
                <span class="font-bold text-darkberry">{{
                    totalCount.toLocaleString()
                }}</span>
                รายการ
            </div>
        </div>

        <!-- ── Filters ── -->
        <div class="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <div class="flex flex-col sm:flex-row gap-3">
                <!-- Date from -->
                <div class="flex items-center gap-2 flex-shrink-0">
                    <label
                        class="text-xs font-medium text-gray-500 whitespace-nowrap"
                        >ตั้งแต่</label
                    >
                    <input
                        v-model="dateFrom"
                        type="date"
                        class="px-3 py-2.5 text-sm bg-yogurt border border-gray-200 rounded-xl text-darkberry focus:outline-none focus:ring-2 focus:ring-blueberry focus:border-transparent transition"
                        @change="onFilterChange"
                    />
                </div>

                <!-- Date to -->
                <div class="flex items-center gap-2 flex-shrink-0">
                    <label
                        class="text-xs font-medium text-gray-500 whitespace-nowrap"
                        >ถึง</label
                    >
                    <input
                        v-model="dateTo"
                        type="date"
                        class="px-3 py-2.5 text-sm bg-yogurt border border-gray-200 rounded-xl text-darkberry focus:outline-none focus:ring-2 focus:ring-blueberry focus:border-transparent transition"
                        @change="onFilterChange"
                    />
                </div>

                <!-- Quick range buttons -->
                <div class="flex gap-2 flex-wrap">
                    <button
                        @click="applyPreset('วันนี้')"
                        class="px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-xl text-gray-600 hover:border-blueberry hover:text-blueberry hover:bg-blue-50 transition"
                    >
                        วันนี้
                    </button>
                    <button
                        @click="applyPreset('เดือนนี้')"
                        class="px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-xl text-gray-600 hover:border-blueberry hover:text-blueberry hover:bg-blue-50 transition"
                    >
                        เดือนนี้
                    </button>
                    <button
                        @click="applyPreset('เดือนที่แล้ว')"
                        class="px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-xl text-gray-600 hover:border-blueberry hover:text-blueberry hover:bg-blue-50 transition"
                    >
                        เดือนที่แล้ว
                    </button>
                </div>

                <!-- Provider dropdown -->
                <div class="flex items-center gap-2 flex-shrink-0">
                    <label
                        class="text-xs font-medium text-gray-500 whitespace-nowrap"
                        >ผู้ให้บริการ</label
                    >
                    <select
                        v-model="providerFilter"
                        @change="onFilterChange"
                        :disabled="isProvidersLoading"
                        class="px-3 py-2.5 text-sm bg-yogurt border border-gray-200 rounded-xl text-darkberry focus:outline-none focus:ring-2 focus:ring-blueberry focus:border-transparent transition"
                    >
                        <option value="">ทั้งหมด</option>
                        <option v-for="p in providers" :key="p" :value="p">
                            {{ p }}
                        </option>
                    </select>
                </div>

                <!-- Clear filters -->
                <button
                    v-if="dateFrom || dateTo || providerFilter"
                    @click="clearFilters"
                    class="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-red-500 transition flex-shrink-0"
                    title="ล้างตัวกรอง"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    ล้าง
                </button>
            </div>
        </div>

        <!-- ── Table Card ── -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <!-- Loading overlay -->
            <div
                v-if="isLoading"
                class="flex items-center justify-center py-24"
            >
                <svg
                    class="w-8 h-8 text-blueberry animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291
                   A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            </div>

            <!-- Empty state -->
            <div
                v-else-if="records.length === 0"
                class="flex flex-col items-center justify-center py-24 text-center px-6"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-14 h-14 text-gray-200 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.5"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0
                   002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0
                   002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
                <p class="text-gray-400 font-medium">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไข
                </p>
                <p class="text-sm text-gray-300 mt-1">
                    ลองปรับคำค้นหาหรือช่วงวันที่ใหม่
                </p>
            </div>

            <!-- Table -->
            <div v-else class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                วันที่
                            </th>
                            <th
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                HN
                            </th>
                            <th
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                ชื่อ-นามสกุล
                            </th>
                            <th
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                เพศ/อายุ
                            </th>
                            <th
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                สิทธิ์
                            </th>
                            <th
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                อาการ/หัตถการ
                            </th>
                            <th
                                class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                ผู้ให้บริการ
                            </th>
                            <th
                                class="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                ค่ารักษา
                            </th>
                            <th
                                class="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                ค่าตอบแทน
                            </th>
                            <th
                                class="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                            >
                                จัดการ
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr
                            v-for="row in records"
                            :key="row.id"
                            class="hover:bg-yogurt transition-colors group"
                        >
                            <!-- Date -->
                            <td
                                class="px-4 py-3 whitespace-nowrap text-darkberry font-medium"
                            >
                                {{ formatDate(row.visit_date) }}
                            </td>
                            <!-- HN -->
                            <td
                                class="px-4 py-3 whitespace-nowrap font-mono text-gray-600 text-xs"
                            >
                                {{ row.hn || "-" }}
                            </td>
                            <!-- Full name -->
                            <td
                                class="px-4 py-3 whitespace-nowrap text-darkberry"
                            >
                                {{
                                    [row.first_name, row.last_name]
                                        .filter(Boolean)
                                        .join(" ") || "-"
                                }}
                                <div
                                    v-if="row.cid"
                                    class="text-xs text-gray-400 font-mono"
                                >
                                    {{ row.cid }}
                                </div>
                            </td>
                            <!-- Gender / Age -->
                            <td
                                class="px-4 py-3 whitespace-nowrap text-gray-600 text-xs"
                            >
                                <span v-if="row.gender || row.age">
                                    {{ row.gender || ""
                                    }}{{ row.gender && row.age ? " / " : ""
                                    }}{{ row.age ? row.age + " ปี" : "" }}
                                </span>
                                <span v-else>-</span>
                            </td>
                            <!-- Rights -->
                            <td class="px-4 py-3 whitespace-nowrap">
                                <span
                                    v-if="row.rights"
                                    class="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                                >
                                    {{ row.rights }}
                                </span>
                                <span v-else class="text-gray-300">-</span>
                            </td>
                            <!-- Symptoms / Procedure -->
                            <td class="px-4 py-3 text-gray-600 max-w-[200px]">
                                <p v-if="row.symptoms" class="truncate text-xs">
                                    {{ row.symptoms }}
                                </p>
                                <p
                                    v-if="row.procedure"
                                    class="truncate text-xs text-gray-400"
                                >
                                    {{ row.procedure }}
                                </p>
                                <span
                                    v-if="!row.symptoms && !row.procedure"
                                    class="text-gray-300"
                                    >-</span
                                >
                            </td>
                            <!-- Therapist -->
                            <td
                                class="px-4 py-3 whitespace-nowrap text-gray-700 text-xs"
                            >
                                {{ row.therapist || "-" }}
                            </td>
                            <!-- Total revenue -->
                            <td
                                class="px-4 py-3 whitespace-nowrap text-right text-gray-600 tabular-nums"
                            >
                                {{ formatCurrency(row.total_revenue) }}
                            </td>
                            <!-- Payout -->
                            <td
                                class="px-4 py-3 whitespace-nowrap text-right font-semibold text-darkberry tabular-nums"
                            >
                                {{ formatCurrency(row.payout_amount) }}
                            </td>
                            <!-- Delete -->
                            <td class="px-4 py-3 text-center">
                                <button
                                    @click="confirmDelete(row)"
                                    class="opacity-0 group-hover:opacity-100 inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
                                    title="ลบรายการนี้"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858
                             L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- ── Pagination ── -->
            <div
                v-if="!isLoading && totalCount > 0"
                class="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100"
            >
                <!-- Page info -->
                <p class="text-xs text-gray-400 flex-shrink-0">
                    แสดง
                    <span class="font-semibold text-darkberry">{{
                        pageStart
                    }}</span>
                    –
                    <span class="font-semibold text-darkberry">{{
                        pageEnd
                    }}</span>
                    จาก
                    <span class="font-semibold text-darkberry">{{
                        totalCount.toLocaleString()
                    }}</span>
                    รายการ
                </p>

                <!-- Buttons -->
                <div class="flex items-center gap-1">
                    <!-- First -->
                    <button
                        :disabled="currentPage === 1"
                        @click="goToPage(1)"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="หน้าแรก"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <!-- Prev -->
                    <button
                        :disabled="currentPage === 1"
                        @click="goToPage(currentPage - 1)"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="หน้าก่อนหน้า"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <!-- Page numbers -->
                    <template v-for="p in pageButtons" :key="p">
                        <span
                            v-if="p === '…'"
                            class="px-2 text-gray-300 text-xs select-none"
                            >…</span
                        >
                        <button
                            v-else
                            @click="goToPage(p)"
                            class="w-8 h-8 rounded-lg text-xs font-medium transition"
                            :class="
                                p === currentPage
                                    ? 'bg-blueberry text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                            "
                        >
                            {{ p }}
                        </button>
                    </template>

                    <!-- Next -->
                    <button
                        :disabled="currentPage === totalPages"
                        @click="goToPage(currentPage + 1)"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="หน้าถัดไป"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                    <!-- Last -->
                    <button
                        :disabled="currentPage === totalPages"
                        @click="goToPage(totalPages)"
                        class="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        title="หน้าสุดท้าย"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- ── Delete confirmation modal ── -->
        <Transition name="modal">
            <div
                v-if="deleteTarget"
                class="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
                <!-- Backdrop -->
                <div
                    class="absolute inset-0 bg-black/40"
                    @click="cancelDelete"
                />
                <!-- Dialog -->
                <div
                    class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10"
                >
                    <!-- Icon -->
                    <div
                        class="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-6 h-6 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667
                       1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464
                       0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h3
                        class="text-center font-bold text-darkberry text-lg mb-1"
                    >
                        ยืนยันการลบ
                    </h3>
                    <p class="text-center text-sm text-gray-500 mb-1">
                        คุณต้องการลบรายการนี้ใช่หรือไม่?
                    </p>
                    <p
                        class="text-center text-sm font-semibold text-darkberry mb-6"
                    >
                        {{ deleteTarget.label }}
                    </p>
                    <p class="text-center text-xs text-red-400 mb-6">
                        ⚠️ การดำเนินการนี้ไม่สามารถย้อนกลับได้
                    </p>
                    <div class="flex gap-3">
                        <button
                            @click="cancelDelete"
                            :disabled="isDeleting"
                            class="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                            ยกเลิก
                        </button>
                        <button
                            @click="executeDelete"
                            :disabled="isDeleting"
                            class="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            <svg
                                v-if="isDeleting"
                                class="w-4 h-4 animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                />
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
                         a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4
                         a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            {{ isDeleting ? "กำลังลบ…" : "ลบรายการ" }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- ── Toast notification ── -->
        <Transition name="toast">
            <div
                v-if="toast.show"
                class="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium max-w-xs"
                :class="
                    toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                "
            >
                <svg
                    v-if="toast.type === 'success'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2.5"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <svg
                    v-else
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                {{ toast.message }}
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/lib/supabase";
import { formatDate, formatCurrency } from "@/utils/format";

// ── Constants ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 20;

// ── State ───────────────────────────────────────────────────────────────────
const records = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const isLoading = ref(false);

// Read optional query params for initial date range (fallback to today)
const route = useRoute();
const today = new Date();
const todayStr = today.toISOString().split("T")[0];
const dateFrom = ref(route.query.from ? String(route.query.from) : todayStr);
const dateTo = ref(route.query.to ? String(route.query.to) : todayStr);

// Provider filter + provider list for dropdown
const providerFilter = ref("");
const providers = ref([]);
const isProvidersLoading = ref(false);

/**
 * Date preset helpers
 */
function todayRange() {
    const d = new Date();
    const s = d.toISOString().split("T")[0];
    return { from: s, to: s };
}
function thisMonthRange() {
    const d = new Date();
    return {
        from: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`,
        to: d.toISOString().split("T")[0],
    };
}
function lastMonthRange() {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const lastDay = new Date(y, m, 0).getDate();
    return {
        from: `${y}-${String(m).padStart(2, "0")}-01`,
        to: `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
    };
}
function applyPreset(label) {
    let range = null;
    if (label === "วันนี้") range = todayRange();
    else if (label === "เดือนนี้") range = thisMonthRange();
    else if (label === "เดือนที่แล้ว") range = lastMonthRange();
    if (range) {
        dateFrom.value = range.from;
        dateTo.value = range.to;
        currentPage.value = 1;
        fetchRecords();
    }
}

/**
 * Load provider list for dropdown (distinct therapists)
 */
async function loadProviders() {
    isProvidersLoading.value = true;
    try {
        const { data, error } = await supabase
            .from("patient_record")
            .select("therapist")
            .not("therapist", "is", null)
            .limit(1000);
        if (error) throw error;
        const set = new Set();
        (data || []).forEach((r) => {
            if (r.therapist && r.therapist.toString().trim()) {
                set.add(r.therapist.toString().trim());
            }
        });
        providers.value = [...set].sort((a, b) => a.localeCompare(b));
    } catch (err) {
        // silently ignore; providers is optional
    } finally {
        isProvidersLoading.value = false;
    }
}

const deleteTarget = ref(null); // { id, label }
const isDeleting = ref(false);

const toast = ref({ show: false, type: "success", message: "" });

// ── Computed ─────────────────────────────────────────────────────────────────
const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)),
);

const pageStart = computed(() =>
    totalCount.value === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1,
);
const pageEnd = computed(() =>
    Math.min(currentPage.value * PAGE_SIZE, totalCount.value),
);

/** Generates page-number buttons with ellipsis shortening */
const pageButtons = computed(() => {
    const total = totalPages.value;
    const cur = currentPage.value;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set([1, total, cur]);
    if (cur > 1) pages.add(cur - 1);
    if (cur < total) pages.add(cur + 1);

    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
        result.push(sorted[i]);
    }
    return result;
});

// ── Data fetching ────────────────────────────────────────────────────────────
async function fetchRecords() {
    isLoading.value = true;
    try {
        let query = supabase
            .from("patient_record")
            .select("*", { count: "exact" })
            .order("visit_date", { ascending: false })
            .order("created_at", { ascending: false });

        if (dateFrom.value) query = query.gte("visit_date", dateFrom.value);
        if (dateTo.value) query = query.lte("visit_date", dateTo.value);
        // Apply provider filter when set
        if (providerFilter.value)
            query = query.eq("therapist", providerFilter.value);

        query = query.range(
            (currentPage.value - 1) * PAGE_SIZE,
            currentPage.value * PAGE_SIZE - 1,
        );

        const { data, count, error } = await query;
        if (error) throw error;

        records.value = data ?? [];
        totalCount.value = count ?? 0;
    } catch (err) {
        showToast("error", "โหลดข้อมูลไม่สำเร็จ: " + err.message);
    } finally {
        isLoading.value = false;
    }
}

// ── Filter handlers ──────────────────────────────────────────────────────────

function onFilterChange() {
    currentPage.value = 1;
    fetchRecords();
}

function clearFilters() {
    dateFrom.value = "";
    dateTo.value = "";
    currentPage.value = 1;
    fetchRecords();
}

function goToPage(p) {
    if (p < 1 || p > totalPages.value || p === currentPage.value) return;
    currentPage.value = p;
    fetchRecords();
}

// ── Delete logic ──────────────────────────────────────────────────────────────
function confirmDelete(row) {
    const name = [row.first_name, row.last_name].filter(Boolean).join(" ");
    const date = formatDate(row.visit_date);
    deleteTarget.value = {
        id: row.id,
        label: `${date}  •  HN: ${row.hn || "-"}  •  ${name || "ไม่ระบุชื่อ"}`,
    };
}

function cancelDelete() {
    if (isDeleting.value) return;
    deleteTarget.value = null;
}

async function executeDelete() {
    if (!deleteTarget.value || isDeleting.value) return;
    isDeleting.value = true;
    try {
        const { error } = await supabase
            .from("patient_record")
            .delete()
            .eq("id", deleteTarget.value.id);

        if (error) throw error;

        deleteTarget.value = null;
        showToast("success", "ลบรายการเรียบร้อยแล้ว");

        // If we just deleted the last item on this page, go back one page
        if (records.value.length === 1 && currentPage.value > 1) {
            currentPage.value -= 1;
        }
        await fetchRecords();
    } catch (err) {
        showToast("error", "ลบไม่สำเร็จ: " + err.message);
    } finally {
        isDeleting.value = false;
    }
}

// ── Toast helper ──────────────────────────────────────────────────────────────
function showToast(type, message) {
    toast.value = { show: true, type, message };
    setTimeout(() => {
        toast.value.show = false;
    }, 4000);
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
    await loadProviders();
    fetchRecords();
});
</script>
