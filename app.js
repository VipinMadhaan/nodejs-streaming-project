const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();

const searchRoute = require('./routes/search.route.js');
const populateRoute = require('./routes/populate.route.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS, DELETE, GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});

app.use("/populate",populateRoute);
app.post("/search",searchRoute);


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    statusText: 'Failure',
    message: err.message,
  });
}); 

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});