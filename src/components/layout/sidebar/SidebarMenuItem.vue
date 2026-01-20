<template>
    <div>
      <component
        :is="hasSubmenu ? 'button' : 'router-link'"
        :to="!hasSubmenu ? to : undefined"
        :class="itemClasses"
        @click="hasSubmenu ? toggleSubmenu() : null"
      >
        <!-- Icon -->
        <component
          v-if="icon"
          :is="icon"
          class="menu-icon"
          :class="{ 'text-primary-600 dark:text-primary-400': isActive }"
        />
  
        <!-- Label -->
        <span v-if="!isCollapsed || sub" class="menu-label">
          {{ label }}
        </span>
  
        <!-- Badge -->
        <span
          v-if="badge && !isCollapsed"
          class="menu-badge"
        >
          {{ badge }}
        </span>
  
        <!-- Submenu Arrow -->
        <svg
          v-if="hasSubmenu && !isCollapsed"
          class="menu-arrow"
          :class="{ 'rotate-90': submenuOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </component>
  
      <!-- Submenu -->
      <Transition name="submenu">
        <div v-if="hasSubmenu && submenuOpen && !isCollapsed" class="submenu">
          <slot />
        </div>
      </Transition>
  
      <!-- Tooltip for collapsed state -->
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="isCollapsed && showTooltip && !sub"
            class="sidebar-tooltip"
            :style="tooltipStyle"
          >
            {{ label }}
          </div>
        </Transition>
      </Teleport>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  
  const props = defineProps({
    to: {
      type: String,
      default: ''
    },
    icon: {
      type: Object,
      default: null
    },
    label: {
      type: String,
      required: true
    },
    badge: {
      type: [Number, String],
      default: null
    },
    isCollapsed: {
      type: Boolean,
      default: false
    },
    sub: {
      type: Boolean,
      default: false
    }
  })
  
  const route = useRoute()
  const submenuOpen = ref(false)
  const showTooltip = ref(false)
  const tooltipStyle = ref({})
  
  const hasSubmenu = computed(() => !!props.$slots?.default)
  
  const isActive = computed(() => {
    if (!props.to) return false
    return route.path.startsWith(props.to)
  })
  
  const itemClasses = computed(() => {
    const base = [
      'menu-item',
      {
        'menu-item-active': isActive.value,
        'menu-item-sub': props.sub,
        'justify-center': props.isCollapsed && !props.sub
      }
    ]
    return base
  })
  
  const toggleSubmenu = () => {
    submenuOpen.value = !submenuOpen.value
  }
  
  // Auto-open submenu if child route is active
  watch(() => route.path, (newPath) => {
    if (props.to && newPath.startsWith(props.to) && hasSubmenu.value) {
      submenuOpen.value = true
    }
  }, { immediate: true })
  </script>
  
  <style scoped>
  .menu-item {
    @apply flex items-center gap-3 px-3 py-2.5 rounded-lg;
    @apply text-gray-700 dark:text-gray-300;
    @apply hover:bg-gray-100 dark:hover:bg-gray-700/50;
    @apply transition-all duration-200;
    @apply relative;
    @apply w-full text-left;
  }
  
  .menu-item-active {
    @apply bg-primary-50 dark:bg-primary-900/20;
    @apply text-primary-600 dark:text-primary-400;
    @apply font-medium;
  }
  
  .menu-item-sub {
    @apply text-sm py-2 pl-11;
  }
  
  .menu-icon {
    @apply w-5 h-5 flex-shrink-0;
  }
  
  .menu-label {
    @apply flex-1 truncate;
  }
  
  .menu-badge {
    @apply px-2 py-0.5 text-xs font-medium rounded-full;
    @apply bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400;
  }
  
  .menu-arrow {
    @apply w-4 h-4 transition-transform;
  }
  
  .submenu {
    @apply space-y-1 mt-1;
  }
  
  .sidebar-tooltip {
    @apply fixed z-[100] px-3 py-2 text-sm;
    @apply bg-gray-900 dark:bg-gray-700 text-white rounded-lg;
    @apply shadow-lg pointer-events-none;
    @apply whitespace-nowrap;
  }
  
  /* Transitions */
  .submenu-enter-active,
  .submenu-leave-active {
    transition: all 0.3s ease;
  }
  
  .submenu-enter-from {
    opacity: 0;
    transform: translateY(-10px);
  }
  
  .submenu-leave-to {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  </style>