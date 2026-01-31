import VueApexCharts from 'vue3-apexcharts'

export default {
  install: app => {
    app.use(VueApexCharts)
    
    // Global ApexCharts configuration
    app.config.globalProperties.$apexcharts = {
      chart: {
        fontFamily: 'Inter, sans-serif',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
      },
      xaxis: {
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
      },
      legend: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        labels: {
          colors: '#374151',
        },
      },
    }
  },
}