import { ref } from 'vue'
import { useNotifications } from './useNotifications'
import { formatDate } from '@/utils/dateUtils'

export function useExport() {
  const { success, error } = useNotifications()
  const exporting = ref(false)

  // Export to CSV
  const exportToCSV = (data, filename = 'export', columns = null) => {
    try {
      exporting.value = true

      if (!data || data.length === 0) {
        error('Eksport qilish uchun ma\'lumot yo\'q')
        return
      }

      // Get columns
      const headers = columns || Object.keys(data[0])
      
      // Create CSV content
      let csv = headers.join(',') + '\n'
      
      data.forEach(row => {
        const values = headers.map(header => {
          let value = row[header]
          
          // Handle special values
          if (value === null || value === undefined) {
            value = ''
          } else if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`
          }
          
          return value
        })
        csv += values.join(',') + '\n'
      })

      // Download file
      downloadFile(csv, `${filename}_${formatDate(new Date(), 'YYYY-MM-DD')}.csv`, 'text/csv')
      success('CSV fayl yuklab olindi')
    } catch (err) {
      error('CSV eksport xatolik: ' + err.message)
    } finally {
      exporting.value = false
    }
  }

  // Export to Excel (using CSV format)
  const exportToExcel = (data, filename = 'export', columns = null) => {
    try {
      exporting.value = true

      if (!data || data.length === 0) {
        error('Eksport qilish uchun ma\'lumot yo\'q')
        return
      }

      // Get columns
      const headers = columns || Object.keys(data[0])
      
      // Create Excel-compatible CSV
      let csv = '\uFEFF' // UTF-8 BOM for Excel
      csv += headers.join('\t') + '\n'
      
      data.forEach(row => {
        const values = headers.map(header => {
          let value = row[header]
          if (value === null || value === undefined) return ''
          return String(value)
        })
        csv += values.join('\t') + '\n'
      })

      downloadFile(csv, `${filename}_${formatDate(new Date(), 'YYYY-MM-DD')}.xls`, 'application/vnd.ms-excel')
      success('Excel fayl yuklab olindi')
    } catch (err) {
      error('Excel eksport xatolik: ' + err.message)
    } finally {
      exporting.value = false
    }
  }

  // Export to JSON
  const exportToJSON = (data, filename = 'export') => {
    try {
      exporting.value = true

      if (!data) {
        error('Eksport qilish uchun ma\'lumot yo\'q')
        return
      }

      const json = JSON.stringify(data, null, 2)
      downloadFile(json, `${filename}_${formatDate(new Date(), 'YYYY-MM-DD')}.json`, 'application/json')
      success('JSON fayl yuklab olindi')
    } catch (err) {
      error('JSON eksport xatolik: ' + err.message)
    } finally {
      exporting.value = false
    }
  }

  // Export to PDF (basic text version)
  const exportToPDF = (data, filename = 'export', options = {}) => {
    try {
      exporting.value = true

      const {
        title = 'Export',
        columns = null
      } = options

      if (!data || data.length === 0) {
        error('Eksport qilish uchun ma\'lumot yo\'q')
        return
      }

      // Note: For production, use a library like jsPDF
      // This is a simplified text-based version
      let content = title + '\n\n'
      
      const headers = columns || Object.keys(data[0])
      content += headers.join(' | ') + '\n'
      content += '-'.repeat(headers.join(' | ').length) + '\n'
      
      data.forEach(row => {
        const values = headers.map(header => String(row[header] || ''))
        content += values.join(' | ') + '\n'
      })

      downloadFile(content, `${filename}_${formatDate(new Date(), 'YYYY-MM-DD')}.txt`, 'text/plain')
      success('Fayl yuklab olindi')
    } catch (err) {
      error('Eksport xatolik: ' + err.message)
    } finally {
      exporting.value = false
    }
  }

  // Download file helper
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Print data
  const printData = (data, options = {}) => {
    try {
      const {
        title = 'Print',
        columns = null
      } = options

      if (!data || data.length === 0) {
        error('Chop etish uchun ma\'lumot yo\'q')
        return
      }

      const headers = columns || Object.keys(data[0])
      
      let html = `
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `

      const printWindow = window.open('', '', 'height=600,width=800')
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.print()
    } catch (err) {
      error('Chop etish xatolik: ' + err.message)
    }
  }

  return {
    exporting,
    exportToCSV,
    exportToExcel,
    exportToJSON,
    exportToPDF,
    printData
  }
}