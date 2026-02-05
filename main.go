//go:build js && wasm

package main

import (
	"fmt"
	"syscall/js"
)

// Calcular Fibonacci (iterativo - rápido y eficiente)
func fibonacci(this js.Value, args []js.Value) interface{} {
	n := args[0].Int()

	if n <= 1 {
		return n
	}

	a, b := 0, 1
	for i := 2; i <= n; i++ {
		a, b = b, a+b
	}

	return b
}

// Encontrar números primos hasta N
func findPrimes(this js.Value, args []js.Value) interface{} {
	n := args[0].Int()
	primes := []any{}

	for i := 2; i <= n; i++ {
		if isPrime(i) {
			primes = append(primes, i)
		}
	}

	// Convertir a JS array
	jsArray := js.Global().Get("Array").New(len(primes))
	for i, p := range primes {
		jsArray.SetIndex(i, p)
	}

	return jsArray
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

// Calcular factorial
func factorial(this js.Value, args []js.Value) interface{} {
	n := args[0].Int()
	result := fact(n)
	return fmt.Sprintf("%d", result)
}

func fact(n int) int64 {
	if n <= 1 {
		return 1
	}
	return int64(n) * fact(n-1)
}

// Sumar array grande
func sumArray(this js.Value, args []js.Value) interface{} {
	jsArray := args[0]
	length := jsArray.Get("length").Int()

	sum := int64(0)
	for i := 0; i < length; i++ {
		sum += int64(jsArray.Index(i).Int())
	}

	return sum
}

// Calcular promedio y desviación estándar
func statistics(this js.Value, args []js.Value) interface{} {
	jsArray := args[0]
	length := jsArray.Get("length").Int()

	// Calcular promedio
	sum := 0.0
	for i := 0; i < length; i++ {
		sum += jsArray.Index(i).Float()
	}
	mean := sum / float64(length)

	// Calcular desviación estándar
	variance := 0.0
	for i := 0; i < length; i++ {
		diff := jsArray.Index(i).Float() - mean
		variance += diff * diff
	}
	stdDev := variance / float64(length)

	// Retornar objeto con resultados
	result := js.Global().Get("Object").New()
	result.Set("mean", mean)
	result.Set("stdDev", stdDev)
	result.Set("count", length)

	return result
}

func main() {
	c := make(chan struct{})

	// Registrar funciones Go en JavaScript
	js.Global().Set("goFibonacci", js.FuncOf(fibonacci))
	js.Global().Set("goFindPrimes", js.FuncOf(findPrimes))
	js.Global().Set("goFactorial", js.FuncOf(factorial))
	js.Global().Set("goSumArray", js.FuncOf(sumArray))
	js.Global().Set("goStatistics", js.FuncOf(statistics))

	println("✅ Go WASM Ready!")

	<-c
}
