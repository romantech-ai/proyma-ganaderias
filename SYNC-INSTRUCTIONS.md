# Sincronización con Google Sheets

## Configuración Rápida (5 minutos)

### Paso 1: Crear la Google Sheet

1. Ve a [sheets.google.com](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala: **"Ganaderías Proyma"**
4. En la **fila 1**, escribe estas cabeceras (una por celda):

```
A1: id
B1: nombre
C1: lat
D1: lng
E1: direccion
F1: telefono
G1: email
H1: contacto
I1: categoria
J1: provincia
K1: notas
```

### Paso 2: Publicar para lectura

1. En la hoja, ve a **Archivo** → **Compartir** → **Publicar en la web**
2. En el desplegable, selecciona la hoja específica (no "Documento completo")
3. En formato, selecciona **CSV**
4. Click en **Publicar**
5. **Copia la URL** que aparece (algo como `https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv`)

### Paso 3: Configurar en la App

1. Abre la aplicación de Ganaderías Proyma
2. Click en el botón verde **Sync**
3. Pega la URL que copiaste
4. Click en **Guardar y Probar**

¡Listo! La sincronización de lectura ya funciona.

---

## Configuración Avanzada: Escritura bidireccional

Para que los cambios en la app se reflejen en Google Sheets:

### Paso 1: Crear el Apps Script

1. En tu Google Sheet, ve a **Extensiones** → **Apps Script**
2. Borra el código que aparece
3. Copia todo el contenido del archivo `google-apps-script.js`
4. Pégalo en el editor
5. **Guarda** (Ctrl+S o Cmd+S)

### Paso 2: Implementar como Web App

1. Click en **Implementar** → **Nueva implementación**
2. En "Tipo", selecciona **Aplicación web**
3. Configura:
   - **Descripción**: API Ganaderías
   - **Ejecutar como**: Yo (tu email)
   - **Quién tiene acceso**: Cualquier persona
4. Click en **Implementar**
5. **Autoriza** la aplicación cuando lo pida
6. **Copia la URL** del Web App

### Paso 3: Añadir URL de escritura

En el código de `index.html`, busca `SHEETS_CONFIG` y añade la URL:

```javascript
const SHEETS_CONFIG = {
    readUrl: 'tu-url-de-lectura',
    writeUrl: 'tu-url-del-web-app', // ← Añadir aquí
    sheetId: ''
};
```

---

## Cómo funciona

```
┌─────────────────┐         ┌─────────────────┐
│   App Proyma    │ ──────> │  Google Sheets  │
│  (index.html)   │ <────── │   (tu hoja)     │
└─────────────────┘         └─────────────────┘
        │                           │
        │  1. Click "Sync"          │
        │  2. Fetch CSV público     │
        │  3. Parsear datos         │
        │  4. Merge con locales     │
        │  5. Mostrar en UI         │
        │                           │
        │  (Con escritura)          │
        │  6. POST a Apps Script    │
        │  7. Apps Script escribe   │
        └───────────────────────────┘
```

## Merge de datos

Cuando sincronizas:
- **Google Sheets tiene prioridad** para registros que existen en ambos sitios
- Los registros **solo locales** se mantienen
- Se usa el **nombre** como clave única (case insensitive)

## Solución de problemas

### "Error al conectar con Google Sheets"
- Verifica que la URL termine en `?output=csv`
- Asegúrate de que la hoja esté publicada

### "No se encontraron datos"
- Verifica que la hoja tenga datos (además de las cabeceras)
- Comprueba que las cabeceras sean exactamente como se indica

### Los cambios no se guardan en Sheets
- Necesitas configurar el Apps Script (ver sección avanzada)
- Verifica que hayas autorizado la aplicación

---

## Exportar datos actuales a Sheets

Si ya tienes datos en la app y quieres pasarlos a una nueva Sheet:

1. Click en **Exportar** para descargar CSV
2. En Google Sheets, ve a **Archivo** → **Importar**
3. Sube el CSV
4. Selecciona "Reemplazar hoja actual"
5. Publica la hoja como CSV
6. Configura la URL en la app

---

## Demo para Proyma

Para mostrar esto a Proyma:

1. **Crea una Sheet de demo** con 5-10 ganaderías de ejemplo
2. **Configura la sincronización** en tu app
3. **Muestra el flujo**:
   - "Mira, estos datos están en Google Sheets"
   - "Ahora sincronizo con un click"
   - "Los datos aparecen en la app"
   - "Si edito aquí y vuelvo a sincronizar, se actualiza"

**Argumento de venta**:
> "Vuestro empleado tiene todas las ubicaciones en Google Maps. Con esta herramienta, podemos migrar esos datos a Google Sheets, y desde ahí la app se sincroniza automáticamente. Cualquiera del equipo puede editar la Sheet, y todos ven los cambios en el mapa."
