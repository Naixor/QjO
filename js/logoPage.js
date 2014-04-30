$(function() {
    $('img').lake({
      'waves': 4,
      'scale': 0.8,
      'speed': 0.4
    });

    setTimeout(function () {
    	window.parent.document.getElementsByTagName("iframe")[0].setAttribute('src', 'default.html');
    }, 2000);
});