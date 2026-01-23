<template>
    <div class="relative hidden md:block">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Qidirish... (Ctrl+K)"
        class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @focus="showResults = true"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <MagnifyingGlassIcon class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      
      <!-- Search Results Dropdown -->
      <transition name="dropdown">
        <div
          v-if="showResults && searchQuery"
          class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto z-50"
        >
          <div v-if="loading" class="px-4 py-3 text-center">
            <Spinner size="sm" />
          </div>
          
          <div v-else-if="filteredResults.length === 0" class="px-4 py-3 text-sm text-gray-500">
            Natija topilmadi
          </div>
          
          <template v-else>
            <div
              v-for="(result, index) in filteredResults"
              :key="result.id"
              @click="selectResult(result)"
              :class="[
                'px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors',
                selectedIndex === index ? 'bg-gray-50' : ''
              ]"
            >
              <div class="flex items-center gap-3">
                <component :is="result.icon" class="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ result.title }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    {{ result.description }}
                  </p>
                </div>
                <kbd class="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                  {{ result.shortcut }}
                </kbd>
              </div>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
  import {
    HomeIcon,
    CubeIcon,
    ShoppingCartIcon,
    CurrencyDollarIcon,
    UsersIcon,
    WrenchScrewdriverIcon,
    ChartBarIcon,
    Cog6ToothIcon
  } from '@heroicons/vue/24/outline'
  import { Spinner } from '@/components/common'
  import { debounce } from '@/utils/helpers'
  
  const router = useRouter()
  
  const searchQuery = ref('')
  const showResults = ref(false)
  const loading = ref(false)
  const selectedIndex = ref(0)
  
  // Search items
  const searchItems = [
    { id: 1, title: 'Dashboard', description: 'Bosh sahifa', url: '/dashboard', icon: HomeIcon, shortcut: 'D' },
    { id: 2, title: 'Ombor', description: 'Mahsulotlar va qoldiqlar', url: '/warehouse', icon: CubeIcon, shortcut: 'O' },
    { id: 3, title: 'Ishlab chiqarish', description: 'Ishlab chiqarish jarayoni', url: '/production', icon: WrenchScrewdriverIcon, shortcut: 'I' },
    { id: 4, title: 'Savdo', description: 'Buyurtmalar va sotuvlar', url: '/sales', icon: ShoppingCartIcon, shortcut: 'S' },
    { id: 5, title: 'Moliya', description: 'To\'lovlar va hisobotlar', url: '/finance', icon: CurrencyDollarIcon, shortcut: 'M' },
    { id: 6, title: 'Xodimlar', description: 'Xodimlar boshqaruvi', url: '/hr', icon: UsersIcon, shortcut: 'X' },
    { id: 7, title: 'Analitika', description: 'Hisobotlar va grafiklar', url: '/analytics', icon: ChartBarIcon, shortcut: 'A' },
    { id: 8, title: 'Sozlamalar', description: 'Tizim sozlamalari', url: '/settings', icon: Cog6ToothIcon, shortcut: ',' }
  ]
  
  const filteredResults = computed(() => {
    if (!searchQuery.value) return []
    
    const query = searchQuery.value.toLowerCase()
    return searchItems.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    ).slice(0, 8)
  })
  
  const handleBlur = () => {
    setTimeout(() => {
      showResults.value = false
    }, 200)
  }
  
  const handleKeydown = (event) => {
    if (!showResults.value) return
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex.value = Math.min(selectedIndex.value + 1, filteredResults.value.length - 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
        break
      case 'Enter':
        event.preventDefault()
        if (filteredResults.value[selectedIndex.value]) {
          selectResult(filteredResults.value[selectedIndex.value])
        }
        break
      case 'Escape':
        showResults.value = false
        break
    }
  }
  
  const selectResult = (result) => {
    router.push(result.url)
    searchQuery.value = ''
    showResults.value = false
  }
  
  // Global keyboard shortcut (Ctrl+K)
  const handleGlobalKeydown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      document.querySelector('input[placeholder*="Qidirish"]')?.focus()
    }
  }
  
  onMounted(() => {
    document.addEventListener('keydown', handleGlobalKeydown)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown)
  })
  </script>
  
  <style scoped>
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
  }
  
  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>