'use strict';

$('#hexDiv').ready( () => {
  const color2 = $('#hexDiv').children().eq(1).text();
  $('body').css('background-color', color2);

  for (let i in $('.color-sample')) {
    if ($('.color-sample').eq(i).text()) {
      $('.color-sample').eq(i).css('border', `solid 3px ${$('.color-sample').eq(i).text()}`);
      $('.color-sample').eq(i).css('box-shadow', `#3037457a 2px 3px 4px 0px`);
      $('.color-sample').eq(i).css('border-radius', `5px`);
    }
  }
});

$('.color-sample').click((event) => {

  $('body').css('background-color', event.target.innerText).css('transition','background-color 2s ease');
});

