const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.set('json spaces', 2);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(cors({
  origin(origin, callback) {
    // Requests without Origin (e.g. curl) are not browser CORS requests.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  }
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a mi API REST con Node.js y Express',
    endpoints: {
      sumar: '/sumar',
      restar: '/resta',
      multiplicar: '/multiplicar',
      dividir: '/dividir'
    }
  });
});

function operands(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Se requiere un objeto JSON con num1 y num2' });
  }
  const { num1, num2 } = body;
  // Do not coerce null, booleans, whitespace, arrays or objects to numbers.
  const valid = value => typeof value === 'number' && Number.isFinite(value);
  if (!valid(num1) || !valid(num2)) {
    return res.status(400).json({ error: 'num1 y num2 deben ser números finitos' });
  }
  req.operands = { num1, num2 };
  next();
}

function respond(res, resultado) {
  if (!Number.isFinite(resultado)) {
    return res.status(422).json({ error: 'Resultado fuera del rango numérico permitido' });
  }
  return res.json({ resultado });
}

app.post('/sumar', operands, (req, res) => {
  const { num1, num2 } = req.operands;
  return respond(res, num1 + num2);
});
app.post('/resta', operands, (req, res) => {
  const { num1, num2 } = req.operands;
  return respond(res, num1 - num2);
});
app.post('/multiplicar', operands, (req, res) => {
  const { num1, num2 } = req.operands;
  return respond(res, num1 * num2);
});
app.post('/dividir', operands, (req, res) => {
  const { num1, num2 } = req.operands;
  if (num2 === 0) return res.status(400).json({ error: 'No se puede dividir por cero' });
  return respond(res, num1 / num2);
});

if (require.main === module) {
  app.listen(port, () => console.log(`Servidor listo en el puerto ${port}`));
}
module.exports = app;
