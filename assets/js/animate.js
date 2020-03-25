var h_hght = 0; // высота шапки
var h_mrg = 0;    // отступ когда шапка уже не видна
                 
$(function(){
    
    var elem = $('#scr');
    var top = $(this).scrollTop();
     
    if(top > h_hght){
        elem.css('top', h_mrg);
        
    }           
     
    $(window).scroll(function(){
        top = $(this).scrollTop();
        if (top+h_mrg < h_hght) {
            
            elem.css('top', (h_hght-top));
        } else {
            elem.css('top', h_mrg);
        }

    });
 
});



$(function(){
    $('.popup_img').click(function(event) {
      var i_path = $(this).attr('src');
      $('body').append('<div id="overlay"></div><div id="magnify"><img src="'+i_path+'"><div id="close-popup"><i></i></div></div>');
      $('#magnify').css({
          left: ($(document).width() - $('#magnify').outerWidth())/2,
          // top: ($(document).height() - $('#magnify').outerHeight())/2 upd: 24.10.2016
              top: ($(window).height() - $('#magnify').outerHeight())/2
        });
      $('#overlay, #magnify').fadeIn('fast');
    });
    
    $('body').on('click', '#close-popup, #overlay', function(event) {
      event.preventDefault();
   
      $('#overlay, #magnify').fadeOut('fast', function() {
        $('#close-popup, #magnify, #overlay').remove();
      });
    });
  });


$('.auth__form input').on('input', function(){
    var $this = $(this);
    if ($this.val() == '') {
        $this.removeClass('cool-input__input_filled');
    } else {
        $this.addClass('cool-input__input_filled');
    }
});
