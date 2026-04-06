<template>
    <div class="min-h-screen bg-yogurt flex items-center justify-center px-4">
        <div class="w-full max-w-md">
            <!-- Card -->
            <div class="bg-white rounded-2xl shadow-xl px-8 py-10">
                <!-- Logo + Brand -->
                <div class="flex flex-col items-center mb-8 select-none">
                    <LogoIcon :size="56" class="mb-4 drop-shadow-md" />
                    <h1 class="text-2xl font-bold text-darkberry tracking-wide">
                        PayPerCase
                    </h1>
                    <p class="text-sm text-gray-400 mt-1">
                        ระบบจัดการค่าตอบแทนพนังงานนวดแผนไทย
                    </p>
                </div>

                <!-- Form -->
                <form @submit.prevent="handleLogin" novalidate>
                    <div class="mb-5">
                        <label
                            class="block text-sm font-semibold text-darkberry mb-2"
                        >
                            รหัสผ่าน
                        </label>
                        <div class="relative">
                            <input
                                v-model="password"
                                :type="showPassword ? 'text' : 'password'"
                                placeholder="กรอกรหัสผ่าน"
                                autocomplete="current-password"
                                :disabled="isLoading"
                                class="w-full px-4 py-3 pr-11 bg-yogurt border border-gray-200 rounded-xl text-darkberry placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blueberry focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed transition"
                                @keydown.enter.prevent="handleLogin"
                            />
                            <!-- Show / Hide password -->
                            <button
                                type="button"
                                tabindex="-1"
                                @click="showPassword = !showPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                :aria-label="
                                    showPassword
                                        ? 'ซ่อนรหัสผ่าน'
                                        : 'แสดงรหัสผ่าน'
                                "
                            >
                                <!-- Eye open -->
                                <svg
                                    v-if="!showPassword"
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5
                       c4.478 0 8.268 2.943 9.542 7
                       -1.274 4.057-5.064 7-9.542 7
                       -4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                                <!-- Eye slash -->
                                <svg
                                    v-else
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M13.875 18.825A10.05 10.05 0 0112 19
                       c-4.478 0-8.268-2.943-9.543-7
                       a9.97 9.97 0 011.563-3.029
                       m5.858.908a3 3 0 114.243 4.243
                       M9.878 9.878l4.242 4.242
                       M9.88 9.88l-3.29-3.29
                       m7.532 7.532l3.29 3.29
                       M3 3l3.59 3.59
                       m0 0A9.953 9.953 0 0112 5
                       c4.478 0 8.268 2.943 9.543 7
                       a10.025 10.025 0 01-4.132 5.411
                       m0 0L21 21"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Error message -->
                    <Transition name="fade">
                        <div
                            v-if="errorMessage"
                            class="flex items-start gap-2 mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"
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
                            <span>{{ errorMessage }}</span>
                        </div>
                    </Transition>

                    <!-- Submit button -->
                    <button
                        type="submit"
                        :disabled="isLoading || !password.trim()"
                        class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blueberry text-white font-semibold text-sm rounded-xl hover:bg-darkberry active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    >
                        <!-- Spinner -->
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
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z
                        m2 5.291A7.962 7.962 0 014 12H0
                        c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <!-- Lock icon -->
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
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6
                   a2 2 0 00-2-2H6a2 2 0 00-2 2v6
                   a2 2 0 002 2zm10-10V7
                   a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        {{ isLoading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ" }}
                    </button>
                </form>
            </div>

            <!-- Footer note -->
            <p class="text-center text-xs text-gray-400 mt-6 select-none">
                PayPerCase v2.0.0 &nbsp;·&nbsp; ระบบสำหรับเจ้าหน้าที่เท่านั้น
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LogoIcon from "@/components/LogoIcon.vue";

const router = useRouter();
const authStore = useAuthStore();

const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

async function handleLogin() {
    const pw = password.value.trim();
    if (!pw || isLoading.value) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
        await authStore.login(pw);
        router.push({ name: "import" });
    } catch (err) {
        errorMessage.value = err.message;
        password.value = ""; // clear so user can retype easily
    } finally {
        isLoading.value = false;
    }
}
</script>
