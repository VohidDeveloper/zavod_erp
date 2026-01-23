import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Filler
  } from 'chart.js'
  import { CHART_COLORS } from '@/utils/constants'
  
  // Register Chart.js components
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Filler
  )
  
  // Default configuration
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          color: '#6B7280',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 13,
          family: 'Inter, sans-serif'
        },
        bodyFont: {
          size: 12,
          family: 'Inter, sans-serif'
        },
        padding: 12,
        cornerRadius: 8,
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
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: '#E5E7EB',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6B7280',
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
  
  // Chart presets
  export const chartPresets = {
    line: (options = {}) => ({
      ...defaultOptions,
      ...options,
      plugins: {
        ...defaultOptions.plugins,
        ...options.plugins
      },
      scales: {
        ...defaultOptions.scales,
        ...options.scales
      }
    }),
    
    bar: (options = {}) => ({
      ...defaultOptions,
      ...options,
      plugins: {
        ...defaultOptions.plugins,
        ...options.plugins
      },
      scales: {
        ...defaultOptions.scales,
        ...options.scales
      }
    }),
    
    pie: (options = {}) => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 15,
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            },
            color: '#6B7280',
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          ...defaultOptions.plugins.tooltip,
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percent = ((value / total) * 100).toFixed(1)
              return `${label}: ${new Intl.NumberFormat('uz-UZ').format(value)} (${percent}%)`
            }
          }
        },
        ...options.plugins
      }
    }),
    
    doughnut: (options = {}) => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 15,
            font: {
              size: 12,
              family: 'Inter, sans-serif'
            },
            color: '#6B7280',
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          ...defaultOptions.plugins.tooltip,
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percent = ((value / total) * 100).toFixed(1)
              return `${label}: ${new Intl.NumberFormat('uz-UZ').format(value)} (${percent}%)`
            }
          }
        },
        ...options.plugins
      }
    })
  }
  
  // Color generator
  export const getChartColors = (count = 1, alpha = 1) => {
    const colors = [
      CHART_COLORS.PRIMARY,
      CHART_COLORS.SUCCESS,
      CHART_COLORS.WARNING,
      CHART_COLORS.DANGER,
      CHART_COLORS.INFO,
      CHART_COLORS.PURPLE,
      CHART_COLORS.PINK
    ]
    
    if (count === 1) {
      return alpha < 1 ? colors[0] + Math.round(alpha * 255).toString(16) : colors[0]
    }
    
    return colors.slice(0, count).map(color => 
      alpha < 1 ? color + Math.round(alpha * 255).toString(16) : color
    )
  }
  
  // Helper to format chart data
  export const formatChartData = {
    // Create dataset
    dataset: (label, data, color = CHART_COLORS.PRIMARY) => ({
      label,
      data,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 2,
      tension: 0.4
    }),
    
    // Create line dataset
    lineDataset: (label, data, color = CHART_COLORS.PRIMARY) => ({
      label,
      data,
      borderColor: color,
      backgroundColor: color + '20',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5
    }),
    
    // Create bar dataset
    barDataset: (label, data, color = CHART_COLORS.PRIMARY) => ({
      label,
      data,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1,
      borderRadius: 4
    }),
    
    // Create pie/doughnut dataset
    pieDataset: (data, colors) => ({
      data,
      backgroundColor: colors || getChartColors(data.length),
      borderWidth: 0
    })
  }
  
  export default {
    install(app) {
      // Make ChartJS available globally
      app.config.globalProperties.$chartjs = ChartJS
      app.config.globalProperties.$chartPresets = chartPresets
      app.config.globalProperties.$getChartColors = getChartColors
      app.config.globalProperties.$formatChartData = formatChartData
      
      app.provide('chartjs', ChartJS)
      app.provide('chartPresets', chartPresets)
      app.provide('getChartColors', getChartColors)
      app.provide('formatChartData', formatChartData)
    }
  }
  
  export { ChartJS, chartPresets, getChartColors, formatChartData }