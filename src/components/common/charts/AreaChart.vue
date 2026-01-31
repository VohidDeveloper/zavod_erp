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
    Legend,
    Filler
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
    Legend,
    Filler
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
    gradient: {
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
        hoverRadius: 5
      }
    }
  }
  
  const createGradient = (ctx, color) => {
    if (!props.gradient) return color
  
    const gradient = ctx.createLinearGradient(0, 0, 0, 300)
    
    // Parse color from rgba or rgb
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
    if (rgbaMatch) {
      const [, r, g, b] = rgbaMatch
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.4)`)
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.2)`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
    } else {
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    }
    
    return gradient
  }
  
  const createChart = () => {
    if (!chartCanvas.value) return
  
    const ctx = chartCanvas.value.getContext('2d')
    
    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy()
    }
  
    // Process data to add gradients
    const processedData = {
      ...props.data,
      datasets: props.data.datasets.map(dataset => ({
        ...dataset,
        fill: dataset.fill !== undefined ? dataset.fill : true,
        backgroundColor: dataset.backgroundColor 
          ? createGradient(ctx, dataset.backgroundColor)
          : createGradient(ctx, 'rgba(59, 130, 246, 1)'),
        borderWidth: dataset.borderWidth || 2,
        pointBackgroundColor: dataset.borderColor || 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
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