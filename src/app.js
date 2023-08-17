const express = require('express'); //Libreria básica para backend en angular
const ModbusRTU = require("modbus-serial"); //Libreria que hace la conexion con el PLC a traves modbus RTU
const { Pool } = require('pg'); //Libreria que me hace conexion con base de datos postgreSQL

const client = new ModbusRTU(); //Generar un cliente que haga la conexion con el PLC
const cors = require('cors'); //Codigo necesario para que el frontend tenga acceso

const app = express(); //Iniciamos la aplicación de backend
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); //la aplicación pueda leer contenido en JSON

const pool = new Pool({ //Hacemos la conexion con la base de datos
  user: 'postgres',
  host: 'localhost',
  database: 'plc', //Es importante que los valores sean los mismos que los inscritos en la base de datos
  password: '!Q@W#E$R',
  port: 5432,
});

//Conectarnos a un PLC  a traves del puerto sub COM3 con una frecuencia de baudios de 9600
  // client.connectRTUBuffered("COM3", { baudRate: 9600 });
  // client.setID(1);
// Conectarse al servidor Modbus en la dirección IP y puerto de tu simulador

//Leer registros del PLC
app.get('/read-plc', async (req, res) => {
  try {
    const data = await client.readHoldingRegisters(0, 10).then(function(data) { //echarle un ojo
        console.log(data.data);
    }).catch(function(e) {
        console.log(e.message);
    });
    res.json(data);
    
    // Insertar datos en la base de datos
    const text = 'INSERT INTO log(value) VALUES($1)';
    const values = [data]; // Asegúrate de formatear 'data' para que coincida con el esquema de tu base de datos
    await pool.query(text, values);
    
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

//Escribe en una direccion de memoria del PLC un dato el cual arbitrariamente se le da desde el manejo de vista del usuario
app.post('/write-plc', async (req, res) => {
  try {
    const { address, value } = req.body; //Obtenemos los datos desde el manejo de vista del usuario
    //await client.writeRegister(address, value); //Le decimos al cliente que ingrese el valor 'value' en la direccion del PLC 'address'
    // ambos dados por usuario

    // Insertar datos en la base de datos para tener un registro de lo escrito en el PLC
    const text = 'INSERT INTO rutina(address, value) VALUES($1, $2)';
    const values = [address, value];
    await pool.query(text, values).then((res)=>{
      console.log(res);
    });

    res.status(200).send();  //Si todo va correcto el programa nos devolvera 200
  } catch (err) {
    res.status(500).json({ error: err.toString() }); // Si hay algun error en el programa devolverá 500
  }
});

// Esta funcion de la aplicación va a guardar los datos de encendido y apagado de la app en la base de datos
app.post('/dater', async (req, res) => {
  try {
    const date = new Date(); //Obtiene la fecha actual
    const { type } = req.body; // obtiene el tipo de dato (si es encendido o apagado)
    const text = 'INSERT INTO datelog(type, dater) VALUES($1, $2)'; //Crea la consulta para ingresarla a la base de datos con el tipo y la fecha
    const values = [type, date]; // guarda el tipo y la fecha en una variable
    const result= await pool.query(text, values) // aca manda los datos a la base de datos

    res.status(200).send(); // Si exitoso, 200
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() }); //Si erroneo, 500
    
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));
