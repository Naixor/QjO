(function () {
    
    function addEvent(elementId) {
        window.console.log("add");
        var t = elementId.getElementsByTagName("div")[0];
        t.onclick = function () {
            t.className = "click";
            window.console.log("click");
        };
    }

    var par = window.parent.document.getElementsByTagName("iframe")[0];
    var o = par.offsetWidth/1366;

    var randomFlowerPath;

    function resize (page) {
        // window.console.log("page:"+page.style.width);
        // page.style.left = page.offsetLeft * o + 'px';
        // page.style.top = page.offsetTop * o + 'px';
        // page.style.width = page.offsetWidth * o + 'px';
        // page.style.height = page.offsetHeight * o + 'px';
        // window.console.log("o:"+o);
    }

    function init() {
        document.getElementById("mainDiv").style.display = "block";
        document.getElementById("backIMG").style.display = "block";
        document.getElementById("flower").style.display = "block";

        function randomInkFL() {

        }

        randomFlowerPath = function (flowerName) {
            var randomFlowerPath1 = function () {
                var flashTime = [5, 6, 5, 8, 7, 8, 7, 6, 8, 7, 7, 6];
                var flashName = ["flowerFL1", "flowerFL2", "flowerFL3", "flowerFL4", "flowerFL5", "flowerFL6", "flowerFL7", "flowerFL8", "flowerFL9", "flowerFL10", "flowerF11", "flowerFL12"];
                var index = Math.ceil(Math.random() * 11);
                var timer = null;
                flowerName.className = flashName[index];
                timer = setTimeout(randomFlowerPath2, flashTime[index] * 1000);
            }

            var randomFlowerPath2 = function () {
                var flashTime = [5, 6, 5, 8, 7, 8, 7, 6, 8, 7, 7, 6];
                var flashName = ["flowerFL1", "flowerFL2", "flowerFL3", "flowerFL4", "flowerFL5", "flowerFL6", "flowerFL7", "flowerFL8", "flowerFL9", "flowerFL10", "flowerF11", "flowerFL12"];
                var index = Math.ceil(Math.random() * 11);
                var timer = null;
                flowerName.className = flashName[index];
                timer = setTimeout(randomFlowerPath1, flashTime[index] * 1000);
            }
            randomFlowerPath1();
        }
    }

    function release() {
        document.getElementById("mainDiv").style.display = "none";
        document.getElementById("backIMG").style.display = "none";
        document.getElementById("flower").style.display = "none";

        inkFL = null;
        inkFL1 = null;
        inkFL2 = null;
        inkFL3 = null;

        randomFlowerPath = null;
    }

    var appbarstate = 0;//down

    var TouchDragEvent = {
        state: "0",//down
        init: function () {
            this.touch = ("createTouch" in document);//判定是否为手持设备
            this.touch = false;
            this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
            this.MoveEvent = this.touch ? "touchmove" : "mousemove";
            this.EndEvent = this.touch ? "touchend" : "mouseup";
            this.mainDiv = document.body;
            this.bind();
        },
        bind: function () {
            var t = this, _x1, _x2;

            this.mainDiv["on" + t.StartEvent] = function (e) {
                var touch = t.touch ? e.touches[0] : e;
                _x1 = touch.clientY;
                
                window.console.log("x1:"+_x1);
            }
            this.mainDiv["on" + t.MoveEvent] = function (e) {
                
            }
            this.mainDiv["on" + t.EndEvent] = function (e) {
                var touch = t.touch ? e.touches[0] : e;
                _x2 = touch.clientY;

                window.console.log("x2:"+_x2);
                if ((_x2 - _x1) < -150 && appbarstate != "1") {
                    window.console.log(this.state + "~");
                    window.parent.document.getElementById("appbar").style.display = "block";
                    $("#appbar", window.parent.document).animate({bottom: "0px"}, 500, "linear", function () {
                        appbarstate = "1";//up
                    });
                }

                //e.preventDefault();
            }
        }
    }
    
    window.onload = function () {
                //document.getElementById("onclickSound").play();

                TouchDragEvent.init();

                // document.getElementById("backgroundIMG").src = "/images/ModelPage/background.jpg";
                init();

                var flowerName = document.getElementById("flower").getElementsByTagName("div");
                for (var i = 0; i < flowerName.length; i++) {
                    resize(flowerName[i]);
                    randomFlowerPath(flowerName[i]);
                }

                var LearnModel = document.getElementById("LearnModel");
                var ShowModel = document.getElementById("ShowModel");
                var ShareModel = document.getElementById("ShareModel");
                var NotComplete = document.getElementById("NotComplete");

                var learnmodelBtn = document.getElementById("learnmodelBtn");
                var showmodelBtn = document.getElementById("showmodelBtn");
                var sharemodelBtn = document.getElementById("sharemodelBtn");
                var notcompleteBtn = document.getElementById("notcompleteBtn");

                resize(LearnModel);
                resize(ShowModel);
                resize(ShareModel);
                resize(NotComplete);
                resize(learnmodelBtn);
                resize(showmodelBtn);
                resize(sharemodelBtn);
                resize(notcompleteBtn);

                LearnModel.getElementsByTagName("div")[0].addEventListener("click", function () {
                    LearnModel.getElementsByTagName("div")[0].className = "clickUp";
                    setTimeout(function () {
                        LearnModel.getElementsByTagName("div")[0].className = "moveStart";
                    }, 1500);
                    window.console.log("clickUp");
                }, false);
                ShowModel.getElementsByTagName("div")[0].addEventListener("click", function () {
                    ShowModel.getElementsByTagName("div")[0].className = "clickDown";
                    setTimeout(function () {
                        ShowModel.getElementsByTagName("div")[0].className = "moveStart";
                    }, 1500);
                    window.console.log("clickDown");
                }, false);
                ShareModel.getElementsByTagName("div")[0].addEventListener("click", function () {
                    ShareModel.getElementsByTagName("div")[0].className = "clickUp";
                    setTimeout(function () {
                        ShareModel.getElementsByTagName("div")[0].className = "moveStart";
                    }, 1500);
                    window.console.log("clickUp");
                }, false);
                NotComplete.getElementsByTagName("div")[0].addEventListener("click", function () {
                    NotComplete.getElementsByTagName("div")[0].className = "clickDown";
                    setTimeout(function () {
                        NotComplete.getElementsByTagName("div")[0].className = "moveStart";
                    }, 1500);
                    window.console.log("clickDown");
                }, false);

                learnmodelBtn.onmouseover = function () {
                    this.style.background = "url('/images/ModelPage/learnBtn-focus.png') no-repeat";
                }
                learnmodelBtn.onmouseout = function () {
                    this.style.background = "url('/images/ModelPage/learnBtn.png') no-repeat";
                }
                showmodelBtn.onmouseover = function () {
                    this.style.background = "url('/images/ModelPage/showBtn-focus.png') no-repeat";
                }
                showmodelBtn.onmouseout = function () {
                    this.style.background = "url('/images/ModelPage/showBtn.png') no-repeat";
                   
                }
                sharemodelBtn.onmouseover = function () {
                    this.style.background = "url('/images/ModelPage/shareBtn-focus.png') no-repeat";
              
                }
                sharemodelBtn.onmouseout = function () {
                    this.style.background = "url('/images/ModelPage/shareBtn.png') no-repeat";
       
                }
                notcompleteBtn.onmouseover = function () {
                    this.style.background = "url('/images/ModelPage/comingBtn-focus.png') no-repeat";
             
                }
                notcompleteBtn.onmouseout = function () {
                    this.style.background = "url('/images/ModelPage/comingBtn.png') no-repeat";

                }

                learnmodelBtn.addEventListener("click", function () {
                    window.parent.document.getElementById("clickSound").play();
                    par.setAttribute('src', '/html/LearnModelPage.html');
                }, false);
                showmodelBtn.addEventListener("click", function () {
                    window.parent.document.getElementById("clickSound").play();
                    par.setAttribute('src', '/html/ShowModelPage.html');
                }, false);
                sharemodelBtn.addEventListener("click", function () {
                    window.parent.document.getElementById("clickSound").play();
                    par.setAttribute('src', '/html/ShareModelPage.html');
                }, false);
                notcompleteBtn.addEventListener("click", function () {
                    window.parent.document.getElementById("clickSound").play();
                    par.setAttribute('src', '/html/SettingsPage.html')
                }, false);

                var inkFL = function (G) {
                    var i = 0;

                    var timer=null,speed=70;
                    G.getElementsByTagName("li")[0].style.display = "block";
                        ;(function(){
                            if (i >= G.getElementsByTagName("li").length) {
                                for (var j = 0; j < G.getElementsByTagName("li").length; j++) {
                                     G.getElementsByTagName("li")[j].style.display = "none";
                            }
                            i=1;
                            G.getElementsByTagName("li")[0].style.display = "block";
                        } else {
                            for (var j = 0; j < G.getElementsByTagName("li").length; j++) {
                                //console.log(j+""+i);
                                if(j===i){
                                G.getElementsByTagName("li")[j].style.display = "block";
                                } else {
                                    G.getElementsByTagName("li")[j].style.display = "none";
                                }
                            }
                            i++;
                            }
                            if (i < 38) {
                                timer = setTimeout(arguments.callee, speed);
                            }
                            else {
                                G.parentNode.removeChild(G);
                            }
                     })();
                };

                var randomInkFL = function (x, y) {
                    var i = 0;

                    var timer = null, speed = 70;

                    var g = document.getElementsByTagName("section")[0];
                    var G = document.createElement("div");
                    G.innerHTML = '<ul class="flashDiv"></ul>'
                    var gUl = G.getElementsByTagName("ul")[0];

                    resize(G);
            
                    G.style.position = "absolute";
                    G.style.left = x - 115 + 'px';
                    G.style.top = y - 85 + 'px';

                    gUl.innerHTML = '<li><img src="/images/ModelPage/inkdrop/1.png" /></li>'
                     + '<li><img src="/images/ModelPage/inkdrop/2.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/3.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/4.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/5.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/6.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/7.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/8.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/9.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/10.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/11.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/12.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/13.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/14.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/15.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/16.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/17.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/18.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/19.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/20.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/21.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/22.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/23.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/24.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/25.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/26.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/27.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/28.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/29.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/30.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/31.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/32.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/33.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/34.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/35.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/36.png" /></li>'
                     +'<li><img src="/images/ModelPage/inkdrop/37.png" /></li>'
                     + '<li><img src="/images/ModelPage/inkdrop/38.png" /></li>';
                    
                    g.appendChild(G);

                    gUl.getElementsByTagName("li")[0].style.display = "block";
                    ; (function () {
                        if (i >= gUl.getElementsByTagName("li").length) {
                            for (var j = 0; j < gUl.getElementsByTagName("li").length; j++) {
                                gUl.getElementsByTagName("li")[j].style.display = "none";
                            }
                            i = 1;
                            gUl.getElementsByTagName("li")[0].style.display = "block";
                        } else {
                            for (var j = 0; j < gUl.getElementsByTagName("li").length; j++) {
                                
                                if (j === i) {
                                    gUl.getElementsByTagName("li")[j].style.display = "block";
                                } else {
                                    gUl.getElementsByTagName("li")[j].style.display = "none";
                                }
                            }
                            i++;
                        } 
                        if (i < 38) {
                            timer = setTimeout(arguments.callee, speed);
                        }
                        else {
                            G.parentNode.removeChild(G);
                        }
                    })();             
                };
               
                var G = document.getElementById("flashIMG");
                var G1 = document.getElementById("flashIMG1");
                var G2 = document.getElementById("flashIMG2");
                var G3 = document.getElementById("flashIMG3");

                resize(G);
                resize(G1);
                resize(G2);
                resize(G3);

                inkFL(G);
                setTimeout(function () {inkFL(G1);}, 600);
                setTimeout(function () {inkFL(G2);}, 1200);
                setTimeout(function () {inkFL(G3);}, 1800);

                var evX = 0, evY = 0;
                document.body.addEventListener("click", function (ev) {
                    window.console.log(ev.x + " " + ev.y);
                    
                   
                        randomInkFL(ev.x, ev.y);
                    evX = ev.x;
                    evY = ev.y;
                }, false);
                document.body.addEventListener("mousedown", function () {
                    if (appbarstate != 0) {
                        $("#appbar", window.parent.document).animate({bottom: "-100px"}, 500, "linear", function () {
                            this.style.display = "none";
                            appbarstate = 0;
                        });
                    };
                });
    }
})();