import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

// ============================================================================
// EXCEL EXPORT
// ============================================================================

/**
 * Export data to Excel file
 * @param {Array|Object} data - Data to export (array of objects or worksheets object)
 * @param {string} filename - Output filename
 * @param {string} sheetName - Sheet name (if data is array)
 * @returns {boolean} Success status
 */
export function exportToExcel(data, filename = 'export.xlsx', sheetName = 'Sheet1') {
  try {
    const wb = XLSX.utils.book_new()
    
    // Handle multiple sheets
    if (typeof data === 'object' && !Array.isArray(data)) {
      Object.entries(data).forEach(([name, sheetData]) => {
        const ws = XLSX.utils.json_to_sheet(sheetData)
        XLSX.utils.book_append_sheet(wb, ws, name)
      })
    } else {
      // Single sheet
      const ws = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(wb, ws, sheetName)
    }
    
    XLSX.writeFile(wb, filename)
    return true
  } catch (error) {
    console.error('Excel export error:', error)
    return false
  }
}

/**
 * Export table element to Excel
 * @param {string} tableId - Table element ID
 * @param {string} filename - Output filename
 * @param {string} sheetName - Sheet name
 * @returns {boolean} Success status
 */
export function exportTableToExcel(tableId, filename = 'export.xlsx', sheetName = 'Sheet1') {
  try {
    const table = document.getElementById(tableId)
    if (!table) {
      console.error('Table not found:', tableId)
      return false
    }
    
    const ws = XLSX.utils.table_to_sheet(table)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, filename)
    return true
  } catch (error) {
    console.error('Excel export error:', error)
    return false
  }
}

/**
 * Export data to Excel with custom formatting
 * @param {Array} data - Data to export
 * @param {Array} columns - Column definitions
 * @param {string} filename - Output filename
 * @param {Object} options - Export options
 * @returns {boolean} Success status
 */
export function exportToExcelFormatted(data, columns, filename = 'export.xlsx', options = {}) {
  try {
    const {
      sheetName = 'Data',
      columnWidths = {},
      headerStyle = {},
    } = options
    
    // Map data to columns
    const mappedData = data.map(row => {
      const mappedRow = {}
      columns.forEach(col => {
        mappedRow[col.header] = col.formatter ? col.formatter(row[col.key]) : row[col.key]
      })
      return mappedRow
    })
    
    const ws = XLSX.utils.json_to_sheet(mappedData)
    
    // Apply column widths
    const wscols = columns.map(col => ({
      wch: columnWidths[col.key] || 15,
    }))
    ws['!cols'] = wscols
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    XLSX.writeFile(wb, filename)
    return true
  } catch (error) {
    console.error('Formatted Excel export error:', error)
    return false
  }
}

// ============================================================================
// CSV EXPORT
// ============================================================================

/**
 * Export data to CSV file
 * @param {Array} data - Data to export
 * @param {string} filename - Output filename
 * @param {string} delimiter - CSV delimiter
 * @returns {boolean} Success status
 */
export function exportToCSV(data, filename = 'export.csv', delimiter = ',') {
  try {
    if (!data || data.length === 0) {
      console.error('No data to export')
      return false
    }
    
    const ws = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(ws, { FS: delimiter })
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, filename)
    
    return true
  } catch (error) {
    console.error('CSV export error:', error)
    return false
  }
}

/**
 * Export table to CSV
 * @param {string} tableId - Table element ID
 * @param {string} filename - Output filename
 * @returns {boolean} Success status
 */
export function exportTableToCSV(tableId, filename = 'export.csv') {
  try {
    const table = document.getElementById(tableId)
    if (!table) {
      console.error('Table not found:', tableId)
      return false
    }
    
    const ws = XLSX.utils.table_to_sheet(table)
    const csv = XLSX.utils.sheet_to_csv(ws)
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, filename)
    
    return true
  } catch (error) {
    console.error('CSV export error:', error)
    return false
  }
}

// ============================================================================
// PDF EXPORT
// ============================================================================

/**
 * Export data to PDF
 * @param {Array} data - Data to export
 * @param {Array} columns - Column definitions
 * @param {string} filename - Output filename
 * @param {Object} options - PDF options
 * @returns {boolean} Success status
 */
export function exportToPDF(data, columns, filename = 'export.pdf', options = {}) {
  try {
    const {
      title = 'Report',
      orientation = 'portrait',
      pageSize = 'a4',
      margins = { top: 20, right: 20, bottom: 20, left: 20 },
      headerColor = [59, 130, 246], // primary-600
      fontSize = 10,
    } = options
    
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize,
    })
    
    // Add title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margins.left, margins.top)
    
    // Add date
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const dateStr = new Date().toLocaleDateString('uz-UZ')
    doc.text(dateStr, margins.left, margins.top + 7)
    
    // Prepare table data
    const headers = columns.map(col => col.header)
    const body = data.map(row => 
      columns.map(col => {
        const value = row[col.key]
        return col.formatter ? col.formatter(value) : value
      })
    )
    
    // Add table
    doc.autoTable({
      head: [headers],
      body,
      startY: margins.top + 15,
      margin: margins,
      styles: {
        font: 'helvetica',
        fontSize,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: headerColor,
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    })
    
    doc.save(filename)
    return true
  } catch (error) {
    console.error('PDF export error:', error)
    return false
  }
}

/**
 * Export table element to PDF
 * @param {string} tableId - Table element ID
 * @param {string} filename - Output filename
 * @param {Object} options - PDF options
 * @returns {boolean} Success status
 */
export function exportTableToPDF(tableId, filename = 'export.pdf', options = {}) {
  try {
    const table = document.getElementById(tableId)
    if (!table) {
      console.error('Table not found:', tableId)
      return false
    }
    
    const {
      title = 'Report',
      orientation = 'portrait',
      headerColor = [59, 130, 246],
    } = options
    
    const doc = new jsPDF({ orientation })
    
    // Add title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 14, 15)
    
    // Add table
    doc.autoTable({
      html: `#${tableId}`,
      startY: 25,
      styles: {
        font: 'helvetica',
        fontSize: 10,
      },
      headStyles: {
        fillColor: headerColor,
        textColor: 255,
        fontStyle: 'bold',
      },
    })
    
    doc.save(filename)
    return true
  } catch (error) {
    console.error('PDF export error:', error)
    return false
  }
}

/**
 * Generate PDF from HTML content
 * @param {string} elementId - Element ID or HTML string
 * @param {string} filename - Output filename
 * @param {Object} options - PDF options
 * @returns {Promise<boolean>} Success status
 */
export async function exportHtmlToPDF(elementId, filename = 'export.pdf', options = {}) {
  try {
    const { default: html2canvas } = await import('html2canvas')
    
    const element = typeof elementId === 'string' 
      ? document.getElementById(elementId) 
      : elementId
      
    if (!element) {
      console.error('Element not found:', elementId)
      return false
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      ...options.canvasOptions,
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      ...options.pdfOptions,
    })
    
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(filename)
    
    return true
  } catch (error) {
    console.error('HTML to PDF error:', error)
    return false
  }
}

// ============================================================================
// JSON EXPORT
// ============================================================================

/**
 * Export data to JSON file
 * @param {*} data - Data to export
 * @param {string} filename - Output filename
 * @param {boolean} pretty - Pretty print JSON
 * @returns {boolean} Success status
 */
export function exportToJSON(data, filename = 'export.json', pretty = true) {
  try {
    const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data)
    const blob = new Blob([json], { type: 'application/json' })
    downloadBlob(blob, filename)
    return true
  } catch (error) {
    console.error('JSON export error:', error)
    return false
  }
}

// ============================================================================
// PRINT FUNCTIONS
// ============================================================================

/**
 * Print element
 * @param {string} elementId - Element ID to print
 * @param {Object} options - Print options
 * @returns {boolean} Success status
 */
export function printElement(elementId, options = {}) {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      console.error('Element not found:', elementId)
      return false
    }
    
    const {
      title = 'Print',
      styles = '',
      beforePrint = null,
      afterPrint = null,
    } = options
    
    const printWindow = window.open('', '', 'height=600,width=800')
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #3b82f6; color: white; }
            @media print {
              body { padding: 0; }
            }
            ${styles}
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    
    if (beforePrint) beforePrint()
    
    setTimeout(() => {
      printWindow.print()
      if (afterPrint) afterPrint()
      setTimeout(() => printWindow.close(), 100)
    }, 250)
    
    return true
  } catch (error) {
    console.error('Print error:', error)
    return false
  }
}

/**
 * Print current page
 */
export function printPage() {
  window.print()
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Download blob as file
 * @param {Blob} blob - Blob to download
 * @param {string} filename - Download filename
 */
function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => window.URL.revokeObjectURL(url), 100)
}

/**
 * Download URL as file
 * @param {string} url - File URL
 * @param {string} filename - Download filename
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Download base64 as file
 * @param {string} base64 - Base64 data
 * @param {string} filename - Download filename
 * @param {string} mimeType - MIME type
 */
export function downloadBase64(base64, filename, mimeType = 'application/octet-stream') {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: mimeType })
  downloadBlob(blob, filename)
}

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

/**
 * Read Excel file
 * @param {File} file - Excel file
 * @param {Object} options - Read options
 * @returns {Promise<Object>} Parsed data
 */
export async function readExcelFile(file, options = {}) {
  try {
    const {
      sheetName = null, // null = first sheet
      header = 1, // row number for headers
    } = options
    
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    
    const sheet = sheetName 
      ? workbook.Sheets[sheetName]
      : workbook.Sheets[workbook.SheetNames[0]]
    
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header })
    
    return {
      data: jsonData,
      sheetNames: workbook.SheetNames,
    }
  } catch (error) {
    console.error('Excel read error:', error)
    throw error
  }
}

/**
 * Read CSV file
 * @param {File} file - CSV file
 * @param {Object} options - Read options
 * @returns {Promise<Array>} Parsed data
 */
export async function readCSVFile(file, options = {}) {
  try {
    const text = await file.text()
    const workbook = XLSX.read(text, { type: 'string', ...options })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    return XLSX.utils.sheet_to_json(firstSheet)
  } catch (error) {
    console.error('CSV read error:', error)
    throw error
  }
}

/**
 * Read JSON file
 * @param {File} file - JSON file
 * @returns {Promise<*>} Parsed data
 */
export async function readJSONFile(file) {
  try {
    const text = await file.text()
    return JSON.parse(text)
  } catch (error) {
    console.error('JSON read error:', error)
    throw error
  }
}