(function () {
    "use strict";

    var par = window.parent.document;
    var win = window.parent.document.getElementsByTagName("iframe")[0];

    window.onload = function () {
        
    	setTimeout(toHomePage, 2000);
    	var video = document.getElementById("video");
        video.style.width = win.style.width;
        video.style.height = win.style.height;
 	}	
    function toHomePage() {
        win.setAttribute('src', 'html/ModelPage.html');
    }
})();
