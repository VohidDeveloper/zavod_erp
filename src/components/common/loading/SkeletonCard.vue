<template>
    <div class="card">
      <div v-if="!noHeader" class="card-header">
        <Skeleton width="40%" height="24px" />
      </div>
      <div class="card-body space-y-4">
        <Skeleton v-for="i in lines" :key="i" :width="getLineWidth(i)" />
      </div>
    </div>
  </template>
  
  <script setup>
  import Skeleton from './Skeleton.vue'
  
  defineProps({
    lines: {
      type: Number,
      default: 3
    },
    noHeader: {
      type: Boolean,
      default: false
    }
  })
  
  const getLineWidth = (index) => {
    const widths = ['100%', '95%', '85%', '100%', '90%']
    return widths[index % widths.length]
  }
  </script>