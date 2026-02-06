// importacion de librerias
const express = require('express');
const app = express();
const morgan = require('morgan'); // muestra las solicitudes de http en consola 
const cors = require('cors'); // permite conexiones externas al servidor

// Configuración de SERVIDOR PUERTO 3000

app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2); // para que las respuestas en json se vean mejor

app .use(morgan('dev')); // para ver las solicitudes en consola
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors()); // Agrega el middleware CORS

 
//Nuestro primer WS Get  // A ESTAS RUTAS SE CONOCEN COMO END
app.get('/', (req, res) => {    
    res.json(
        {
            "message": "Bienvenido a mi API REST con Node.js y Express",
            "endpoints": {
                "sumar": "/sumar",
                "restar": "/resta",
                "multiplicar": "/multiplicar",
                "dividir": "/dividir"
              }
        }
    );
})

// Endpoint para sumar dos números
app.post('/sumar', (req, res) => { // http://localhost/sumar
  const { num1, num2 } = req.body;// se declaran los datos de entrada
  console.log(req.body);

  // Validar que se hayan enviado los dos números  que no esten vacio
  if (!num1 || !num2) {
    return res.status(400).send({ error: 'Faltan números para sumar' });
  }

  // Sumar los números
  const resultado = num1 + num2;

  // Enviar el resultado

  res.send({ resultado });
});
// Endpoint para sumar dos números
app.post('/resta', (req, res) => { // http://localhost/resta
  const { num1, num2 } = req.body;// se declaran los datos de entrada
  console.log(req.body);

  // Validar que se hayan enviado los dos números  que no esten vacio
  if (!num1 || !num2) {
    return res.status(400).send({ error: 'Faltan números para restar' });
  }

  // Restar los números
  const resultado = num1 - num2;

  // Enviar el resultado

  res.send({ resultado });
});

// Endpoint para multiplicar dos números
app.post('/multiplicar', (req, res) => { // http://localhost/multiplicar
  const { num1, num2 } = req.body;// se declaran los datos de entrada
  console.log(req.body);  

  // Validar que se hayan enviado los dos números  que no esten vacio
  if (!num1 || !num2) {
    return res.status(400).send({ error: 'Faltan números para multiplicar' });
  }

  // Multiplicar los números
  const resultado = num1 * num2;

  // Enviar el resultado

  res.send({ resultado });
});

// Endpoint para dividir dos números
app.post('/dividir', (req, res) => { // http://localhost/dividir
  const { num1, num2 } = req.body;// se declaran los datos de entrada
  console.log(req.body);

  // Validar que se hayan enviado los dos números  que no esten vacio
  if (!num1 || !num2) {
    return res.status(400).send({ error: 'Faltan números para dividir' });
  }

  // Validar que el divisor no sea cero
  if (num2 === 0) {
    return res.status(400).send({ error: 'No se puede dividir por cero' });
  }

  // Dividir los números
  const resultado = num1 / num2;

  // Enviar el resultado

  res.send({ resultado });
});

// iniciando el servidor
app.listen(app.get('port'), () => {
  console.log(`Luis el servidor esta Listo ${app.get('port')}`);
});
