#!/bin/bash
# Script para crear versión de producción con código ofuscado

echo "🔧 Creando versión de producción..."

# Extraer JavaScript del HTML
sed -n '/<script>$/,/<\/script>$/p' index.html | sed '1d;$d' > temp-script.js

# Ofuscar JavaScript
npx javascript-obfuscator temp-script.js \
  --output app.min.js \
  --compact true \
  --control-flow-flattening false \
  --dead-code-injection false \
  --string-array true \
  --string-array-encoding base64 \
  --string-array-threshold 0.75

# Crear HTML de producción
awk '/<script src="https:\/\/unpkg.com\/leaflet.markercluster/{found=1} found && /<script>$/{exit} {print}' index.html > index.prod.html
echo '    <script src="app.min.js"></script>' >> index.prod.html
echo '</body>' >> index.prod.html
echo '</html>' >> index.prod.html

# Limpiar
rm -f temp-script.js

echo "✅ Archivos creados:"
echo "   - index.prod.html (HTML de producción)"
echo "   - app.min.js (JavaScript ofuscado)"
echo ""
echo "📦 Para deploy: renombra index.prod.html a index.html"
