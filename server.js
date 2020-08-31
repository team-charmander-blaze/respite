'use strict';

const express = require('express');
const app = express();


app.get('/', test);


function test (req,res){
  console.log('yeeeeeeehhaaaww, server stuff');
}


app.listen(3000, () => console.log('you\'re connected'));
