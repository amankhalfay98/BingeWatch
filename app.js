const express = require('express');
const app = express();
const configRoutes = require('./routes');

const { client } = require('./config/mongoConnection');
const users = require('./data/users');
const closeConnection = require('./config/mongoConnection');


app.use(express.json());

configRoutes(app);

app.listen(3000, () => {

  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
