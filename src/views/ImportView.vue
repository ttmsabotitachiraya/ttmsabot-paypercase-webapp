<template>
    <div class="p-6 max-w-5xl mx-auto">
        <!-- ── Page header ── -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-darkberry">นำเข้าข้อมูล</h1>
            <p class="text-sm text-gray-500 mt-1">
                อัพโหลดไฟล์ CSV จากโปรแกรม PayPerCase แล้วตรวจสอบก่อนบันทึก
            </p>
        </div>

        <!-- ══════════════════════════════════════════════════════
         STEP 1 — Upload zone
    ══════════════════════════════════════════════════════ -->
        <template v-if="step === 'upload'">
            <!-- Drop zone -->
            <div
                class="bg-white rounded-2xl border-2 border-dashed p-14 text-center cursor-pointer transition-all duration-200 select-none"
                :class="
                    isDragging
                        ? 'border-blueberry bg-blue-50 scale-[1.01]'
                        : 'border-gray-200 hover:border-blueberry hover:bg-gray-50'
                "
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="fileInputEl?.click()"
            >
                <div class="flex flex-col items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-16 h-16 mb-4 transition-colors duration-200"
                        :class="isDragging ? 'text-blueberry' : 'text-gray-300'"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="1.5"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>

                    <p
                        class="text-xl font-semibold mb-1 transition-colors duration-200"
                        :class="isDragging ? 'text-blueberry' : 'text-gray-500'"
                    >
                        {{
                            isDragging
                                ? "ปล่อยไฟล์ได้เลย!"
                                : "ลากไฟล์ CSV มาวางที่นี่"
                        }}
                    </p>
                    <p class="text-sm text-gray-400 mb-5">
                        หรือคลิกเพื่อเลือกไฟล์จากเครื่อง
                    </p>

                    <span
                        class="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-100 px-4 py-2 rounded-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                   a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        รองรับเฉพาะไฟล์ .csv
                    </span>
                </div>

                <input
                    ref="fileInputEl"
                    type="file"
                    accept=".csv"
                    class="hidden"
                    @change="handleFileSelect"
                />
            </div>

            <!-- Info cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div
                    v-for="info in infoCards"
                    :key="info.title"
                    class="bg-white rounded-xl p-4 border border-gray-100 flex items-start gap-3"
                >
                    <div
                        class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        v-html="info.icon"
                    />
                    <div>
                        <p class="text-xs font-semibold text-gray-700 mb-0.5">
                            {{ info.title }}
                        </p>
                        <p class="text-xs text-gray-400 leading-relaxed">
                            {{ info.desc }}
                        </p>
                    </div>
                </div>
            </div>
        </template>

        <!-- ══════════════════════════════════════════════════════
         STEP 2 — Preview
    ══════════════════════════════════════════════════════ -->
        <template v-if="step === 'preview'">
            <!-- File info + stats -->
            <div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
                <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-3 min-w-0">
                        <div
                            class="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-5 h-5 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                     a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <div class="min-w-0">
                            <p class="font-semibold text-darkberry truncate">
                                {{ fileName }}
                            </p>
                            <p class="text-xs text-gray-400">
                                ทั้งหมด {{ totalRowsInFile }} แถว
                                (รวมแถวที่กรองออก)
                            </p>
                        </div>
                    </div>
                    <button
                        @click="resetImport"
                        class="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
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
                        เปลี่ยนไฟล์
                    </button>
                </div>

                <!-- Stats row -->
                <div class="grid grid-cols-3 gap-3 mt-4">
                    <div class="bg-green-50 rounded-xl p-3.5 text-center">
                        <p class="text-2xl font-bold text-green-700">
                            {{ importRows.length }}
                        </p>
                        <p class="text-xs text-green-600 font-medium mt-0.5">
                            แถวที่นำเข้าได้
                        </p>
                    </div>
                    <div class="bg-orange-50 rounded-xl p-3.5 text-center">
                        <p class="text-2xl font-bold text-orange-500">
                            {{ filteredCount }}
                        </p>
                        <p class="text-xs text-orange-500 font-medium mt-0.5">
                            กรองออก (ยอด ≤ 0)
                        </p>
                    </div>
                    <div
                        class="rounded-xl p-3.5 text-center"
                        :class="
                            missingColumns.length
                                ? 'bg-yellow-50'
                                : 'bg-blue-50'
                        "
                    >
                        <p
                            class="text-2xl font-bold"
                            :class="
                                missingColumns.length
                                    ? 'text-yellow-600'
                                    : 'text-blueberry'
                            "
                        >
                            {{
                                missingColumns.length
                                    ? missingColumns.length
                                    : "✓"
                            }}
                        </p>
                        <p
                            class="text-xs font-medium mt-0.5"
                            :class="
                                missingColumns.length
                                    ? 'text-yellow-600'
                                    : 'text-blue-500'
                            "
                        >
                            {{
                                missingColumns.length
                                    ? `คอลัมน์ขาด`
                                    : "คอลัมน์ครบ"
                            }}
                        </p>
                    </div>
                </div>

                <!-- Missing columns warning -->
                <div
                    v-if="missingColumns.length"
                    class="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl"
                >
                    <p class="text-xs font-semibold text-yellow-700 mb-1.5">
                        ⚠️ ไม่พบคอลัมน์ต่อไปนี้ในไฟล์ CSV (จะบันทึกเป็นค่าว่าง):
                    </p>
                    <div class="flex flex-wrap gap-1.5">
                        <span
                            v-for="col in missingColumns"
                            :key="col"
                            class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"
                            >{{ col }}</span
                        >
                    </div>
                </div>

                <!-- Required column error -->
                <div
                    v-if="requiredMissing.length"
                    class="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl"
                >
                    <p class="text-xs font-semibold text-red-700 mb-1">
                        🚫 ไม่สามารถนำเข้าได้ — ไม่พบคอลัมน์ที่จำเป็น:
                    </p>
                    <div class="flex flex-wrap gap-1.5">
                        <span
                            v-for="col in requiredMissing"
                            :key="col"
                            class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
                        >
                            {{ col }}
                        </span>
                    </div>
                    <p class="text-xs text-red-500 mt-2">
                        กรุณาตรวจสอบว่าไฟล์ CSV มีคอลัมน์
                        <strong>visit_date</strong> หรือ
                        <strong>วันที่</strong> และ <strong>HN</strong> หรือ
                        <strong>เลขที่ผู้ป่วย</strong>
                    </p>
                </div>
            </div>

            <!-- Preview table -->
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
                <div class="px-5 py-4 border-b border-gray-100">
                    <h3 class="font-semibold text-darkberry text-sm">
                        ตัวอย่างข้อมูล ({{
                            Math.min(10, importRows.length)
                        }}
                        แถวแรก จากทั้งหมด {{ importRows.length }} แถว)
                    </h3>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-gray-50">
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    #
                                </th>
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
                                    สิทธิ์
                                </th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    ผู้ให้บริการ
                                </th>
                                <th
                                    class="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    ค่าบริการรวม
                                </th>
                                <th
                                    class="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    ค่าตอบแทน
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr
                                v-for="(row, idx) in importRows.slice(0, 10)"
                                :key="idx"
                                class="hover:bg-gray-50 transition-colors"
                            >
                                <td class="px-4 py-3 text-xs text-gray-400">
                                    {{ idx + 1 }}
                                </td>
                                <td
                                    class="px-4 py-3 text-darkberry whitespace-nowrap"
                                >
                                    {{ formatDate(row.visit_date) }}
                                </td>
                                <td
                                    class="px-4 py-3 font-mono text-gray-600 whitespace-nowrap"
                                >
                                    {{ row.hn || "-" }}
                                </td>
                                <td
                                    class="px-4 py-3 text-darkberry whitespace-nowrap"
                                >
                                    {{
                                        [row.first_name, row.last_name]
                                            .filter(Boolean)
                                            .join(" ") || "-"
                                    }}
                                </td>
                                <td
                                    class="px-4 py-3 text-gray-600 whitespace-nowrap"
                                >
                                    {{ row.rights || "-" }}
                                </td>
                                <td
                                    class="px-4 py-3 text-gray-600 whitespace-nowrap"
                                >
                                    {{ row.therapist || "-" }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right text-gray-600 whitespace-nowrap"
                                >
                                    {{ formatCurrency(row.total_revenue) }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right font-semibold text-darkberry whitespace-nowrap"
                                >
                                    {{ formatCurrency(row.payout_amount) }}
                                </td>
                            </tr>

                            <tr v-if="importRows.length === 0">
                                <td
                                    colspan="8"
                                    class="px-4 py-8 text-center text-gray-400 text-sm"
                                >
                                    ไม่มีข้อมูลที่นำเข้าได้ (ทุกแถวถูกกรองออก)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Action bar -->
            <div class="flex items-center justify-between gap-4">
                <p class="text-sm text-gray-400">
                    พร้อมบันทึก
                    <span class="text-darkberry font-semibold">{{
                        importRows.length
                    }}</span>
                    แถว
                </p>

                <div class="flex gap-3">
                    <button
                        @click="resetImport"
                        class="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                        ยกเลิก
                    </button>

                    <button
                        @click="doImport"
                        :disabled="
                            isImporting ||
                            importRows.length === 0 ||
                            requiredMissing.length > 0
                        "
                        class="flex items-center gap-2 px-6 py-2.5 bg-blueberry text-white rounded-xl hover:bg-darkberry disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold shadow-sm"
                    >
                        <svg
                            v-if="!isImporting"
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                        </svg>
                        <svg
                            v-else
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
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z
                   m2 5.291A7.962 7.962 0 014 12H0
                   c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        {{
                            isImporting
                                ? `กำลังบันทึก… ${importProgress}%`
                                : `บันทึกข้อมูล ${importRows.length} แถว`
                        }}
                    </button>
                </div>
            </div>
        </template>

        <!-- ══════════════════════════════════════════════════════
         STEP 3 — Success
    ══════════════════════════════════════════════════════ -->
        <template v-if="step === 'success'">
            <div class="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div
                    class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-8 h-8 text-green-600"
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
                </div>
                <h2 class="text-xl font-bold text-darkberry mb-2">
                    นำเข้าข้อมูลสำเร็จ!
                </h2>
                <p class="text-gray-500 mb-7">
                    บันทึกข้อมูลเรียบร้อยแล้วทั้งหมด
                    <span class="font-semibold text-darkberry">{{
                        importedCount
                    }}</span>
                    แถว
                </p>
                <div class="flex justify-center gap-3">
                    <button
                        @click="resetImport"
                        class="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                        นำเข้าไฟล์อื่น
                    </button>
                    <RouterLink
                        :to="{
                            path: '/records',
                            query: {
                                from: new Date().toISOString().split('T')[0],
                                to: new Date().toISOString().split('T')[0],
                            },
                        }"
                        class="px-5 py-2.5 bg-blueberry text-white rounded-xl hover:bg-darkberry transition-all text-sm font-semibold shadow-sm"
                    >
                        ดูประวัติค่าตอบแทน →
                    </RouterLink>
                </div>
            </div>
        </template>

        <!-- ── Error toast ── -->
        <Transition name="toast">
            <div
                v-if="errorToast"
                class="fixed bottom-5 right-5 z-50 flex items-start gap-2.5 bg-red-600 text-white px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium max-w-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 mt-0.5 flex-shrink-0"
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
                {{ errorToast }}
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import Papa from "papaparse";
import { supabase } from "@/lib/supabase";
import {
    formatDate,
    formatCurrency,
    parseCsvDate,
    parseCsvNumber,
} from "@/utils/format";

/* ─────────────────────────────────────────────────────────
   State
───────────────────────────────────────────────────────── */
const step = ref("upload"); // 'upload' | 'preview' | 'success'
const isDragging = ref(false);
const fileInputEl = ref(null);
const fileName = ref("");
const totalRowsInFile = ref(0);
const filteredCount = ref(0);
const importRows = ref([]); // cleaned, ready-to-import rows
const isImporting = ref(false);
const importProgress = ref(0);
const importedCount = ref(0);
const errorToast = ref("");
const columnMapping = ref({}); // dbCol -> csvHeader

/* ─────────────────────────────────────────────────────────
   Column mapping configuration
   Each DB column maps to a list of possible CSV header
   names (checked case-insensitively, with spaces/_ flexible)
───────────────────────────────────────────────────────── */
const COLUMN_ALIASES = {
    visit_date: [
        "visit_date",
        "visitdate",
        "visit date",
        "วันที่",
        "วันที่เข้ารับบริการ",
        "วันที่รักษา",
        "วันรักษา",
        "date",
    ],
    hn: [
        "hn",
        "HN",
        "hospital number",
        "เลขที่ผู้ป่วย",
        "hn number",
        "patient hn",
        "เลข hn",
        "h/n",
    ],
    cid: [
        "cid",
        "CID",
        "เลขบัตรประชาชน",
        "เลขบัตร",
        "บัตรประชาชน",
        "national id",
        "citizen id",
        "pid",
        "เลข cid",
    ],
    first_name: [
        "first_name",
        "firstname",
        "first name",
        "fname",
        "ชื่อ",
        "ชื่อจริง",
        "ชื่อผู้ป่วย",
    ],
    last_name: [
        "last_name",
        "lastname",
        "last name",
        "lname",
        "surname",
        "นามสกุล",
    ],
    gender: ["gender", "เพศ", "sex"],
    age: ["age", "อายุ"],
    rights: [
        "rights",
        "สิทธิ์",
        "สิทธิ",
        "สิทธิการรักษา",
        "สิทธิ์การรักษา",
        "right",
        "coverage",
        "สิทธิ์ผู้ป่วย",
    ],
    symptoms: [
        "symptoms",
        "อาการ",
        "อาการสำคัญ",
        "diagnosis",
        "การวินิจฉัย",
        "dx",
        "chief complaint",
        "cc",
        "icd",
        "การวินิจฉัยโรค",
    ],
    procedure: [
        "procedure",
        "หัตถการ",
        "การทำหัตถการ",
        "treatment",
        "การรักษา",
        "proc",
        "รายการหัตถการ",
    ],
    therapist: [
        "therapist",
        "ผู้ให้บริการ",
        "นักกายภาพบำบัด",
        "pt name",
        "physiotherapist",
        "ผู้รักษา",
        "เจ้าหน้าที่",
        "pt",
        "ชื่อนักกายภาพ",
        "นักกายภาพบำบัดผู้รักษา",
    ],
    total_revenue: [
        "total_revenue",
        "total revenue",
        "ค่าบริการรวม",
        "revenue",
        "รายได้รวม",
        "total",
        "ยอดรวม",
        "ค่ารักษา",
        "รายได้",
    ],
    payout_amount: [
        "payout_amount",
        "payout amount",
        "ยอดเงิน",
        "เงินปันผล",
        "ค่าตอบแทน",
        "payout",
        "เงิน",
        "ยอดจ่าย",
        "ค่าตอบแทนนักกายภาพ",
        "เงินตอบแทน",
        "จำนวนเงิน",
    ],
};

const REQUIRED_COLS = ["visit_date", "hn"];
const OPTIONAL_COLS = [
    "cid",
    "first_name",
    "last_name",
    "gender",
    "age",
    "rights",
    "symptoms",
    "procedure",
    "therapist",
    "total_revenue",
    "payout_amount",
];

/* computed: which DB columns could not be auto-detected */
const missingColumns = computed(() =>
    OPTIONAL_COLS.filter((c) => !columnMapping.value[c]),
);

const requiredMissing = computed(() =>
    REQUIRED_COLS.filter((c) => !columnMapping.value[c]),
);

/* ─────────────────────────────────────────────────────────
   Info cards (shown on upload step)
───────────────────────────────────────────────────────── */
const infoCards = [
    {
        title: "ตรวจสอบอัตโนมัติ",
        desc: "กรองแถวที่ได้รับเงิน 0 บาทออกก่อนนำเข้า",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
           </svg>`,
    },
    {
        title: "Upsert อัจฉริยะ",
        desc: "บันทึกทับข้อมูลเก่าโดยอัตโนมัติ (visit_date + HN)",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9
                  m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
           </svg>`,
    },
    {
        title: "ดูตัวอย่างก่อนบันทึก",
        desc: "แสดง Preview ข้อมูลเพื่อตรวจสอบก่อนยืนยัน",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
             <path stroke-linecap="round" stroke-linejoin="round"
               d="M2.458 12C3.732 7.943 7.523 5 12 5
                  c4.478 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.064 7-9.542 7
                  -4.477 0-8.268-2.943-9.542-7z"/>
           </svg>`,
    },
];

/* ─────────────────────────────────────────────────────────
   File handling
───────────────────────────────────────────────────────── */
function handleDrop(e) {
    isDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
}

function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // reset input so same file can be re-selected
    if (fileInputEl.value) fileInputEl.value.value = "";
}

function processFile(file) {
    if (!file.name.toLowerCase().endsWith(".csv")) {
        showError("กรุณาเลือกไฟล์ .csv เท่านั้น");
        return;
    }
    fileName.value = file.name;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        encoding: "UTF-8",
        complete(result) {
            buildPreview(result.data, result.meta.fields ?? []);
        },
        error(err) {
            showError("ไม่สามารถอ่านไฟล์ได้: " + err.message);
        },
    });
}

/* ─────────────────────────────────────────────────────────
   Column auto-detection
───────────────────────────────────────────────────────── */
function detectColumns(headers) {
    const map = {};
    const normalise = (s) =>
        String(s)
            .toLowerCase()
            .replace(/[\s_\-]/g, "");

    for (const [dbCol, aliases] of Object.entries(COLUMN_ALIASES)) {
        for (const alias of aliases) {
            const found = headers.find(
                (h) => normalise(h) === normalise(alias),
            );
            if (found) {
                map[dbCol] = found;
                break;
            }
        }
    }
    return map;
}

/* ─────────────────────────────────────────────────────────
   Build preview data from parsed CSV
───────────────────────────────────────────────────────── */
function buildPreview(rows, headers) {
    columnMapping.value = detectColumns(headers);

    const mapped = rows.map((row) => transformRow(row, columnMapping.value));
    totalRowsInFile.value = mapped.length;

    // Filter out zero / null payout rows
    const valid = mapped.filter((r) => {
        const p = r.payout_amount;
        return p !== null && p !== undefined && Number(p) > 0;
    });

    filteredCount.value = mapped.length - valid.length;
    importRows.value = valid;
    step.value = "preview";
}

/* ─────────────────────────────────────────────────────────
   Transform a single CSV row -> DB record shape
───────────────────────────────────────────────────────── */
function transformRow(row, mapping) {
    const record = {};

    for (const [dbCol, csvHeader] of Object.entries(mapping)) {
        if (!csvHeader) continue;
        const raw = row[csvHeader];

        if (dbCol === "visit_date") {
            record[dbCol] = parseCsvDate(raw);
        } else if (dbCol === "age") {
            const n = parseInt(String(raw ?? "").trim(), 10);
            record[dbCol] = isNaN(n) ? null : n;
        } else if (dbCol === "total_revenue" || dbCol === "payout_amount") {
            record[dbCol] = parseCsvNumber(raw);
        } else {
            const s = String(raw ?? "").trim();
            record[dbCol] = s === "" ? null : s;
        }
    }

    return record;
}

/* ─────────────────────────────────────────────────────────
   Upsert to Supabase in batches of 100
───────────────────────────────────────────────────────── */
async function doImport() {
    if (isImporting.value || importRows.value.length === 0) return;

    isImporting.value = true;
    importProgress.value = 0;

    const BATCH = 100;
    const rows = importRows.value;
    let done = 0;

    try {
        for (let i = 0; i < rows.length; i += BATCH) {
            const batch = rows.slice(i, i + BATCH);

            const { error } = await supabase
                .from("patient_record")
                .upsert(batch, { onConflict: "visit_date,hn" });

            if (error) throw error;

            done += batch.length;
            importProgress.value = Math.round((done / rows.length) * 100);
        }

        importedCount.value = done;
        step.value = "success";
    } catch (err) {
        showError("เกิดข้อผิดพลาดขณะบันทึกข้อมูล: " + err.message);
    } finally {
        isImporting.value = false;
    }
}

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
function resetImport() {
    step.value = "upload";
    fileName.value = "";
    importRows.value = [];
    filteredCount.value = 0;
    totalRowsInFile.value = 0;
    columnMapping.value = {};
    importProgress.value = 0;
    importedCount.value = 0;
    isDragging.value = false;
}

function showError(msg) {
    errorToast.value = msg;
    setTimeout(() => {
        errorToast.value = "";
    }, 6000);
}
</script>
