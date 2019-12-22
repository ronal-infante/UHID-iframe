$(document).ready(function(){

  var curr = [],
      alum = [],
      container = $('#IDStudents'),
      entries = $('.entry');

  for (var i = 0; i < entries.length; i++) {
    var eObj = {};
    eObj.content = entries.eq(i)[0].outerHTML;
    eObj.sortVal = entries.eq(i).data('grad');
    if(entries.eq(i).data('status').includes("current")){
      curr.push(eObj);
    } else{
      alum.push(eObj);
    }
  }

  curr.sort(function(a, b) {
      return a.sortVal - b.sortVal;
  });
  alum.sort(function(a, b) {
      return a.sortVal - b.sortVal;
  });

  container.empty();
  $.each(curr.concat(alum), function(i){
    container.append(this.content);
  });


  carousel();
  filters();

  function carousel() {

    var intervals = [];
    function increment(i,j){
    	if(typeof j == 'undefined'){j = 0;}
      return function(){
      	var s = $(".entry").eq(i).find(".slide-container .slide"),
        		d = $(".entry").eq(i).find(".nav-dots label");
        s.each(function(k){$(this).fadeOut( 1500 )});
        d.each(function(k){$(this).removeClass("on")});
        if (j > s.length-1) {j = 0}  
        $(s[j]).fadeIn( 1500 );
        $(d[j]).addClass("on");
        j++;
      }
    }
    function clear(i){
      return function(){
        clearInterval(intervals[i]);
      }
    }
    function startSlides(i){
      return function(){
        clear(i)();
        intervals[i] = setInterval(increment(i), 5000);
      }
    }
    function dots(i,j){
      return function(){
        clear(i)();
        increment(i,j)();
      }
    }
    
    $('.entry').each(function(i) {
      startSlides(i)();
      $(this).find(".nav-dots label").each(function(j){
        $(this).click(dots(i,j));
      });
    });
    
  }

  function filters(){

    var s = ['current','alumni'],
        f = [];

    function addRemoveFilter(e){
      if ($(e).is(':checked')) {
        if($(e).attr('name') == 'status'){s.push(e.value);}
        else{f.push(e.value);}
      } else{
        if($(e).attr('name') == 'status'){
          if( $.inArray(e.value,s) >= 0 ){
            s.splice($.inArray(e.value,s),1);
          }
        } else{
          if( $.inArray(e.value,f) >= 0 ){
            f.splice($.inArray(e.value,f),1);
          }
        }
      }
    }

    function refreshEntries(){

      $('.entry').each(function(){
        if( !$(this).hasClass('hidden') ){ $(this).addClass('hidden') };
      });

      $('.entry').each(function(j){
        var matchS = false, 
            matchF = false; 

        if(s.length == 0) { 
          matchS = true; 
        } else{
          for (var i = 0; i < $('form input[name="status"]').length; i++) {
            if( $(this).data('status') == s[i] ){ matchS = true; break; }
          }
        }
        if(f.length == 0){
          matchF = true;
        } else{
          for (var i = 0; i < $('form input[name="focus"]').length; i++) {
            if( $(this).hasClass(f[i]) ){ matchF = true; break; }
          }
        }

        if( matchS && matchF ){ $(this).removeClass('hidden'); }

      });
    }

    $('form input').click(function(){ 
      addRemoveFilter(this);      
      refreshEntries();
    });

  }
  
});