(function () {
	"use strict"
	var logoPage = "logoPage.html",
	loadPage = "default.html",
	mainPage = "html/HomePage.html";

	var currentPage = window.location.href;

	function load () {
		var winClass = new myWinJS();
		winClass.LogoPage("logoPage.html");
		winClass.LoadPage("default.html")
		winClass.MainPage("html/HomePage");
		winClass.start("showFlash");

		setTimeout(function () {
			var msc = window.parent.document.getElementById("backSound");
			msc.volume = 0.5;
            msc.play();  
        }, 2500);
		
		document.getElementById("home").onmouseover = function () {
			this.getElementsByTagName("img")[0].setAttribute('src', '/images/QjO/home_cover.png');
		};

		document.getElementById("home").onmouseout = function () {
			this.getElementsByTagName("img")[0].setAttribute('src', '/images/QjO/home.png');
		};

		document.getElementById("home").onmousedown = function () {
			this.getElementsByTagName("img")[0].setAttribute('src', '/images/QjO/home_click.png');
		};

		document.getElementById("home").onclick = function (){
			document.getElementById("clickSound").play();
			document.getElementById("appbar").style.bottom = "-100px";
			document.getElementById("appbar").style.display = "none";
			document.getElementsByTagName("iframe")[0].setAttribute('src', '/html/ModelPage.html');
		};
	}
	addListener(window, 'load', load);
	
})();