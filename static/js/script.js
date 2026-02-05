// Estado de WASM
let wasmReady = false;

// Inicializar WASM
const go = new Go();
WebAssembly.instantiateStreaming(fetch("/static/wasm/main.wasm"), go.importObject)
    .then((result) => {
        go.run(result.instance);
        wasmReady = true;
        updateStatus('ready', '✅ Go WASM Listo! Prueba los cálculos.');
    })
    .catch((err) => {
        console.error('Error cargando WASM:', err);
        updateStatus('error', '❌ Error al cargar WASM: ' + err.message);
    });

// Actualizar status
function updateStatus(type, message) {
    const status = document.getElementById('status');
    status.className = 'status ' + type;
    status.textContent = message;
}

// Calcular Fibonacci
function calculateFibonacci() {
    if (!wasmReady) {
        alert('WASM no está listo aún');
        return;
    }
    
    const n = parseInt(document.getElementById('fibInput').value);
    const resultDiv = document.getElementById('fibResult');
    
    if (n < 1 || n > 45) {
        resultDiv.innerHTML = '<span class="value">⚠️ Ingresa un número entre 1 y 45</span>';
        return;
    }
    
    resultDiv.innerHTML = '<span class="loading-spinner"></span> Calculando...';
    
    setTimeout(() => {
        const startTime = performance.now();
        const result = goFibonacci(n);
        const time = (performance.now() - startTime).toFixed(2);
        
        resultDiv.innerHTML = `
            <div class="value">Fibonacci(${n}) = <strong>${result.toLocaleString()}</strong></div>
            <span class="time">⚡ Calculado en ${time}ms</span>
        `;
    }, 10);
}

// Encontrar números primos
function calculatePrimes() {
    if (!wasmReady) {
        alert('WASM no está listo aún');
        return;
    }
    
    const n = parseInt(document.getElementById('primeInput').value);
    const resultDiv = document.getElementById('primeResult');
    
    if (n < 1 || n > 1000000) {
        resultDiv.innerHTML = '<span class="value">⚠️ Ingresa un número entre 1 y 1,000,000</span>';
        return;
    }
    
    resultDiv.innerHTML = '<span class="loading-spinner"></span> Calculando...';
    
    setTimeout(() => {
        const startTime = performance.now();
        const primes = goFindPrimes(n);
        const time = (performance.now() - startTime).toFixed(2);
        
        const count = primes.length;
        const first10 = [];
        for (let i = 0; i < Math.min(10, count); i++) {
            first10.push(primes[i]);
        }
        
        resultDiv.innerHTML = `
            <div class="value">
                <span class="count">Encontrados: ${count.toLocaleString()} primos hasta ${n.toLocaleString()}</span><br>
                Primeros 10: ${first10.join(', ')}${count > 10 ? '...' : ''}
            </div>
            <span class="time">⚡ Calculado en ${time}ms</span>
        `;
    }, 10);
}

// Calcular factorial
function calculateFactorial() {
    if (!wasmReady) {
        alert('WASM no está listo aún');
        return;
    }
    
    const n = parseInt(document.getElementById('factInput').value);
    const resultDiv = document.getElementById('factResult');
    
    if (n < 1 || n > 30) {
        resultDiv.innerHTML = '<span class="value">⚠️ Ingresa un número entre 1 y 30</span>';
        return;
    }
    
    resultDiv.innerHTML = '<span class="loading-spinner"></span> Calculando...';
    
    setTimeout(() => {
        const startTime = performance.now();
        const result = goFactorial(n);
        const time = (performance.now() - startTime).toFixed(2);
        
        resultDiv.innerHTML = `
            <div class="value">${n}! = <strong>${result}</strong></div>
            <span class="time">⚡ Calculado en ${time}ms</span>
        `;
    }, 10);
}

// Calcular estadísticas
function calculateStatistics() {
    if (!wasmReady) {
        alert('WASM no está listo aún');
        return;
    }
    
    const resultDiv = document.getElementById('statsResult');
    resultDiv.innerHTML = '<span class="loading-spinner"></span> Generando 1 millón de números y calculando...';
    
    setTimeout(() => {
        // Generar 1 millón de números aleatorios
        const startGenerate = performance.now();
        const data = new Array(1000000);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 1000;
        }
        const genTime = (performance.now() - startGenerate).toFixed(2);
        
        // Calcular estadísticas en Go
        const startCalc = performance.now();
        const stats = goStatistics(data);
        const calcTime = (performance.now() - startCalc).toFixed(2);
        
        resultDiv.innerHTML = `
            <div class="value">
                <span class="count">Array de ${stats.count.toLocaleString()} números</span><br>
                <strong>Promedio:</strong> ${stats.mean.toFixed(2)}<br>
                <strong>Desviación Std:</strong> ${stats.stdDev.toFixed(2)}
            </div>
            <span class="time">
                ⚡ Generación: ${genTime}ms | Cálculo: ${calcTime}ms
            </span>
        `;
    }, 10);
}

// Permitir Enter en los inputs
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fibInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateFibonacci();
    });
    
    document.getElementById('primeInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculatePrimes();
    });
    
    document.getElementById('factInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculateFactorial();
    });
});
