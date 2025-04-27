import * as XLSX from 'xlsx';

/**
 * Exporta datos a un archivo Excel
 * @param {Array} data - Array de objetos con los datos a exportar
 * @param {Array} columns - Array de objetos con la configuración de las columnas (header, key, width)
 * @param {String} filename - Nombre del archivo a generar
 * @param {String} sheetName - Nombre de la hoja de cálculo
 */
export const exportToExcel = (data, columns, filename, sheetName = 'Datos') => {
  try {
    // Crear una matriz con los encabezados
    const headers = columns.map(col => col.header);
    
    // Crear una matriz con los datos
    const rows = data.map(item => {
      return columns.map(col => {
        // Si hay un formateador, usarlo
        if (col.formatter) {
          return col.formatter(item[col.key], item);
        }
        return item[col.key];
      });
    });
    
    // Combinar encabezados y filas
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    
    // Configurar anchos de columna
    const colWidths = columns.map(col => ({ wch: col.width || 10 }));
    worksheet['!cols'] = colWidths;
    
    // Crear libro de trabajo y agregar hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generar archivo y descargarlo
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    return false;
  }
};

/**
 * Formatea una fecha para Excel
 * @param {String} dateString - Fecha en formato ISO
 * @returns {String} - Fecha formateada
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea un valor monetario para Excel
 * @param {Number} value - Valor a formatear
 * @returns {String} - Valor formateado
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '';
  return `$${Number(value).toFixed(2)}`;
};
