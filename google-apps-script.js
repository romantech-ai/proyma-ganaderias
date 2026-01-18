/**
 * Google Apps Script para sincronización bidireccional
 *
 * INSTRUCCIONES DE INSTALACIÓN:
 *
 * 1. Abre tu Google Sheet
 * 2. Ve a Extensiones > Apps Script
 * 3. Borra el código existente y pega todo este archivo
 * 4. Guarda el proyecto (Ctrl+S)
 * 5. Click en "Implementar" > "Nueva implementación"
 * 6. Selecciona tipo: "Aplicación web"
 * 7. Configuración:
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquiera"
 * 8. Click en "Implementar"
 * 9. Copia la URL que te da (es tu writeUrl)
 *
 * IMPORTANTE: Cada vez que modifiques el código, debes crear
 * una NUEVA implementación para que los cambios se apliquen.
 */

// Nombre de la hoja donde están los datos
const SHEET_NAME = 'Hoja 1'; // Cambia si tu hoja tiene otro nombre

/**
 * Maneja las peticiones GET (para verificar que funciona)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'API de Ganaderías Proyma funcionando',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Maneja las peticiones POST (para recibir datos)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.ganaderias && Array.isArray(data.ganaderias)) {
      updateSheet(data.ganaderias);

      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'success',
          message: `Actualizadas ${data.ganaderias.length} ganaderías`,
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error('Formato de datos inválido');
    }
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Actualiza la hoja con los nuevos datos
 */
function updateSheet(ganaderias) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error(`Hoja "${SHEET_NAME}" no encontrada`);
  }

  // Definir las columnas esperadas
  const headers = ['id', 'nombre', 'lat', 'lng', 'direccion', 'telefono', 'email', 'contacto', 'categoria', 'provincia', 'notas'];

  // Verificar/crear cabeceras
  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (currentHeaders[0] !== 'id') {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  // Limpiar datos existentes (excepto cabecera)
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }

  // Escribir nuevos datos
  if (ganaderias.length > 0) {
    const rows = ganaderias.map((g, index) => [
      g.id || index + 1,
      g.nombre || '',
      g.lat || '',
      g.lng || '',
      g.direccion || '',
      g.telefono || '',
      g.email || '',
      g.contacto || '',
      g.categoria || 'activo',
      g.provincia || '',
      g.notas || ''
    ]);

    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  // Autoajustar columnas
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * Función para probar manualmente desde el editor
 */
function testUpdate() {
  const testData = [
    {
      id: 1,
      nombre: 'Ganadería Test',
      lat: 39.3891,
      lng: -3.0067,
      direccion: 'Calle Test 123',
      telefono: '600000000',
      email: 'test@test.com',
      contacto: 'Juan Test',
      categoria: 'activo',
      provincia: 'Ciudad Real',
      notas: 'Esto es una prueba'
    }
  ];

  updateSheet(testData);
  Logger.log('Test completado');
}

/**
 * Función para leer los datos actuales de la hoja
 */
function readSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    throw new Error(`Hoja "${SHEET_NAME}" no encontrada`);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

/**
 * Trigger para sincronización automática (opcional)
 * Ejecuta cada hora para mantener datos actualizados
 */
function setupAutoSync() {
  // Eliminar triggers existentes
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Crear nuevo trigger cada hora
  ScriptApp.newTrigger('autoSync')
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log('Auto-sync configurado cada hora');
}

function autoSync() {
  // Aquí puedes añadir lógica de sincronización automática
  Logger.log('Auto-sync ejecutado: ' + new Date().toISOString());
}
