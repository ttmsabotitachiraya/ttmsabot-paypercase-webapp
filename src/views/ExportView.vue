<template>
    <div class="p-6 max-w-6xl mx-auto">
        <!-- ── Header ── -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-darkberry">ส่งออกรายงาน</h1>
            <p class="text-sm text-gray-500 mt-1">
                กรองช่วงวันที่ แล้วส่งออกเป็น Excel
                เพื่อคำนวณเงินหรือสำรองข้อมูล
            </p>
        </div>

        <!-- ── Filter card ── -->
        <div class="bg-white rounded-2xl shadow-sm p-5 mb-5">
            <h2
                class="text-sm font-semibold text-darkberry mb-4 flex items-center gap-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z
                   M3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z
                   M14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    />
                </svg>
                เลือกช่วงวันที่
            </h2>

            <div class="flex flex-wrap items-end gap-4">
                <div class="flex-1 min-w-[160px]">
                    <label class="block text-xs font-medium text-gray-500 mb-1"
                        >วันที่เริ่มต้น</label
                    >
                    <input
                        v-model="dateFrom"
                        type="date"
                        class="w-full px-3 py-2.5 bg-yogurt border border-gray-200 rounded-xl text-sm text-darkberry focus:outline-none focus:ring-2 focus:ring-blueberry focus:border-transparent transition"
                    />
                </div>
                <div class="flex-1 min-w-[160px]">
                    <label class="block text-xs font-medium text-gray-500 mb-1"
                        >วันที่สิ้นสุด</label
                    >
                    <input
                        v-model="dateTo"
                        type="date"
                        class="w-full px-3 py-2.5 bg-yogurt border border-gray-200 rounded-xl text-sm text-darkberry focus:outline-none focus:ring-2 focus:ring-blueberry focus:border-transparent transition"
                    />
                </div>

                <!-- Quick range buttons -->
                <div class="flex gap-2 flex-wrap">
                    <button
                        v-for="preset in presets"
                        :key="preset.label"
                        @click="applyPreset(preset)"
                        class="px-3 py-2.5 text-xs font-medium border border-gray-200 rounded-xl text-gray-600 hover:border-blueberry hover:text-blueberry hover:bg-blue-50 transition"
                    >
                        {{ preset.label }}
                    </button>
                </div>

                <!-- Load button -->
                <button
                    @click="loadData"
                    :disabled="isLoading || !dateFrom || !dateTo"
                    class="flex items-center gap-2 px-5 py-2.5 bg-blueberry text-white text-sm font-semibold rounded-xl hover:bg-darkberry disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                    <svg
                        v-if="isLoading"
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1
                     m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    {{ isLoading ? "กำลังโหลด…" : "โหลดข้อมูล" }}
                </button>
            </div>

            <!-- Error -->
            <div
                v-if="loadError"
                class="mt-4 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 flex-shrink-0"
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
                {{ loadError }}
            </div>
        </div>

        <!-- ── Results (shown after loading) ── -->
        <template v-if="records.length > 0">
            <!-- Stat chips -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div class="bg-white rounded-2xl shadow-sm p-4 text-center">
                    <p class="text-2xl font-bold text-darkberry">
                        {{ records.length }}
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">เคสทั้งหมด</p>
                </div>
                <div class="bg-white rounded-2xl shadow-sm p-4 text-center">
                    <p class="text-2xl font-bold text-darkberry">
                        {{ uniqueTherapists }}
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">ผู้ให้บริการ</p>
                </div>
                <div class="bg-white rounded-2xl shadow-sm p-4 text-center">
                    <p class="text-lg font-bold text-darkberry">
                        {{ formatCurrency(totalPayout) }}
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">ค่าตอบแทนรวม (฿)</p>
                </div>
                <div class="bg-white rounded-2xl shadow-sm p-4 text-center">
                    <p class="text-lg font-bold text-darkberry">
                        {{ formatCurrency(totalRevenue) }}
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">รายได้รวม (฿)</p>
                </div>
            </div>

            <!-- ── Export buttons ── -->
            <div class="flex flex-wrap gap-3 mb-5">
                <button
                    @click="exportRawData"
                    class="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-darkberry text-sm font-semibold rounded-xl hover:border-blueberry hover:text-blueberry hover:bg-blue-50 transition shadow-sm"
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
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                     a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    ส่งออก CSV — ข้อมูลดิบ ({{ records.length }} แถว)
                </button>

                <button
                    @click="exportSummary"
                    class="flex items-center gap-2 px-5 py-2.5 bg-blueberry text-white text-sm font-semibold rounded-xl hover:bg-darkberry transition shadow-sm"
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
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                     a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    ส่งออก CSV — สรุปรายเดือน
                </button>
            </div>

            <!-- ── Monthly Summary Table ── -->
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div
                    class="px-5 py-4 border-b border-gray-100 flex items-center justify-between"
                >
                    <h3 class="font-semibold text-darkberry text-sm">
                        สรุปรายเดือน แยกตามผู้ให้บริการ
                    </h3>
                    <span class="text-xs text-gray-400"
                        >{{ summary.length }} รายการ</span
                    >
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="bg-gray-50">
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    เดือน
                                </th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    ผู้ให้บริการ
                                </th>
                                <th
                                    class="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    จำนวนเคส
                                </th>
                                <th
                                    class="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    ค่าบริการรวม (฿)
                                </th>
                                <th
                                    class="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                                >
                                    ค่าตอบแทน (฿)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Month group header rows -->
                            <template
                                v-for="(group, gIdx) in summaryByMonth"
                                :key="group.month"
                            >
                                <!-- Month label row -->
                                <tr class="bg-yogurt">
                                    <td
                                        colspan="5"
                                        class="px-4 py-2 text-xs font-bold text-blueberry uppercase tracking-wider"
                                    >
                                        {{ formatMonthYear(group.month) }}
                                        &nbsp;·&nbsp;
                                        {{ group.rows.length }} ผู้ให้บริการ
                                        &nbsp;·&nbsp; {{ group.totalCases }} เคส
                                    </td>
                                </tr>
                                <!-- Per-therapist rows -->
                                <tr
                                    v-for="(row, rIdx) in group.rows"
                                    :key="row.therapist"
                                    class="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                                >
                                    <td class="px-4 py-3 text-gray-400 text-xs">
                                        —
                                    </td>
                                    <td
                                        class="px-4 py-3 font-medium text-darkberry whitespace-nowrap"
                                    >
                                        {{ row.therapist }}
                                    </td>
                                    <td class="px-4 py-3 text-center">
                                        <span
                                            class="inline-block px-2 py-0.5 bg-blue-50 text-blueberry text-xs font-bold rounded-full"
                                        >
                                            {{ row.total_cases }}
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 text-right text-gray-600 whitespace-nowrap tabular-nums"
                                    >
                                        {{ formatCurrency(row.total_revenue) }}
                                    </td>
                                    <td
                                        class="px-4 py-3 text-right font-semibold text-darkberry whitespace-nowrap tabular-nums"
                                    >
                                        {{ formatCurrency(row.total_payout) }}
                                    </td>
                                </tr>
                                <!-- Sub-total row -->
                                <tr
                                    class="border-t border-gray-200 bg-blue-50/40"
                                >
                                    <td class="px-4 py-2.5"></td>
                                    <td
                                        class="px-4 py-2.5 text-xs font-bold text-blueberry"
                                    >
                                        รวม {{ formatMonthYear(group.month) }}
                                    </td>
                                    <td
                                        class="px-4 py-2.5 text-center text-xs font-bold text-blueberry"
                                    >
                                        {{ group.totalCases }}
                                    </td>
                                    <td
                                        class="px-4 py-2.5 text-right text-xs font-bold text-blueberry tabular-nums whitespace-nowrap"
                                    >
                                        {{ formatCurrency(group.totalRevenue) }}
                                    </td>
                                    <td
                                        class="px-4 py-2.5 text-right text-xs font-bold text-blueberry tabular-nums whitespace-nowrap"
                                    >
                                        {{ formatCurrency(group.totalPayout) }}
                                    </td>
                                </tr>
                            </template>
                        </tbody>

                        <!-- Grand total -->
                        <tfoot>
                            <tr
                                class="border-t-2 border-blueberry/20 bg-blueberry/5"
                            >
                                <td class="px-4 py-3"></td>
                                <td
                                    class="px-4 py-3 text-sm font-bold text-darkberry"
                                >
                                    รวมทั้งหมด
                                </td>
                                <td
                                    class="px-4 py-3 text-center text-sm font-bold text-darkberry"
                                >
                                    {{ records.length }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right text-sm font-bold text-darkberry tabular-nums whitespace-nowrap"
                                >
                                    {{ formatCurrency(totalRevenue) }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right text-sm font-bold text-darkberry tabular-nums whitespace-nowrap"
                                >
                                    {{ formatCurrency(totalPayout) }}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </template>

        <!-- ── Empty state (after load attempt with 0 results) ── -->
        <div
            v-else-if="hasLoaded && records.length === 0"
            class="bg-white rounded-2xl shadow-sm p-16 text-center"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-14 h-14 mx-auto mb-4 text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                 a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            <p class="text-gray-400 font-medium">
                ไม่พบข้อมูลในช่วงวันที่ที่เลือก
            </p>
            <p class="text-xs text-gray-300 mt-1">
                ลองเปลี่ยนช่วงวันที่แล้วโหลดใหม่
            </p>
        </div>

        <!-- ── Toast ── -->
        <Transition name="toast">
            <div
                v-if="toast.show"
                class="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium max-w-sm"
                :class="
                    toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                "
            >
                <svg
                    v-if="toast.type === 'success'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
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
                    class="w-4 h-4 flex-shrink-0"
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
                {{ toast.message }}
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import { formatDate, formatCurrency, formatMonthYear } from "@/utils/format";

// ── State ────────────────────────────────────────────────────────────────────
const records = ref([]);
const isLoading = ref(false);
const hasLoaded = ref(false);
const loadError = ref("");
const toast = ref({ show: false, type: "success", message: "" });

// Default range: first day of current month → today
const today = new Date();
const dateFrom = ref(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`,
);
const dateTo = ref(today.toISOString().split("T")[0]);

// ── Date presets ─────────────────────────────────────────────────────────────
const presets = [
    { label: "เดือนนี้", fn: () => thisMonth() },
    { label: "เดือนที่แล้ว", fn: () => lastMonth() },
    { label: "3 เดือน", fn: () => lastNMonths(3) },
    { label: "ปีนี้", fn: () => thisYear() },
];

function thisMonth() {
    const d = new Date();
    return {
        from: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`,
        to: d.toISOString().split("T")[0],
    };
}
function lastMonth() {
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
function lastNMonths(n) {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - n + 1);
    start.setDate(1);
    return {
        from: start.toISOString().split("T")[0],
        to: end.toISOString().split("T")[0],
    };
}
function thisYear() {
    const y = new Date().getFullYear();
    return { from: `${y}-01-01`, to: new Date().toISOString().split("T")[0] };
}
function applyPreset(preset) {
    const range = preset.fn();
    dateFrom.value = range.from;
    dateTo.value = range.to;
}

// ── Data loading ──────────────────────────────────────────────────────────────
async function loadData() {
    if (!dateFrom.value || !dateTo.value) return;
    isLoading.value = true;
    loadError.value = "";
    records.value = [];

    try {
        // Fetch ALL rows in range (no pagination — for export we need everything)
        let allRows = [];
        const PAGE = 1000;
        let from = 0;

        while (true) {
            const { data, error } = await supabase
                .from("patient_record")
                .select("*")
                .gte("visit_date", dateFrom.value)
                .lte("visit_date", dateTo.value)
                .order("visit_date", { ascending: true })
                .order("therapist", { ascending: true })
                .range(from, from + PAGE - 1);

            if (error) throw error;
            allRows = allRows.concat(data || []);
            if (!data || data.length < PAGE) break;
            from += PAGE;
        }

        records.value = allRows;
        hasLoaded.value = true;
    } catch (err) {
        loadError.value = "โหลดข้อมูลไม่สำเร็จ: " + err.message;
    } finally {
        isLoading.value = false;
    }
}

// ── Computed stats ────────────────────────────────────────────────────────────
const totalPayout = computed(() =>
    records.value.reduce((s, r) => s + (Number(r.payout_amount) || 0), 0),
);
const totalRevenue = computed(() =>
    records.value.reduce((s, r) => s + (Number(r.total_revenue) || 0), 0),
);
const uniqueTherapists = computed(
    () => new Set(records.value.map((r) => r.therapist || "ไม่ระบุ")).size,
);

// ── Summary pivot: group by month → therapist ─────────────────────────────────
const summary = computed(() => {
    const map = new Map();
    for (const r of records.value) {
        const d = new Date(r.visit_date + "T00:00:00");
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const therapist = (r.therapist || "ไม่ระบุ").trim();
        const key = `${monthKey}::${therapist}`;

        if (!map.has(key)) {
            map.set(key, {
                month: monthKey,
                therapist,
                total_cases: 0,
                total_payout: 0,
                total_revenue: 0,
            });
        }
        const entry = map.get(key);
        entry.total_cases++;
        entry.total_payout += Number(r.payout_amount) || 0;
        entry.total_revenue += Number(r.total_revenue) || 0;
    }
    return [...map.values()].sort(
        (a, b) =>
            a.month.localeCompare(b.month) ||
            a.therapist.localeCompare(b.therapist),
    );
});

// Group summary rows by month (for display)
const summaryByMonth = computed(() => {
    const groups = new Map();
    for (const row of summary.value) {
        if (!groups.has(row.month)) {
            groups.set(row.month, {
                month: row.month,
                rows: [],
                totalCases: 0,
                totalPayout: 0,
                totalRevenue: 0,
            });
        }
        const g = groups.get(row.month);
        g.rows.push(row);
        g.totalCases += row.total_cases;
        g.totalPayout += row.total_payout;
        g.totalRevenue += row.total_revenue;
    }
    return [...groups.values()];
});

// ── Excel exports ─────────────────────────────────────────────────────────────
function exportRawData() {
    if (!records.value.length) return;

    // Helper: format date as DD/MM/YYYY (Gregorian) for CSV
    const formatCsvDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr + "T00:00:00");
        if (isNaN(d.getTime())) return dateStr;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear(); // Gregorian year as requested (e.g., 2026)
        return `${day}/${month}/${year}`;
    };

    // Helper: escape CSV values
    const csvEscape = (v) => {
        if (v === null || v === undefined) return "";
        const s = String(v);
        // If contains quote, comma, newline -> wrap in quotes and escape quotes
        if (/[",\n\r]/.test(s)) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };

    try {
        const rows = records.value.map((r) => ({
            วันที่: formatCsvDate(r.visit_date),
            HN: r.hn ?? "",
            CID: r.cid ?? "",
            ชื่อ: r.first_name ?? "",
            นามสกุล: r.last_name ?? "",
            เพศ: r.gender ?? "",
            อายุ: r.age ?? "",
            สิทธิ์: r.rights ?? "",
            "อาการ/การวินิจฉัย": r.symptoms ?? "",
            หัตถการ: r.procedure ?? "",
            ผู้ให้บริการ: r.therapist ?? "",
            "ค่าบริการรวม (฿)": r.total_revenue ?? "",
            "ค่าตอบแทน (฿)": r.payout_amount ?? "",
        }));

        if (!rows.length) return;

        // Build CSV header (preserve order)
        const headers = Object.keys(rows[0]);
        const lines = [];
        // Add BOM to support Excel/Thai characters
        // But BOM is added when creating Blob below
        lines.push(headers.map(csvEscape).join(","));

        for (const row of rows) {
            const line = headers.map((h) => csvEscape(row[h])).join(",");
            lines.push(line);
        }

        const csvContent = "\uFEFF" + lines.join("\r\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const filename = `patient_raw_${dateFrom.value}_${dateTo.value}.csv`;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);

        showToast("success", `ส่งออกไฟล์ "${filename}" สำเร็จ`);
    } catch (err) {
        showToast(
            "error",
            "ส่งออกไม่สำเร็จ: " + (err && err.message ? err.message : err),
        );
    }
}

function exportSummary() {
    if (!summary.value.length) return;

    const csvEscape = (v) => {
        if (v === null || v === undefined) return "";
        const s = String(v);
        if (/[",\n\r]/.test(s)) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };

    try {
        const rows = summary.value.map((s) => ({
            เดือน: formatMonthYear(s.month),
            ผู้ให้บริการ: s.therapist,
            จำนวนเคส: s.total_cases,
            "ค่าบริการรวม (฿)": s.total_revenue,
            "ค่าตอบแทน (฿)": s.total_payout,
        }));

        if (!rows.length) return;

        const headers = Object.keys(rows[0]);
        const lines = [];
        lines.push(headers.map(csvEscape).join(","));

        for (const row of rows) {
            const line = headers.map((h) => csvEscape(row[h])).join(",");
            lines.push(line);
        }

        const csvContent = "\uFEFF" + lines.join("\r\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const filename = `summary_${dateFrom.value}_${dateTo.value}.csv`;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);

        showToast("success", `ส่งออกไฟล์ "${filename}" สำเร็จ`);
    } catch (err) {
        showToast(
            "error",
            "ส่งออกไม่สำเร็จ: " + (err && err.message ? err.message : err),
        );
    }
}

// ── Toast helper ──────────────────────────────────────────────────────────────
function showToast(type, message) {
    toast.value = { show: true, type, message };
    setTimeout(() => {
        toast.value.show = false;
    }, 4000);
}
</script>
