<template>
    <nav v-if="breadcrumbs.length > 0" class="flex items-center space-x-2 text-sm">
      <HomeIcon
        class="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
        @click="navigateTo('/')"
      />
      
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <ChevronRightIcon class="w-4 h-4 text-gray-400" />
        
        <span
          v-if="index === breadcrumbs.length - 1"
          class="text-gray-900 font-medium"
        >
          {{ crumb.title }}
        </span>
        
        <a
          v-else
          @click="navigateTo(crumb.to)"
          class="text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          {{ crumb.title }}
        </a>
      </template>
    </nav>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { HomeIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
  
  const route = useRoute()
  const router = useRouter()
  
  const breadcrumbs = computed(() => {
    const crumbs = []
    
    // Build breadcrumbs from route meta
    route.matched.forEach(match => {
      if (match.meta.breadcrumb) {
        crumbs.push({
          title: match.meta.breadcrumb,
          to: match.path
        })
      }
    })
    
    return crumbs
  })
  
  const navigateTo = (path) => {
    router.push(path)
  }
  </script>