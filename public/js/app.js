'use strict';

$('#hexDiv').ready( () => {
  const color1 = $('#hexDiv').children().eq(0).text();
  const color2 = $('#hexDiv').children().eq(1).text();
  $('#hexDiv').css('background-color', color1);
  $('body').css('background-color', color2);
})