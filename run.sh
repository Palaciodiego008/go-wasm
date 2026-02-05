#!/bin/bash

echo "🔨 Compilando Go a WASM..."
GOOS=js GOARCH=wasm go build -o static/wasm/main.wasm main.go

if [ $? -ne 0 ]; then
    echo "❌ Error en compilación"
    exit 1
fi

echo "✅ Compilación exitosa!"

# Buscar wasm_exec.js
if [ ! -f "static/js/wasm_exec.js" ]; then
    echo "📦 Buscando wasm_exec.js..."
    
    # Intentar ubicaciones comunes
    WASM_EXEC=""
    
    # Ubicación estándar (Go 1.21+)
    if [ -f "$(go env GOROOT)/lib/wasm/wasm_exec.js" ]; then
        WASM_EXEC="$(go env GOROOT)/lib/wasm/wasm_exec.js"
    # Ubicación antigua (Go < 1.21)
    elif [ -f "$(go env GOROOT)/misc/wasm/wasm_exec.js" ]; then
        WASM_EXEC="$(go env GOROOT)/misc/wasm/wasm_exec.js"
    # Ubicación alternativa 1
    elif [ -f "/usr/lib/go/misc/wasm/wasm_exec.js" ]; then
        WASM_EXEC="/usr/lib/go/misc/wasm/wasm_exec.js"
    # Ubicación alternativa 2
    elif [ -f "/usr/share/go/misc/wasm/wasm_exec.js" ]; then
        WASM_EXEC="/usr/share/go/misc/wasm/wasm_exec.js"
    # Ubicación alternativa 3 (snap)
    elif [ -f "/snap/go/current/misc/wasm/wasm_exec.js" ]; then
        WASM_EXEC="/snap/go/current/misc/wasm/wasm_exec.js"
    fi
    
    if [ -n "$WASM_EXEC" ]; then
        cp "$WASM_EXEC" static/js/
        echo "✅ wasm_exec.js copiado desde: $WASM_EXEC"
    else
        # Descargar desde GitHub si no se encuentra localmente
        echo "⬇️  Descargando wasm_exec.js desde GitHub..."
        GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
        curl -s "https://raw.githubusercontent.com/golang/go/release-branch.go${GO_VERSION%.*}/misc/wasm/wasm_exec.js" -o static/js/wasm_exec.js
        
        if [ $? -eq 0 ]; then
            echo "✅ wasm_exec.js descargado exitosamente"
        else
            echo "❌ No se pudo obtener wasm_exec.js"
            echo "💡 Descárgalo manualmente de: https://github.com/golang/go/blob/master/misc/wasm/wasm_exec.js"
            exit 1
        fi
    fi
fi

echo ""
echo "🚀 Iniciando servidor en http://localhost:8080"
echo "⚡ Presiona Ctrl+C para detener"
echo ""

# Ejecutar servidor
go run server.go
