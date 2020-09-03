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

  const apiQuery = `http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en`;

  superagent.get(apiQuery)
    .then(result => {
      const quote = new Quotes(result);
      res.render('pages/index', {data: quote});
    });
}


function renderGallery (req, res) {

  // --- query to get objectIds -- //
  const apiQuery = `https://collectionapi.metmuseum.org/public/collection/v1/search?medium=Paintings&q=Impressionism`;

  // -- first superagent call to get ID array -- //
  superagent.get(apiQuery)

    .then(result => {
      const idArray = result.body.objectIDs;

      let arrRandom = [];

      while (arrRandom.length < 20){
        const randomIndex = idArray[Math.floor(Math.random()*idArray.length) + 1];
        if(arrRandom.indexOf(randomIndex) === -1 ) arrRandom.push(randomIndex);
      }

      let promiseArr = [];

      arrRandom.forEach(value => {

        const objectId = value;
        const apiQueryObject = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;

        promiseArr.push(superagent.get(apiQueryObject));
      });

      Promise.all(promiseArr).then(values => {

        return values.map(val => {
          const constructedObj = new Image (val);
          return constructedObj;
        });

      })
        .then(vals => {
          res.render('pages/gallery', {dataArray: vals});
        });
    })
    .catch(error => errorHandler(error, res));
}


function renderDB (req, res) {
  client.query('SELECT * FROM faves')
    .then(dbResult => {
      const dbData = dbResult.rows;

      // sorts array to display most recent save at the top
      dbData.sort((a,b) => b.id - a.id);

      res.render('pages/favorites', {
        dataArray: dbData
      });

    })
    .catch(error => errorHandler(error, res));
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
          console.log('added art and colors to DB');
          res.redirect('/favorites');
        })
    })
    .catch(error => errorHandler(error, res));
}


function renderAboutUs (req, res) {
  res.render('pages/about')
}


// =================== Misc. Functions ===================== //
function Image(artObj) {
  const art = artObj.body;

  this.title = art.title;
  this.artist = art.artistDisplayName;
  this.img = art.primaryImage;
}


function Quotes(obj) {
  const quote = obj.body;

  this.text = quote.quoteText;
  this.author = quote.quoteAuthor;
}


function Color(colorArr) {
  this.color1 = colorArr[0];
  this.color2 = colorArr[1];
  this.color3 = colorArr[2];
  this.color4 = colorArr[3];
}


function errorHandler(error, res) {
  console.log(error);
  res.status(500).render('pages/error', {
    status: 500,
    message: error.message
  })
}


// =================== Start Server ===================== //
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log('you\'re connected'));
  });
