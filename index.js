//Importamos las librarías requeridas
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();

//Documentación en https://expressjs.com/en/starter/hello-world.html
const app = express()

//Creamos un parser de tipo application/json
//Documentación en https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json()


// Abre la base de datos de SQLite
let db = new sqlite3.Database('./base.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos SQLite.');

    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT NOT NULL,
        created_at INTEGER
    )`, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Tabla tareas creada o ya existente.');
        }
    });
});

//Creamos un endpoint POST que guarda los datos en SQLite
app.post('/agrega_todo', jsonParser, function (req, res) {
    const { todo } = req.body;

    if (!todo) {
        return res.status(400).json({ error: 'Falta información necesaria' });
    }

    const createdAt = Math.floor(Date.now() / 1000); // Unix timestamp en segundos

    const stmt = db.prepare('INSERT INTO todos (todo, created_at) VALUES (?, ?)');

    stmt.run(todo, createdAt, function (err) {
        if (err) {
            console.error("Error al insertar:", err.message);
            return res.status(500).json({ error: 'Error al insertar en la base de datos' });
        }

        console.log("Insert exitoso:", todo);
        return res.status(201).json({
            message: 'Todo agregado exitosamente',
            todo: {
                id: this.lastID,
                todo: todo,
                created_at: createdAt
            }
        });
    });

    stmt.finalize();
});



app.get('/', function (req, res) {
    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'status': 'ok2' }));
})


//Creamos un endpoint de login que recibe los datos como json
app.post('/login', jsonParser, function (req, res) {
    //Imprimimos el contenido del body
    console.log(req.body);

    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'status': 'ok' }));
})

//Corremos el servidor en el puerto 3000
const port = 3000;

app.listen(port, () => {
    console.log(`Aplicación corriendo en http://localhost:${port}`)
})


