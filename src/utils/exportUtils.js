/**
 * Export to CSV
 */
export function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
      throw new Error('No data to export')
    }
    
    // Get headers from first object
    const headers = Object.keys(data[0])
    
    // Create CSV content
    let csv = headers.join(',') + '\n'
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""')
        return escaped.includes(',') ? `"${escaped}"` : escaped
      })
      csv += values.join(',') + '\n'
    })
    
    // Download
    downloadFile(csv, filename, 'text/csv')
  }
  
  /**
   * Export to JSON
   */
  export function exportToJSON(data, filename = 'export.json') {
    const json = JSON.stringify(data, null, 2)
    downloadFile(json, filename, 'application/json')
  }
  
  /**
   * Export table to CSV
   */
  export function exportTableToCSV(tableId, filename = 'table.csv') {
    const table = document.getElementById(tableId)
    if (!table) {
      throw new Error(`Table with id "${tableId}" not found`)
    }
    
    let csv = []
    const rows = table.querySelectorAll('tr')
    
    rows.forEach(row => {
      const cols = row.querySelectorAll('td, th')
      const csvRow = []
      
      cols.forEach(col => {
        let text = col.textContent.trim()
        text = text.replace(/"/g, '""')
        if (text.includes(',')) {
          text = `"${text}"`
        }
        csvRow.push(text)
      })
      
      csv.push(csvRow.join(','))
    })
    
    downloadFile(csv.join('\n'), filename, 'text/csv')
  }
  
  /**
   * Download file helper
   */
  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  
  /**
   * Print element
   */
  export function printElement(elementId) {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }
    
    const printWindow = window.open('', '', 'height=600,width=800')
    printWindow.document.write('<html><head><title>Print</title>')
    printWindow.document.write('<style>')
    printWindow.document.write('body { font-family: Arial, sans-serif; }')
    printWindow.document.write('table { border-collapse: collapse; width: 100%; }')
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }')
    printWindow.document.write('th { background-color: #f2f2f2; }')
    printWindow.document.write('</style>')
    printWindow.document.write('</head><body>')
    printWindow.document.write(element.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.print()
  }
  
  /**
   * Copy table to clipboard
   */
  export async function copyTableToClipboard(tableId) {
    const table = document.getElementById(tableId)
    if (!table) {
      throw new Error(`Table with id "${tableId}" not found`)
    }
    
    let text = ''
    const rows = table.querySelectorAll('tr')
    
    rows.forEach(row => {
      const cols = row.querySelectorAll('td, th')
      const rowText = Array.from(cols).map(col => col.textContent.trim()).join('\t')
      text += rowText + '\n'
    })
    
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Copy failed:', error)
      return false
    }
  }