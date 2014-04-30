(function (){

	var currentShow;
	var suo = false;

	var parent = window.parent.document;

	var appbarstate = 0;//down

    var TouchDragEvent = {
        state: "0",//down
        init: function () {
            this.touch = ("createTouch" in document);//判定是否为手持设备
            this.touch = false;
            this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
            this.MoveEvent = this.touch ? "touchmove" : "mousemove";
            this.EndEvent = this.touch ? "touchend" : "mouseup";
            this.mainDiv = document.getElementById("mainDiv");
            this.bind();
        },
        bind: function () {
            var t = this, _x1, _x2;

            this.mainDiv["on" + t.StartEvent] = function (e) {
                e.preventDefault();
                var touch = t.touch ? e.touches[0] : e;
                _x1 = touch.clientY;
                
                window.console.log("x1:"+_x1);
            }
            this.mainDiv["on" + t.MoveEvent] = function (e) {
                e.preventDefault();
            }
            this.mainDiv["on" + t.EndEvent] = function (e) {
                e.preventDefault();
                var touch = t.touch ? e.touches[0] : e;
                _x2 = touch.clientY;

                window.console.log("x2:"+_x2);
                if ((_x2 - _x1) < -150 && appbarstate != "1" && _x1>668) {
                    window.console.log(this.state + "~");
                    window.parent.document.getElementById("appbar").style.display = "block";
                    $("#appbar", window.parent.document).animate({bottom: "0px"}, 500, "linear", function () {
                        appbarstate = "1";//up
                    });
                }

                //e.preventDefault();
            }
        }
    };

    function appbarDownEvent () {
        document.body.addEventListener("mousedown", function () {
            if (appbarstate != 0) {
                $("#appbar", window.parent.document).animate({bottom: "-100px"}, 500, "linear", function () {
                    this.style.display = "none";
                    appbarstate = 0;
                });
            };
        });
    }

    var rightTouchDragEvent = {
        state: "0",//down
        init: function () {
            this.touch = ("createTouch" in document);//判定是否为手持设备
            this.touch = false;
            this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
            this.MoveEvent = this.touch ? "touchmove" : "mousemove";
            this.EndEvent = this.touch ? "touchend" : "mouseup";
            this.mainDiv = document.getElementById("usecaseIntro");
            this.bind();
        },
        bind: function () {
            var t = this, _x1, _x2;

            this.mainDiv["on" + t.StartEvent] = function (e) {
                e.preventDefault();
                var touch = t.touch ? e.touches[0] : e;
                _x1 = touch.clientY;
                
                window.console.log("x1:"+_x1);
            }
            this.mainDiv["on" + t.MoveEvent] = function (e) {
                e.preventDefault();
            }
            this.mainDiv["on" + t.EndEvent] = function (e) {
                e.preventDefault();
                var touch = t.touch ? e.touches[0] : e;
                _x2 = touch.clientY;

                window.console.log("x2:"+_x2);
                if ((_x2 - _x1) < -150) {
                    window.console.log(this.state + "~");
                    
                    P.events.control('prev');
                }
                else if ((_x2 - _x1) > 150) {
                    P.events.control('next');
                }

                //e.preventDefault();
            }
        }
    };

    var P = {
        init: function(){
            this._globals();
            this.position();
            this.events.init();
        },
        _globals: function(){
            S = $('.showcase'),
            H = $('.helper'),
            A = S.find('.inside').children('a');
        },
        _transform: function(css){
            var arr = [];
            for (i in css){
                var c = css[i];
                arr.push(i+'('+c+')');
            }
            var css3d = arr.join(' ');
            return {
                '-webkit-transform': css3d
            }
        },
        _loop: function(element){
            var z = A.length;
            element.each(function(i){
                var t = $(this),
                    scale = (100-i*2)/100,
                    css = {
                        left: 10*i,
                        '-webkit-transform': 'perspective(300px) rotateY(0deg) scale('+scale+')'
                    }
                if (element === A){
                    css.zIndex = z--;
                }
                t.css(css);
            });
        },
        position: function(){
            this._loop(A);
        },
        events: {
            init: function(){
                this.prev();
                this.next();
            },
            control: function(control){
                var active = A.filter('.active'), name = 'active';
                
                if (control == 'prev'){
                    var a = active.prev('a'), 
                        all = a.nextAll('a').andSelf(),
                        transform = {
                            perspective: '300px',
                            rotateY: '-20deg',
                            translateY: '0',
                            scale: '1'
                        }
                } else if (control == 'next'){
                    var a = active.next('a'),
                        all = active.nextAll('a'),
                        transform = {
                            perspective: '300px',
                            rotateY: '-20deg',
                            translateY: '600px'
                        }
                }
                
                if (a.length){
                    var css3d = P._transform(transform);
                    active.css(css3d);
                    P._loop(all);
                    A.removeClass(name);
                    a.addClass(name);
                }
                
            },
            prev: function(){
                    P.events.control('prev');
                    return false;
            },
            next: function(){
                    P.events.control('next');
                    return false;
            }
        }
    }

    function openMusic() {
    	var v = parent.getElementById("backSound").volume;
    	if (v === 0) {
    		v= 0.5;
    		document.getElementById("volume-bar").style.width = 300*v + 'px';
    	};
    }

    function openSound() {
    	parent.getElementById("clickSound").volume = 0.5;
    	parent.getElementById("onclickSound").volume = 0.5;
    	parent.getElementById("laugh").volume = 0.5;
    	parent.getElementById("angry").volume = 0.5;
    }

    function stopMusic() {
    	var v = window.parent.document.getElementById("backSound");
    	
    	v.volume = 0.0;
    	document.getElementById("volume-bar").style.width = 300*v.volume + 'px';
    	window.console.log("stopMusic:"+window.parent.document.getElementById("backSound").volume);
    }

    function stopSound() {
    	parent.getElementById("clickSound").volume = 0.0;
    	parent.getElementById("onclickSound").volume = 0.0;
    	parent.getElementById("laugh").volume = 0.0;
    	parent.getElementById("angry").volume = 0.0;
    }

    window.onload = function () {

    	var sound = window.parent.document.getElementById("backSound");

    	var music;

    	TouchDragEvent.init();
    	appbarDownEvent();

        $("#useragint").click(function () {
        	parent.getElementById("onclickSound").play();
        	if (currentShow) {
        		currentShow.animate({"margin-left": "0px","color": "#174867;"}, 100, "swing", function () {

        		});
        	};

        	$("#useragint").animate({"margin-left": "10px","background": "#ebebeb url(/images/SettingsPage/menu/border.png) no-repeat","color": "#67a5cd"}, 100, "swing", function () {

        	});
        	$("#rightDiv").html("<ul class='fadeshow'>"
				+"<li><div id='username'></div></li>"
				+"<li><div id='email'></div></li>"
                +"<li><div id='ilike'></div></li>"
			+"</ul>");
			currentShow = $("#useragint");
        });

        $("#systemsetting").click(function () {
        	parent.getElementById("onclickSound").play();
        	if (currentShow) {
        		currentShow.animate({"margin-left": "0px","color": "#174867;"}, 100, "swing", function () {

        		});
        	};

        	$("#systemsetting").animate({"margin-left": "10px","background": "#ebebeb url(/images/SettingsPage/menu/border.png) no-repeat","color": "#67a5cd"}, 100, "swing", function () {

        	});

        	window.console.log("sound:"+sound.volume);
        	
        	$("#rightDiv").html("<ul class='fadeshow'>"
				+"<li><div id='music'>"
                    +"<div id='openmusic'></div>"
                    +"<div id='closemusic'></div>"
                +"</div></li>"
				+"<li><div id='sound'>"
                    +"<div id='opensound'></div>"
                    +"<div id='closesound'></div>"
                +"</div></li>"
                +"<li><div id='volume'>"
                    +"<div id='volume-control' class='control'>"
                        +"<div id='volume-bar' class='volume-bar'>"
                            +"<div id='volume-btn' class='volume-btn'></div>"
                        +"</div>"
                    +"</div>"
                +"</div></li>"
			+"</ul>");

        	document.getElementById("volume-bar").style.width = 300*sound.volume + 'px';

        	sound.onvolumechange = function () {
        		document.getElementById("volume-bar").style.width = 300*sound.volume + 'px';
        	}

        	$("#openmusic").click(function () {
        		openMusic();
        		parent.getElementById("clickSound").play();
        		$("#openmusic").html("<div class='circle'></div>");
        		$("#closemusic").html("");
        		window.parent.document.getElementById("");
        	});
        	$("#closemusic").click(function () {
        		stopMusic();
        		parent.getElementById("clickSound").play();
        		$("#closemusic").html("<div class='circle'></div>");
        		$("#openmusic").html("");
        	});
        	$("#opensound").click(function () {
        		openSound();
        		parent.getElementById("clickSound").play();
        		$("#opensound").html("<div class='circle'></div>");
        		$("#closesound").html("");
        	});
        	$("#closesound").click(function () {
        		stopSound();
        		parent.getElementById("clickSound").play();
        		$("#closesound").html("<div class='circle'></div>");
        		$("#opensound").html("");
        	});
        	
			var btn = document.getElementById("volume-btn");

			btn.onmousedown = function (e) {
				suo = true;
			}
			document.body.onmousemove = function (e) {
				if (suo) {	
					window.console.log(e.clientX-823);
					if (((e.clientX-863) < 300 || (e.clientX-863) === 300) && ((e.clientX-863)>0 || (e.clientX-863)===0)) {
						sound.volume = (e.clientX-863)/300;
						window.console.log("volume:"+sound.volume);
						document.getElementById("volume-bar").style.width = e.clientX-863 + 'px';
					};
				};
			}
			document.body.onmouseup = function () {
				suo = false;
			}

			currentShow =  $("#systemsetting");
        });

        $("#usecase").click(function () {
            parent.getElementById("onclickSound").play();
            if (currentShow) {
                currentShow.animate({"margin-left": "0px","color": "#174867;"}, 100, "swing", function () {

                });
            };

            $("#usecase").animate({"margin-left": "10px","background": "#ebebeb url(/images/SettingsPage/menu/border.png) no-repeat","color": "#67a5cd"}, 100, "swing", function () {

            });
            $("#rightDiv").html("<div id='usecaseIntro' class='fadeshow'>"
                +"<div class='showcase'>"
                    +"<div class='inside'>"
                        +"<a class='active'><img src='/images/SettingsPage/right/1_1.png' /></a>"
                        +"<a><img src='/images/SettingsPage/right/2_1.png' /></a>"
                        +"<a><img src='/images/SettingsPage/right/3_1.png' /></a>"
                        +"<a><img src='/images/SettingsPage/right/4_1.png' /></a>"
                    +"</div>"      
                +"</div>"
            +"</div>");
            P.init();
            rightTouchDragEvent.init();

            currentShow = $("#usecase");
        });

        $("#morefunction").click(function () {
            parent.getElementById("onclickSound").play();
            if (currentShow) {
                currentShow.animate({"margin-left": "0px","color": "#174867;"}, 100, "swing", function () {

                });
            };

            $("#morefunction").animate({"margin-left": "10px","background": "#ebebeb url(/images/SettingsPage/menu/border.png) no-repeat","color": "#67a5cd"}, 100, "swing", function () {

            });
            $("#rightDiv").html("<div id='morefunctionIntro' class='fadeshow'></div>");

            currentShow = $("#morefunction");
        });

        $("#aboutus").click(function () {
            parent.getElementById("onclickSound").play();
            if (currentShow) {
                currentShow.animate({"margin-left": "0px","color": "#174867;"}, 100, "swing", function () {

                });
            };

            $("#aboutus").animate({"margin-left": "10px","background": "#ebebeb url(/images/SettingsPage/menu/border.png) no-repeat","color": "#67a5cd"}, 100, "swing", function () {

            });
            $("#rightDiv").html("<div id='aboutusIntro'>"
                +"<div id='text1' class='text'></div>"
                +"<div id='text2' class='text'></div>"       
            +"</div>");
            

            currentShow = $("#aboutus");
        });
	}
})();