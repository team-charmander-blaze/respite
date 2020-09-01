'use strict';

// =================== Packages ===================== //
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
require('dotenv').config();


// =================== Global Variables ===================== //
const PORT = process.env.PORT || 3003;
const app = express();
const DATABASE_URL = process.env.DATABASE_URL;
// TODO: Jack figure out color API keys...


// ================= Configs ====================//
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
const client = new pg.Client(DATABASE_URL);
client.on('error', (error) => console.error(error));
app.use(methodOverride('_method'));


// ===================== Routes ======================= //
app.get('/', homePage);
app.get('/gallery', renderGallery);
app.get('/favorites', renderDB);
app.get('/aboutus', renderAboutUs);
app.post('/gallery', saveInfo);


// ========================== Route Handlers ============================ //
function homePage (req, res) {
  res.render('pages/index');
}


function renderGallery (req, res) {
  client.query('SELECT * FROM faves')
    .then(sqlResult => {
      const data = sqlResult.rows;
      res.render('pages/gallery', {infoArray: data});
    })
}


function renderDB (req, res) {
  client.query('SELECT * FROM faves')
    .then(dbResult => {
      const dbData = dbResult.rows;
      res.render('pages/favorites', {
        dataArray: dbData
      });
    })
    // insert catch when written
}


function saveInfo (req, res) {
  // save the choice data to DB
  // redirect to /favorites page
}


function renderAboutUs (req, res) {

}


// =================== Misc. Functions ===================== //
function Image(obj) {

}


function Quotes(obj) {

}


function Color(obj) {

}


function errorHandler(error, res) {

}


// =================== Start Server ===================== //
// wrap this in client.connect
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log('you\'re connected'));
  })
