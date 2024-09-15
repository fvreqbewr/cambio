// Escuchamos el evento "submit" del formulario cuando el usuario hace clic en "Convertir"
document.getElementById('currency-form').addEventListener('submit', function(e) {
    // Evitamos que el formulario se envíe de manera tradicional (recargando la página)
    e.preventDefault();
    
    // Obtenemos las monedas seleccionadas y la cantidad ingresada por el usuario
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = document.getElementById('amount').value;

    // Validamos que el campo de cantidad no esté vacío o tenga un valor menor o igual a cero
    if (amount === "" || amount <= 0) {
        displayError("Por favor, ingrese una cantidad válida.");
        return;
    }

    // Realizamos una petición a la API para obtener el tipo de cambio basado en la moneda seleccionada
    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => {
            // Si no obtenemos una respuesta válida, lanzamos un error
            if (!response.ok) throw new Error("Error al conectar con la API.");
            return response.json(); // Convertimos la respuesta en un objeto JSON
        })
        .then(data => {
            // Obtenemos el tipo de cambio de la moneda de destino
            const rate = data.rates[toCurrency];
            // Si la moneda de destino no está soportada, lanzamos un error
            if (!rate) throw new Error("Moneda no soportada.");
            
            // Calculamos el resultado de la conversión
            const result = (amount * rate).toFixed(2); // Redondeamos a 2 decimales
            // Mostramos el resultado en la página
            document.getElementById('result').innerHTML = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
        })
        .catch(error => {
            // En caso de que ocurra un error (como problemas de conexión o monedas no soportadas), mostramos un mensaje de error
            displayError(error.message);
        });
});

// Función para mostrar los mensajes de error
function displayError(message) {
    // Insertamos el mensaje de error en el div correspondiente
    document.getElementById('error-message').innerHTML = message;
    // Limpiamos el mensaje de error después de 3 segundos
    setTimeout(() => document.getElementById('error-message').innerHTML = "", 3000);
}

