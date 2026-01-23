import { ref, computed, inject } from 'vue'
import { formatNumber, formatCurrency } from '@/utils/numberUtils'

export function useChart() {
  const chartColors = inject('$getChartColors', () => [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#6366F1'
  ])

  const chartPresets = inject('$chartPresets', {})

  // Generate chart data
  const generateChartData = (labels, datasets) => {
    return {
      labels,
      datasets: datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || chartColors()[index],
        borderColor: dataset.borderColor || chartColors()[index],
        borderWidth: dataset.borderWidth || 2
      }))
    }
  }

  // Generate line chart data
  const generateLineData = (labels, data, label = 'Data') => {
    return generateChartData(labels, [{
      label,
      data,
      fill: false,
      tension: 0.4
    }])
  }

  // Generate bar chart data
  const generateBarData = (labels, data, label = 'Data') => {
    return generateChartData(labels, [{
      label,
      data
    }])
  }

  // Generate pie/doughnut chart data
  const generatePieData = (labels, data) => {
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: chartColors().slice(0, labels.length)
      }]
    }
  }

  // Generate multiple dataset chart
  const generateMultiDataset = (labels, datasets) => {
    return generateChartData(labels, datasets)
  }

  // Format chart data for display
  const formatChartValue = (value, format = 'number') => {
    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percent':
        return `${value}%`
      case 'number':
      default:
        return formatNumber(value)
    }
  }

  // Get chart options
  const getChartOptions = (options = {}) => {
    const {
      title = '',
      legend = true,
      tooltip = true,
      responsive = true,
      maintainAspectRatio = false,
      valueFormat = 'number'
    } = options

    return {
      responsive,
      maintainAspectRatio,
      plugins: {
        title: {
          display: !!title,
          text: title
        },
        legend: {
          display: legend
        },
        tooltip: {
          enabled: tooltip,
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || ''
              if (label) label += ': '
              label += formatChartValue(context.parsed.y || context.parsed, valueFormat)
              return label
            }
          }
        }
      },
      ...options.extra
    }
  }

  return {
    chartColors: chartColors(),
    generateChartData,
    generateLineData,
    generateBarData,
    generatePieData,
    generateMultiDataset,
    formatChartValue,
    getChartOptions
  }
}