<template>
    <router-link to="/dashboard" class="navbar-logo">
      <div class="logo-icon">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" class="text-primary-600" />
          <path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
      <div class="logo-text hidden lg:block">
        <span class="logo-title">S PROMAX PLAST</span>
        <span class="logo-subtitle">Premium ERP</span>
      </div>
    </router-link>
  </template>
  
  <style scoped>
  .navbar-logo {
    @apply flex items-center gap-3;
    @apply hover:opacity-80 transition-opacity;
  }
  
  .logo-icon {
    @apply flex items-center justify-center;
  }
  
  .logo-text {
    @apply flex flex-col;
  }
  
  .logo-title {
    @apply text-lg font-bold text-gray-900 dark:text-white;
    @apply leading-tight;
  }
  
  .logo-subtitle {
    @apply text-xs text-gray-500 dark:text-gray-400;
    @apply leading-tight;
  }
  </style>