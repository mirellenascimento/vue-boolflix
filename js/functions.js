function scrollRight(el){
  var div = document.getElementById(el);
  div.scrollLeft += 10000;
  div.scrollLeft -= 100;
};

function scrollLeft(el){
  var div = document.getElementById(el);
  div.scrollLeft -= 10000;
  div.scrollLeft += 100;
};
