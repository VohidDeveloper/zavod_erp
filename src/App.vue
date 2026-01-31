<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  // Check if user is already authenticated
  const token = localStorage.getItem('access_token')
  if (token) {
    try {
      await authStore.fetchCurrentUser()
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      // Clear invalid token
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }
})
</script>

<style>
/* Global styles are in main.css */
</style>