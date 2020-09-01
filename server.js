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

  // --- query to get objectIds -- //
  const apiQuery = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=Impressionist`;

  // -- first superagent call to get ID array -- //
  superagent.get(apiQuery)

    .then(result => {
      const idArray = result.body.objectIDs;

      let arrRandom = [];

      for (let i=0; i<19; i++){
        const randomIndex = idArray[Math.floor(Math.random()*idArray.length)];
        arrRandom.push(randomIndex);
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
          res.render('pages/gallery', {artArray: vals});
        });
    });
}


function renderDB (req, res) {

}


function saveInfo (req, res) {
  // save the choice data to DB
  // redirect to /favorites page
}


function renderAboutUs (req, res) {

}


// =================== Misc. Functions ===================== //
function Image(artObj) {
  const art = artObj.body;

  this.title = art.title;
  this.artist = art.artistDisplayName;
  this.img = art.primaryImage;
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
  });
