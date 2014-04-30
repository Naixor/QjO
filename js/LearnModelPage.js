(function () {
    "use strict"

    var par = window.parent.document.getElementsByTagName("iframe")[0];
    var o = par.offsetWidth/1366;

    function resize (page) {
        // window.console.log("page:"+page.style.width);
        page.style.left = page.offsetLeft * o + 'px';
        page.style.top = page.offsetTop * o + 'px';
        page.style.width = page.offsetWidth * o + 'px';
        page.style.height = page.offsetHeight * o + 'px';
        // window.console.log("o:"+o);
    }

    var flagEvent = {
        init: function () {
            var G = function (ID) {
                return document.getElementById(ID);
            };
            this.leverDiv = G("leverDiv");
            this.flagDiv = G("flagDiv");

            resize(this.leverDiv);
            resize(this.flagDiv);

            this.timeOut = false;
            var t = this;

            this.leverDiv.onclick = function () {
                t.onClick();
            };
            this.leverDiv.onmouseout = function () {
                t.mouseleaveEvent();
                window.console.log("onmouseleave");
            };
        },
        onClick: function () {
            window.console.log("lever click");
            window.console.log(this.timeOut);
            this.leverDiv.className = "leverRight";
            this.flagDiv.className = "flagDown";
        },
        loseEvent: function () {
            window.console.log("loseEvent");
            this.leverDiv.className = "leverLeft";
            this.flagDiv.className = "flagUp";
            this.timeOut = false;
        },
        timeoutEvent: function () {
            setTimeout(this.loseEvent, 3000);
            window.console.log("timeoutEvent");
        },
        mouseleaveEvent: function () {
            this.timeOut = true;
            window.console.log(this.timeOut);
            window.console.log("lever mouseleave");
            this.timeoutEvent();
        }
    };

    var appbarstate = 0;//down

    var onTouchDragEvent = {
        init: function () {
            this.touch = ("createTouch" in document);//判定是否为手持设备
            this.touch = false;
            window.console.log(this.touch);
            this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
            this.MoveEvent = this.touch ? "touchmove" : "mousemove";
            this.EndEvent = this.touch ? "touchend" : "mouseup";
            this.mainDiv = document.getElementById("mainDiv");
            this.index = 0;
            this.bind();
        },
        bind: function () {
            var t = this, _x1, _x2, _y1, _y2;

            this.mainDiv["on" + t.StartEvent] = function (e) {
                
                e.preventDefault();
                var touch = t.touch ? e.touches[0] : e;
                window.console.log(touch);
                _x1 = touch.clientX;
                _y1 = touch.clientY;

                window.console.log(_x1);
            }
            this.mainDiv["on" + t.MoveEvent] = function (e) {
                e.preventDefault();
            }
            this.mainDiv["on" + t.EndEvent] = function (e) {
                e.preventDefault();
                var touch = t.touch ? e.touches[0] : e;
                _x2 = touch.clientX;
                _y2 = touch.clientY;
                

                if ((_x2 - _x1) > 300 && t.index > 0) {
                    window.console.log(t.index + "~");
                    moveMainDivRight(t.index);
                    t.index = t.index - 1;
                    
                    window.console.log(t.index);
                }
                else if ((_x2 - _x1) < -300 && t.index < 3) {
                    window.console.log(t.index + "~");
                    moveMainDivLeft(t.index);
                    t.index = t.index + 1;
                    
                    window.console.log(t.index);
                }

                if ((_y2 - _y1) < -150 && appbarstate != "1") {
                    window.console.log(this.state + "~");
                    window.parent.document.getElementById("appbar").style.display = "block";
                    $("#appbar", window.parent.document).animate({bottom: "0px"}, 500, "linear", function () {
                        appbarstate = "1";//up
                    });
                }
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

    function moveMainDivLeft(index) {
        document.getElementById("mainDiv").className = "next";
        document.getElementById("mainDiv").style.left = (-1366*index)*o + "px";
    }

    function moveMainDivRight(index) {
        document.getElementById("mainDiv").className = "prev";
        document.getElementById("mainDiv").style.left = (-1366 * index)*o + "px";
    }

    window.onload = function () {
               // document.getElementById("onclickSound").play();

                var G = function (ID) {
                    return document.getElementById(ID);
                }
                flagEvent.init();
                onTouchDragEvent.init();
                appbarDownEvent();

                resize(G("mainDiv"));

                G("personBtn").addEventListener("click", function () {
                    G("personIntroDiv").className = "showPersonIntro";
                    G("lightDiv").style.display = "block";
                    //G("lightDiv").style.opacity = 0.0;
                    var person = "Person" + (onTouchDragEvent.index+1);
                    G(person).className = "personLeft1";
                    window.parent.document.getElementById("clickSound").play();
                }, false);

                G("storyBtn").addEventListener("click", function () {
                    G("storyIntroDiv").style.display = "block";
                    G("storyIntroDiv").className = "showStory";
                    flagEvent.loseEvent();
                    setTimeout(function () {
                        G("storyIntroDiv").style.opacity = 1.0;
                        G("story");
                    }, 1000);

                    G("lightDiv").style.display = "block";
                    var person = "Person" + (onTouchDragEvent.index + 1);
                    G(person).className = "personLeft2";
                    window.parent.document.getElementById("clickSound").play();
                }, false);

                G("faceBtn").addEventListener("click", function () {
                    G("faceIntroDiv").style.display = "block";
                    G("faceIntroDiv").className = "showFace";
                    setTimeout(function () {
                        G("faceIntroDiv").style.top = 96 + "px";
                        G("info1").style.opacity = 1.0;
                        G("info2").style.opacity = 1.0;
                        
                    }, 1000);
                    setTimeout(function (){
                        G("info3").style.opacity = 1.0;
                        G("info4").style.opacity = 1.0;
                    }, 2000);
                    G("info1").style.top = 0 + "px";
                    G("info2").style.top = 0 + "px";
                    G("info3").style.top = 0 + "px";
                    G("info4").style.top = 0 + "px";

                    G("lightDiv").style.display = "block";
                    window.parent.document.getElementById("clickSound").play();
                }, false);

                G("lightDiv").addEventListener("click", function () {
                    G("personIntroDiv").className = "hidePersonIntro";
                    G("storyIntroDiv").className = "hideStory";
                    G("faceIntroDiv").className = "hideFace";
                    G("faceIntroDiv").style.top = -596 + "px";
                    setTimeout(function () {
                        G("storyIntroDiv").style.opacity = 0.0;
                        G("storyIntroDiv").style.display = "none";
                        G("faceIntroDiv").style.display = "none";
                    }, 1000);

                    G("info1").style.opacity = 0.0;
                    G("info2").style.opacity = 0.0;
                    G("info3").style.opacity = 0.0;
                    G("info4").style.opacity = 0.0;
                    G("info1").style.top = 600 + "px";
                    G("info2").style.top = 600 + "px";
                    G("info3").style.top = 600 + "px";
                    G("info4").style.top = 600 + "px";

                    G("story").pause();

                    G("lightDiv").style.display = "none";
                    var person = "Person" + (onTouchDragEvent.index + 1);
                    G(person).className = "personRight";
                    window.parent.document.getElementById("clickSound").play();
                }, false);
    }
})();