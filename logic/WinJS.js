	"use strict"

	function logoPage () {
		return "logoPage.html";
	} 

	function loadPage () {
		return "default.html";
	} 
	function mainPage () {
		return "html/HomePage.html";
	} 

	var currentPage = window.location.href;

	/*define normal variable*/
	var CURRENTZINDEX = 50;
	var DEFAULTZINDEX = 0;
	var CURRENTDISPLAY = "block";
	var DEFAULTDISPLAY = "none";

	/*system variable*/
	var currentPage = "";

	/*system public function*/
	function addListener ( e, str, func ) {
		if( e.addEventListener ) {
			e.addEventListener( str, func, false );
		}else if( e.attachEvent ) {
			e.attachEvent( "on" + str, func );
		}else {
			
		}
	};
 
	var MainFrame = function () {
		return window.parent.document.getElementsByTagName("iframe")[0];
	}

	function putIframe (parent, iframe) {
		parent.appendChild(iframe);
	}

	/*my winjs class*/
	var myWinJS = function () {

	}
	myWinJS.prototype  = {
		_body: {},
		_window: {},
		_width: 1366,
		_height: 768,
		_LogoPage: "",
		_LoadPage: "",
		_MainPage: "",
		_PageFrame: {},
		LogoPage: function (logoPage) {
			this._LogoPage = logoPage;
		},
		LoadPage: function (loadPage) {
			this._LoadPage = loadPage;
		},
		MainPage: function (mainPage) {
			this._MainPage = mainPage;
		},
		initializeProperties: function (initflash) {
			this._body = document.body;
			this._window = window;

			var frame = document.getElementById("frame");
			this.resizePage(frame);

			this._PageFrame = document.createElement("iframe");
			this._PageFrame.setAttribute('src', this._LogoPage);
			this._PageFrame.setAttribute('class', initflash);
			this._PageFrame.setAttribute('frameborder', 'no');
		 	this._PageFrame.setAttribute('border', '0');
		 	this._PageFrame.setAttribute('marginwidth', '0');
		 	this._PageFrame.setAttribute('marginheight', '0');
    		this._PageFrame.setAttribute('scrolling', 'no');
    		this._PageFrame.setAttribute('allowtransparency', 'yes');

			putIframe(frame, this._PageFrame);
		},
		start: function (initflash) {
			this.initializeProperties(initflash);
		},
		onload: function () {
			this._PageFrame.setAttribute('src', this._LoadPage);
		},
		checkNAgent: function () {

		},
		resizePage: function (iframe) {
			this.checkScreen(this._window);
			iframe.style.width = this._width + 'px';
			iframe.style.height = this._height + 'px';
		},
		resizeIframe: function (iframe) {
			this.checkScreen(this._window);
			iframe.style.width = this._width + 'px';
			iframe.style.height = this._height + 'px';
			
			
		},
		checkScreen: function (w) {
			var screenW = w.screen.width;
			var screenH = w.screen.height;
			var h = screenW* 768/1366
			if (h < screenH) {
				this._width = screenW;
				this._height = h;
				console.log("h:" + h);
			}
		},
		definePage: function (url) {
			var page = document.createElement("iframe");
			page.setAttribute('id', url)
		}
	};

	function include_js(file) {
 
    	var _doc = document.getElementsByTagName('head')[0];
     	var js = document.createElement('script');
 
      	js.setAttribute('type', 'text/javascript');
      	js.setAttribute('src', file);
      	_doc.appendChild(js);
 
      	if (document.all) { //如果是IE
            js.onreadystatechange = function () {
                if (js.readyState == 'loaded' || js.readyState == 'complete') {
 
                     
                }
           	}
      	}
 
      	else {
            js.onload = function () {
                
            }
       	}
	}