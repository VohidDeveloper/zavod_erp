<template>
    <div class="w-full">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
  import {
    Chart,
    DoughnutController,
    ArcElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  
  // Register Chart.js components
  Chart.register(
    DoughnutController,
    ArcElement,
    Title,
    Tooltip,
    Legend
  )
  
  const props = defineProps({
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: Number,
      default: 300
    },
    cutout: {
      type: String,
      default: '70%'
    },
    showTotal: {
      type: Boolean,
      default: true
    },
    totalLabel: {
      type: String,
      default: 'Jami'
    }
  })
  
  const chartCanvas = ref(null)
  let chartInstance = null
  
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          },
          generateLabels: function(chart) {
            const data = chart.data
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0]
                const value = dataset.data[i]
                const total = dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  hidden: false,
                  index: i
                }
              })
            }
            return []
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.parsed
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            
            return `${label}: ${value.toLocaleString('uz-UZ')} (${percentage}%)`
          }
        }
      }
    },
    cutout: '70%'
  }
  
  // Plugin to display text in center
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      if (!props.showTotal) return
  
      const { ctx, chartArea: { width, height } } = chart
      const centerX = width / 2
      const centerY = height / 2
  
      ctx.save()
      
      // Calculate total
      const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
      
      // Draw total value
      ctx.font = 'bold 24px sans-serif'
      ctx.fillStyle = '#111827'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(total.toLocaleString('uz-UZ'), centerX, centerY - 10)
      
      // Draw label
      ctx.font = '12px sans-serif'
      ctx.fillStyle = '#6B7280'
      ctx.fillText(props.totalLabel, centerX, centerY + 15)
      
      ctx.restore()
    }
  }
  
  const createChart = () => {
    if (!chartCanvas.value) return
  
    const ctx = chartCanvas.value.getContext('2d')
    
    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy()
    }
  
    // Merge options
    const mergedOptions = {
      ...defaultOptions,
      ...props.options,
      cutout: props.cutout,
      plugins: {
        ...defaultOptions.plugins,
        ...props.options.plugins
      }
    }
  
    // Register center text plugin
    Chart.register(centerTextPlugin)
  
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: props.data,
      options: mergedOptions
    })
  }
  
  onMounted(() => {
    createChart()
  })
  
  watch(
    () => props.data,
    () => {
      createChart()
    },
    { deep: true }
  )
  
  watch(
    () => props.options,
    () => {
      createChart()
    },
    { deep: true }
  )
  
  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.destroy()
    }
  })
  </script>