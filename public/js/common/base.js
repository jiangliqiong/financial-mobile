function resize(){
  var e=(navigator.userAgent,+document.documentElement.clientWidth/750)*100;
  window.remFontSize=e=100>e?e:100,
  document.documentElement.style.fontSize=e+"px"
}
var b=null,ua=navigator.userAgent;window.addEventListener("resize",function(){clearTimeout(b),b=setTimeout(resize,50)},!1),resize()