const express = require('express');
const app = express();
const path = require('path');
const { Client } = require('pg');
const bodyParser = require('body-parser')

// Connection String
const connect = "postgres://dbuser:secretpassword@localhost:5432/yourdb";

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Server

//Home Page
app.get('/', (req, res) => {
  const client = new Client(connect);
  client.connect();
  client.query('SELECT * FROM recipes', (err, result) => {
    if(err) {
      return console.log('error running query', err);
    }
    res.send(result.rows);
    client.end();
  });
});

//Add data
app.post('/add', (req, res) => {
   const client = new Client(connect);
   client.connect();
   const query = {
    text: 'INSERT INTO recipes(name, ingredients, directions) VALUES ($1, $2, $3)',
    values: [req.body.name, req.body.ingredients, req.body.directions],
   }
   client.query(query, (err, result) => {
    if (err) {
      console.log(err.stack)
    };
    client.end();
    res.redirect('/');
  });
});

//Delete data
app.delete('/delete/:id', (req, res) => {
  const client = new Client(connect);
   client.connect();
   const query = {
    text: 'DELETE FROM recipes WHERE id = $1',
    values: [req.params.id],
   }
   client.query(query, (err, result) => {
    if (err) {
      console.log(err.stack)
    };
    client.end();
    console.log('Row Successfully Deleted!')
    res.sendStatus(200);
  });
});

//Edit data
app.post('/edit', (req, res) => {
  const client = new Client(connect);
   client.connect();
   const query = {
    text: 'UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id = $4',
    values: [req.body.name, req.body.ingredients, req.body.directions, req.body.id],
   }
   client.query(query, (err, result) => {
    if (err) {
      console.log(err.stack)
    };
    client.end();
    res.redirect('/');
  });
})

app.listen(3000, () => {
  console.log('Server Started On Port 3000');
});