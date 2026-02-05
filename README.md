# Go + WASM Calculadora Matemática

Cálculos matemáticos usando Go compilado a WebAssembly - demostrando la portabilidad de código backend al navegador.

## 📁 Estructura del Proyecto

```
go-wasm-demo/
├── main.go              # Motor de física en Go (WASM)
├── server.go            # Servidor HTTP en Go
├── go.mod               # Módulo Go
├── run.sh               # Compila y ejecuta el proyecto
├── presentation.html    # Slides de la presentación
├── PRESENTACION.md      # Guía de la charla
├── README.md
├── templates/
│   └── index.html       # Interfaz principal del canvas
└── static/
    ├── css/
    │   └── styles.css   # Estilos de la aplicación
    ├── js/
    │   ├── script.js    # Integración JS ↔ WASM
    │   └── wasm_exec.js # Runtime Go (generado)
    └── wasm/
        └── main.wasm    # Binario WebAssembly (generado)
```

## 🚀 Cómo Ejecutar

### Opción 1: Todo en uno (Recomendado)

```bash
chmod +x run.sh
./run.sh
```

Esto automáticamente:
1. ✅ Compila `main.go` a WebAssembly
2. ✅ Copia `wasm_exec.js` si es necesario
3. ✅ Inicia el servidor en `http://localhost:8080`

### Opción 2: Manual

```bash
# 1. Compilar WASM
GOOS=js GOARCH=wasm go build -o static/wasm/main.wasm main.go

# 2. Copiar runtime (primera vez)
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" static/js/

# 3. Iniciar servidor
go run server.go
```

### Abrir en el navegador

- **Aplicación principal:** `http://localhost:8080`
- **Presentación:** `http://localhost:8080/presentation.html`

**Nota:** Presiona `Ctrl+C` para detener el servidor.

## 🎯 ¿Qué Hace Este Proyecto?

Demuestra cómo Go puede ejecutarse en el navegador para realizar **cálculos matemáticos intensivos** con rendimiento casi nativo.

### Funciones Implementadas:

- 🔢 **Fibonacci (Recursivo)** - Algoritmo intensivo en CPU
- 🎯 **Números Primos** - Encuentra todos los primos hasta N
- 📊 **Factorial** - Cálculo recursivo de factoriales
- 📈 **Estadísticas** - Procesa 1 millón de números (promedio, desviación)

### Por qué este ejemplo:

- ✅ **Simple de entender** - Matemáticas básicas
- ✅ **Demuestra portabilidad** - Código reutilizable
- ✅ **Fácil de comparar** - Puedes hacer lo mismo en JS
- ✅ **Sin complejidad visual** - Enfoque en la integración

## 🔧 Cómo Funciona

### Flujo de Comunicación

```
JavaScript (UI)  ←→  Go WASM (Lógica)
    - Eventos          - Cálculos
    - Renderizado      - Algoritmos
    - DOM              - Procesamiento
```

### 1. Go expone funciones a JavaScript

```go
js.Global().Set("goAddBall", js.FuncOf(addBall))
js.Global().Set("goUpdatePhysics", js.FuncOf(updatePhysics))
js.Global().Set("goGetBalls", js.FuncOf(getBalls))
```

### 2. JavaScript llama funciones Go

```javascript
// Calcular Fibonacci
const result = goFibonacci(40);

// Encontrar primos
const primes = goFindPrimes(10000);

// Calcular factorial
const fact = goFactorial(20);

// Analizar array
const stats = goStatistics([1, 2, 3, ...]);
```

### 3. Go realiza los cálculos

```go
func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fib(n-1) + fib(n-2)
}

func isPrime(n int) bool {
    for i := 2; i*i <= n; i++ {
        if n%i == 0 {
            return false
        }
    }
    return true
}
```

## 💡 Conceptos Clave

### ¿Por qué Go + WASM para Cálculos?

- **Portabilidad**: Reutiliza código backend en el navegador
- **Algoritmos intensivos**: Fibonacci, primos, factoriales
- **Tipado estático**: Seguridad en tiempo de compilación
- **Compilado**: Código AOT (ahead-of-time)

### Ejemplo de Código (Fibonacci)

```go
// Calcular Fibonacci (recursivo - intensivo)
func fibonacci(this js.Value, args []js.Value) interface{} {
    n := args[0].Int()
    return fib(n)
}

func fib(n int) int {
    if n <= 1 {
        return n
    }
    return fib(n-1) + fib(n-2)
}

// Encontrar números primos hasta N
func findPrimes(this js.Value, args []js.Value) interface{} {
    n := args[0].Int()
    primes := []interface{}{}
    
    for i := 2; i <= n; i++ {
        if isPrime(i) {
            primes = append(primes, i)
        }
    }
    
    return jsArray(primes)
}

func isPrime(n int) bool {
    if n < 2 {
        return false
    }
    for i := 2; i*i <= n; i++ {
        if n%i == 0 {
            return false
        }
    }
    return true
}
```

### API Completa Go → JavaScript

```javascript
goFibonacci(n)        // Calcular Fibonacci(n) recursivamente
goFindPrimes(n)       // Encontrar todos los primos hasta n
goFactorial(n)        // Calcular n! (factorial)
goSumArray(array)     // Sumar todos los elementos
goStatistics(array)   // Calcular promedio y desviación estándar
```

### Compilación a WASM

```bash
GOOS=js GOARCH=wasm go build -o main.wasm main.go
```

- `GOOS=js` - Sistema operativo objetivo: JavaScript
- `GOARCH=wasm` - Arquitectura: WebAssembly

## 📊 Características

### Ventajas de Go + WASM:

**Portabilidad de código:**

1. **Binario pre-compilado** - Código AOT (ahead-of-time)
2. **Tipos estáticos** - Seguridad en tiempo de compilación
3. **Reutilización** - El mismo código en backend y frontend
4. **Consistencia** - Comportamiento predecible entre plataformas

## 🎓 Para Tu Charla

### Puntos Clave a Explicar:

1. **¿Qué es WebAssembly?**
   - Formato binario para ejecutar código cerca del metal
   - Complementa JavaScript (JS = UI, WASM = cálculos)
   - Estándar W3C desde 2019

2. **¿Cuándo usar WASM?**
   - Juegos y simulaciones
   - Procesamiento de datos
   - Física y matemáticas intensivas
   - Portar código existente de otros lenguajes

3. **Go es ideal para WASM porque:**
   - Compilación trivial (una línea)
   - Código simple y legible
   - Balance productividad/portabilidad
   - Mismo código en backend y frontend

### Demo en Vivo:

1. **Fibonacci Interactivo** (1 min)
   - Probar con n=40
   - Mostrar resultado
   - Código simple y legible

2. **Números Primos** (1 min)
   - Probar con 100,000
   - Mostrar cuántos encuentra
   - Mismo algoritmo que usarías en backend

4. **Estadísticas** (1 min)
   - Procesar 1 millón de números
   - "Go procesa 1M números en 50ms"

5. **DevTools** (1 min)
   - Console: llamar funciones Go manualmente
   - `goFibonacci(35)`
   - Network: mostrar main.wasm (1.9 MB)

## 🛠️ Extender el Proyecto

### Agregar nuevas funciones matemáticas:

1. **En main.go**:
```go
// Calcular potencia
func power(this js.Value, args []js.Value) interface{} {
    base := args[0].Float()
    exp := args[1].Int()
    result := 1.0
    for i := 0; i < exp; i++ {
        result *= base
    }
    return result
}

// En main()
js.Global().Set("goPower", js.FuncOf(power))
```

2. **En script.js**:
```javascript
function calculatePower() {
    const base = parseFloat(document.getElementById('baseInput').value);
    const exp = parseInt(document.getElementById('expInput').value);
    const result = goPower(base, exp);
    document.getElementById('powerResult').textContent = result;
}
```

3. **En templates/index.html**:
```html
<input type="number" id="baseInput" placeholder="Base">
<input type="number" id="expInput" placeholder="Exponente">
<button onclick="calculatePower()">Calcular</button>
<div id="powerResult"></div>
```

## 📚 Recursos

- [Go WebAssembly Wiki](https://github.com/golang/go/wiki/WebAssembly)
- [WebAssembly.org](https://webassembly.org/)
- [syscall/js docs](https://pkg.go.dev/syscall/js)
- [WASM by Example](https://wasmbyexample.dev/)
- [MDN WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)

## ✨ Casos de Uso Reales de WASM

- **Figma**: Renderizado vectorial (Rust + WASM)
- **Google Earth**: Globo 3D completo (C++ → WASM)
- **AutoCAD**: 35 años de código C++ portado
- **Unity/Unreal**: Juegos AAA en navegador
- **Squoosh**: Codecs de compresión nativos
- **Cloudflare Workers**: Serverless con arranque instantáneo

## 🎯 Arquitectura del Ejemplo

```
┌─────────────────────────────────────┐
│  server.go (Go HTTP Server)         │
│  - Sirve /templates/index.html      │
│  - Sirve /static/* (css, js, wasm)  │
│  - Puerto 8080                      │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  templates/index.html (UI)          │
│  - Formularios de entrada           │
│  - Botones para cada cálculo        │
│  - Áreas de resultado               │
└─────────────────────────────────────┘
              ↓↑
┌─────────────────────────────────────┐
│  static/js/script.js (Integración)  │
│  - Captura eventos de botones       │
│  - Llama funciones Go               │
│  - Muestra resultados y tiempos     │
│  - Maneja estado de WASM            │
└─────────────────────────────────────┘
              ↓↑
┌─────────────────────────────────────┐
│  static/wasm/main.wasm (Cálculos)   │
│  - Compilado desde main.go          │
│  - Fibonacci recursivo              │
│  - Búsqueda de primos               │
│  - Factorial, estadísticas          │
│  - Código Go portado al navegador   │
└─────────────────────────────────────┘
```

## 🎬 Presentación Incluida

El proyecto incluye:
- **`presentation.html`** - Slides con Reveal.js (9 slides)
- **`PRESENTACION.md`** - Guía completa para dar la charla (10 diapositivas)

Para ver las slides:
```bash
# Iniciar servidor
./run.sh
# O manualmente: go run server.go

# Abrir en navegador
http://localhost:8080/presentation.html
```

Navega con flechas ← → o haz scroll vertical si no cabe el contenido.

---

**Portabilidad de código Go en el navegador** 🚀

*Proyecto educativo para demostrar el poder de WebAssembly*
