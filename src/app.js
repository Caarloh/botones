const express = require('express');
const ModbusRTU = require("modbus-serial");
const { Pool } = require('pg');
const client = new ModbusRTU();
const cors = require('cors');

const app = express();
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'plc',
  password: '!Q@W#E$R',
  port: 5432,
});

// client.connectRTUBuffered("COM3", { baudRate: 9600 });
// client.setID(1);

app.get('/read-plc', async (req, res) => {
  try {
    const data = await client.readHoldingRegisters(0, 10);
    res.json(data);
    
    // Insertar datos en la base de datos
    const text = 'INSERT INTO log(value) VALUES($1)';
    const values = [data]; // Asegúrate de formatear 'data' para que coincida con el esquema de tu base de datos
    await pool.query(text, values);
    
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.post('/write-plc', async (req, res) => {
  try {
    const { address, value } = req.body;
    await client.writeRegister(address, value);
    res.status(200).send();
    
    // Insertar datos en la base de datos
    const text = 'INSERT INTO rutina(address, value) VALUES($1, $2)';
    const values = [address, value];
    await pool.query(text, values);

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.post('/dater', async (req, res) => {
  try {
    console.log(req.body);
    const date = new Date();
    const { type } = req.body;
    console.log(type);
    const text = 'INSERT INTO datelog(type, dater) VALUES($1, $2)';
    const values = [type, date];
    const result= await pool.query(text, values)
    console.log(result);

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
    
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
