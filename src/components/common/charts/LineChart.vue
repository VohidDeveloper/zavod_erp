<template>
    <div class="w-full">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
  import {
    Chart,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  
  // Register Chart.js components
  Chart.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
    smooth: {
      type: Boolean,
      default: true
    }
  })
  
  const chartCanvas = ref(null)
  let chartInstance = null
  
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
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
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('uz-UZ').format(context.parsed.y)
            }
            return label
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return new Intl.NumberFormat('uz-UZ', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value)
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3,
        hoverRadius: 5,
        borderWidth: 2
      }
    }
  }
  
  const createChart = () => {
    if (!chartCanvas.value) return
  
    const ctx = chartCanvas.value.getContext('2d')
    
    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy()
    }
  
    // Process data
    const processedData = {
      ...props.data,
      datasets: props.data.datasets.map(dataset => ({
        ...dataset,
        borderWidth: dataset.borderWidth || 2,
        pointBackgroundColor: dataset.borderColor || 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: dataset.borderColor || 'rgb(59, 130, 246)',
        tension: props.smooth ? (dataset.tension !== undefined ? dataset.tension : 0.4) : 0
      }))
    }
  
    // Merge options
    const mergedOptions = {
      ...defaultOptions,
      ...props.options,
      plugins: {
        ...defaultOptions.plugins,
        ...props.options.plugins
      },
      scales: {
        ...defaultOptions.scales,
        ...props.options.scales
      },
      elements: {
        ...defaultOptions.elements,
        ...props.options.elements
      }
    }
  
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: processedData,
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