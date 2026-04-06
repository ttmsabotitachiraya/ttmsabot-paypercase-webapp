import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(sessionStorage.getItem('isAuthenticated') === 'true')

  /**
   * Verify password against app_settings table in Supabase.
   * Throws an Error with a Thai-language message on failure.
   * @param {string} password
   */
  async function login(password) {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_value')
      .eq('setting_name', 'login_password')
      .single()

    if (error) {
      throw new Error('ไม่สามารถเชื่อมต่อกับระบบได้ กรุณาตรวจสอบการเชื่อมต่อ')
    }

    if (!data) {
      throw new Error('ไม่พบการตั้งค่ารหัสผ่านในระบบ')
    }

    if (data.setting_value !== password) {
      throw new Error('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง')
    }

    isAuthenticated.value = true
    sessionStorage.setItem('isAuthenticated', 'true')
  }

  function logout() {
    isAuthenticated.value = false
    sessionStorage.removeItem('isAuthenticated')
  }

  return { isAuthenticated, login, logout }
})
