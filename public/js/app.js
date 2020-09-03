'use strict';

$('#hexDiv').ready( () => {
  const color2 = $('#hexDiv').children().eq(1).text();
  $('body').css('background-color', color2);

  for (let i in $('.color-sample')) {
    if ($('.color-sample').eq(i).text()) {
      $('.color-sample').eq(i).css('border', `solid 3px ${$('.color-sample').eq(i).text()}`)
    }
  }
})

$('.color-sample').click((event) => {
  console.log(event.target.innerText)
  $('body').css('background-color', event.target.innerText);
})