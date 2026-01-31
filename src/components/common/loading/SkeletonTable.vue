<template>
    <div class="w-full">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Table Header -->
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="col in columns"
              :key="col"
              class="px-6 py-3 text-left"
            >
              <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            </th>
          </tr>
        </thead>
  
        <!-- Table Body -->
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="row in rows"
            :key="row"
            class="hover:bg-gray-50"
          >
            <td
              v-for="col in columns"
              :key="col"
              class="px-6 py-4"
            >
              <div
                :class="[
                  'h-4 bg-gray-200 rounded animate-pulse',
                  col === 0 ? 'w-3/4' : 'w-full'
                ]"
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  defineProps({
    rows: {
      type: Number,
      default: 5
    },
    columns: {
      type: Number,
      default: 4
    }
  })
  </script>