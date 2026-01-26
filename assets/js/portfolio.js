$(function(){

  /* ========================
     Smooth Scroll for All Concepts
  ======================= */
  $('a[href^="#"]').on('click', function(e){
    var targetId = $(this).attr('href');

    // Skip empty or just "#" links
    if(targetId === "#" || targetId === "") return;

    var $target = $(targetId);
    if($target.length){
      e.preventDefault();

      // Determine offset dynamically (header may be different per concept)
      var headerOffset = 0;
      if($('body.concept-1, body.concept-2, body.concept-3').length){
        // Adjust for fixed headers if needed
        headerOffset = 60; 
      }

      $('html, body').animate({
        scrollTop: $target.offset().top - headerOffset
      }, 700);
    }
  });

  /* ========================
     Attribution Modal Event
  ======================= */
  $('#attributionModal').on('show.bs.modal', function(){
    console.log('Attribution modal opened');
  });

  /* ========================
     Optional: Expand all accordion modules
  ======================= */
  $('#expandModules').on('click', function(){
    $('.accordion-collapse').collapse('show');
  });

});
