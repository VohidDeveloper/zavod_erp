<template>
    <div class="w-full">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
  import {
    Chart,
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  
  // Register Chart.js components
  Chart.register(
    BarController,
    CategoryScale,
    LinearScale,
    BarElement,
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
    horizontal: {
      type: Boolean,
      default: false
    },
    stacked: {
      type: Boolean,
      default: false
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
              label += new Intl.NumberFormat('uz-UZ').format(
                props.horizontal ? context.parsed.x : context.parsed.y
              )
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
      indexAxis: props.horizontal ? 'y' : 'x',
      ...props.options,
      plugins: {
        ...defaultOptions.plugins,
        ...props.options.plugins
      },
      scales: {
        x: {
          ...defaultOptions.scales.x,
          ...props.options.scales?.x,
          stacked: props.stacked
        },
        y: {
          ...defaultOptions.scales.y,
          ...props.options.scales?.y,
          stacked: props.stacked
        }
      }
    }
  
    // Swap scales if horizontal
    if (props.horizontal) {
      mergedOptions.scales = {
        x: {
          ...mergedOptions.scales.y,
          stacked: props.stacked
        },
        y: {
          ...mergedOptions.scales.x,
          stacked: props.stacked
        }
      }
    }
  
    chartInstance = new Chart(ctx, {
      type: 'bar',
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
  
  watch(
    () => [props.horizontal, props.stacked],
    () => {
      createChart()
    }
  )
  
  onBeforeUnmount(() => {
    if (chartInstance) {
      chartInstance.destroy()
    }
  })
  </script>