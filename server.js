'use strict';

// =================== Packages ===================== //
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');
const { query } = require('express');
require('dotenv').config();


// =================== Global Variables ===================== //
const PORT = process.env.PORT || 3003;
const app = express();
const DATABASE_URL = process.env.DATABASE_URL;
const IMAGGA_AUTH_ID = process.env.IMAGGA_AUTH_ID;
const IMAGGA_AUTH_SECRET = process.env.IMAGGA_AUTH_SECRET;


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

}


function saveInfo (req, res) {
  // get image info from POST body
  const { img, title, artist } = req.body;

  // use image to get colors from API
  const url = 'https://api.imagga.com/v2/colors';
  const query = {image_url: img};
  superagent.get(url)
    .auth(IMAGGA_AUTH_ID, IMAGGA_AUTH_SECRET)
    .query(query)
    .then(colorResponse => {
      console.log(`retrieved colors for ${title} by ${artist}`);
      // construct palette
      const colorObjs = colorResponse.body.result.colors.image_colors;
      const paletteArr = colorObjs.map( eachObj => eachObj.html_code);
      const thisPalette = new Color(paletteArr);
      const { color1, color2, color3, color4 } = thisPalette;

      // insert image info and its palette into DB
      const sql = 'INSERT INTO faves (title, artist, img, color1, color2, color3, color4) VALUES ($1, $2, $3, $4, $5, $6, $7)';
      const valueArr = [title, artist, img, color1, color2, color3, color4];
      client.query(sql, valueArr)
        .then( () => {
          // redirect to /favorites page
          console.log('added art and colors to DB');
          res.redirect('/favorites');
        })
    })
}


function renderAboutUs (req, res) {

}


// =================== Misc. Functions ===================== //
function Image(obj) {

}


function Quotes(obj) {

}


function Color(colorArr) {
  this.color1 = colorArr[0];
  this.color2 = colorArr[1];
  this.color3 = colorArr[2];
  this.color4 = colorArr[3];
}


function errorHandler(error, res) {

}


// =================== Start Server ===================== //
// wrap this in client.connect
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log('you\'re connected'));
  })
