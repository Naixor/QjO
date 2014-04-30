(function () {

    var penColorBefore = 0;

    //function showPen(num) {
    //    for (var i = 0; i < 9; i++) {
    //        document.getElementById("pen").getElementsByTagName("div")[i].style.visibility = "hidden";
    //    }
    //}
    var pageState = 0;//0 for paint page; 1 for face page;

    var image ;//image

    var mask;//mask

    var paint = {
        init: function () {
            this.load();
        },
        load: function () {
            this.x = [];//记录鼠标移动是的X坐标
            this.y = [];//记录鼠标移动是的Y坐标
            this.clickDrag = [];
            this.lock = false;//鼠标移动前，判断鼠标是否按下
            this.isEraser = false;
            //this.Timer=null;//橡皮擦启动计时器
            //this.radius=5;
            this.storageColor = "#000000";
            this.eraserRadius = 15;//擦除半径值
            this.color = ["#000000", "#FF0000", "#80FF00", "#00FFFF", "#808080", "#FF8000", "#408080", "#8000FF", "#CCCC00"];//画笔颜色值
            this.fontWeight = 2;
            this.G = function (id) { return typeof id == "string" ? document.getElementById(id) : id; };
            this.canvas = this.G("canvas");

            if (this.canvas.getContext) {
            } else {
                //alert("您的浏览器不支持 canvas 标签");
                return;
            }
            this.cxt = this.canvas.getContext('2d');
            this.cxt.lineJoin = "round";//context.lineJoin - 指定两条线段的连接方式
            this.cxt.lineWidth = 10;//线条的宽度
            this.iptClear = this.G("clear");
            this.revocation = this.G("revocation");
            this.imgurl = this.G("imgurl");//图片路径按钮
            this.w = this.canvas.width;//取画布的宽
            this.h = this.canvas.height;//取画布的高 
            this.touch = ("createTouch" in document);//判定是否为手持设备
            this.touch = false;
            this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
            this.MoveEvent = this.touch ? "touchmove" : "mousemove";
            this.EndEvent = this.touch ? "touchend" : "mouseup";
            this.bind();
            
        },
        bind: function () {
            var t = this;
            /*清除画布*/
            this.iptClear.onclick = function () {
                t.clear();
            };
            /*鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件*/
            this.canvas['on' + t.StartEvent] = function (e) {
                e.preventDefault();
                var touch = t.touch ? e.touches[0] : e;
                var _x = touch.clientX - touch.target.offsetLeft;//鼠标在画布上的x坐标，以画布左上角为起点
                var _y = touch.clientY - touch.target.offsetTop;//鼠标在画布上的y坐标，以画布左上角为起点  
                window.console.log("canvas x:"+_x+" canvas y:"+_y);           
                if (t.isEraser) {
                    /*
                        t.cxt.globalCompositeOperation = "destination-out";
                        t.cxt.beginPath();
                        t.cxt.arc(_x, _y,t.eraserRadius, 0, Math.PI * 2);
                        t.cxt.strokeStyle = "rgba(250,250,250,0)";
                        t.cxt.fill();
                        t.cxt.globalCompositeOperation = "source-over";
                        */
                    t.resetEraser(_x, _y, touch);
                } else {
                    t.movePoint(_x, _y);//记录鼠标位置
                    t.drawPoint();//绘制路线
                }
                t.lock = true;
            };
            /*鼠标移动事件*/
            this.canvas['on' + t.MoveEvent] = function (e) {
                e.preventDefault();
                var touch = t.touch ? e.touches[0] : e;
                if (t.lock)//t.lock为true则执行
                {
                    var _x = touch.clientX - touch.target.offsetLeft;//鼠标在画布上的x坐标，以画布左上角为起点
                    var _y = touch.clientY - touch.target.offsetTop;//鼠标在画布上的y坐标，以画布左上角为起点
                    if (t.isEraser) {
                        //if(t.Timer)clearInterval(t.Timer);
                        //t.Timer=setInterval(function(){
                        t.resetEraser(_x, _y, touch);
                        //},10);
                    }
                    else {
                        t.movePoint(_x, _y, true);//记录鼠标位置
                        t.drawPoint();//绘制路线
                    }
                }
            };
            this.canvas['on' + t.EndEvent] = function (e) {
                /*重置数据*/
                 e.preventDefault();
                t.lock = false;
                t.x = [];
                t.y = [];
                t.clickDrag = [];
                clearInterval(t.Timer);
                t.Timer = null;

            };
            this.revocation.onclick = function () {
                t.redraw();
            };
            this.changeColor();
            this.imgurl.onclick = function () {
                t.getUrl();
            };
            /*橡皮擦*/
            this.G("eraser").onclick = function (e) {
                t.isEraser = true;
                t.G("pen").style.background = "url(/images/ShowModelPage/pen/pen.png) no-repeat";
                t.G("eraser").style.background = "url(/images/ShowModelPage/eraser-focus.png) no-repeat";
                window.parent.document.getElementById("clickSound").play();
            };
            /*保存图片*/
            this.imgurl.onclick = function () {

                image = this.cxt.getImageData(194, 0, 297, 399);
                
                window.parent.document.getElementById("clickSound").play();
            };
            this.G("make").onclick = function (e) {
                window.parent.document.getElementById("clickSound").play();
                if (pageState != 1) {
                    $("#drawDiv").animate({top: "-90%"}, 1000, "swing", function () {
                        pageState = 1;
                        document.getElementById("showfaceDiv").style.display = "block";
                        image = t.cxt.getImageData(194, 3, 297, 399);
                        mask = new OperaMask(document.getElementById("ddiv"), image);
                    });
                }; 
            };
        },
        faceFilter: function () {
            
        },
        movePoint: function (x, y, dragging) {
            /*将鼠标坐标添加到各自对应的数组里*/
            this.x.push(x);
            this.y.push(y);
            this.clickDrag.push(y);
        },
        drawPoint: function (x, y, radius) {
            for (var i = 0; i < this.x.length; i++)//循环数组
            {
                this.cxt.beginPath();//context.beginPath() , 准备绘制一条路径

                if (this.clickDrag[i] && i) {//当是拖动而且i!=0时，从上一个点开始画线。
                    this.cxt.moveTo(this.x[i - 1], this.y[i - 1]);//context.moveTo(x, y) , 新开一个路径，并指定路径的起点
                } else {
                    this.cxt.moveTo(this.x[i] - 1, this.y[i]);
                }
                this.cxt.lineTo(this.x[i], this.y[i]);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
                this.cxt.closePath();//context.closePath() , 如果当前路径是打开的则关闭它
                this.cxt.stroke();//context.stroke() , 绘制当前路径
            }
        },
        clear: function () {
            this.cxt.clearRect(0, 0, this.w, this.h);//清除画布，左上角为起点
            this.G("eraser").style.background = "url(/images/ShowModelPage/eraser.png) no-repeat";
            window.parent.document.getElementById("clickSound").play();
        },
        redraw: function () {
            /*撤销*/
            var t = this;
            t.cxt.restore();
            this.G("eraser").style.background = "url(/images/ShowModelPage/eraser.png) no-repeat";
            window.parent.document.getElementById("clickSound").play();

        },
        preventDefault: function (e) {
            /*阻止默认*/
            var touch = this.touch ? e.touches[0] : e;
            if (this.touch) touch.preventDefault();
            else window.event.returnValue = false;
        },
        changeColor: function () {
            /*为按钮添加事件*/
            var t = this, iptNum = this.G("color").getElementsByTagName("a"), pen = this.G("pen"), eraser = this.G("eraser");
            var facesTouch = this.G("facesTouch");
            for (var i = 0, l = iptNum.length; i < l; i++) {
                iptNum[i].index = i;
                iptNum[i].onclick = function () {
                    t.cxt.save();
                    t.cxt.strokeStyle = t.color[this.index];
                    t.storageColor = t.color[this.index];
                    t.cxt.strokeStyle = t.storageColor;
                    t.isEraser = false;

                    pen.style.background = "url(/images/ShowModelPage/pen/" + (this.index+1) + ".png) no-repeat";
                    //windows.console.log(pen.style.background);
                    //pen.getElementsByTagName("div")[penColorBefore].style.visibility = "hidden";
                    //pen.getElementsByTagName("div")[this.index + 1].style.visibility = "visible";
                    //penColorBefore = this.index;

                    eraser.style.background = "url(/images/ShowModelPage/eraser.png) no-repeat";
                    window.parent.document.getElementById("clickSound").play();
                }
            }

            var penLock = false;

            pen['on' + t.StartEvent] = function (e) {
                penLock = true;
                window.parent.document.getElementById("clickSound").play();
            };

            pen['on' + t.MoveEvent] = function (e) {
                var touch = t.touch ? e.touches[0] : e;
                var y = touch.clientY;
                if(penLock && y > 500 && y < 650) {
                    document.getElementById("pen").style.top = y - 200 + 'px';
                }
            };

            pen['on' + t.EndEvent] = function (e) {
                penLock = false;
                var w = document.getElementById("pen").offsetTop - 300;
                window.console.log(w);

                if(w < 30 && w > 0)
                   t.cxt.lineWidth = 15;
                else if(w < 60 && w > 30)
                    t.cxt.lineWidth = 11;
                else if(w < 90 && w > 60)
                    t.cxt.lineWidth = 8;
                else if(w < 120 && w > 90)
                    t.cxt.lineWidth = 5;
                else
                    t.cxt.lineWidth = 2;
                window.console.log(t.cxt.lineWidth);
            }

            var facetouchLock = false;
            var moveX;

            facesTouch["on" + t.StartEvent] = function (e) {
                var touch = t.touch ? e.touches[0] : e;
                facetouchLock = true;
                moveX = e.clientX;
            }
            facesTouch["on" + t.MoveEvent] = function (e) {
                var touch = t.touch ? e.touches[0] : e;
                var x = touch.clientX - moveX;
                var dx = x - document.getElementById("facesTouch").offsetLeft;
                if (facetouchLock) {
                    document.getElementById("facesTouch").style.left = x + dx + 'px';
                }
            }
            facesTouch["on" + t.EndEvent] = function (e) {
                facetouchLock = false;
            }
             
        },
        changeBackground: function () {
            /*添加画笔脸谱背景贴图*/
            
            var img = this.G("guanyu");
            img = new Image();
            img.src = "/images/ShowModelPage/faces/guanyu.png";

            var canvas = document.getElementById("canvas");
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 40, 100, 220, 296);
        },
        getUrl: function () {
            this.G("eraser").style.background = "url(/images/ShowModelPage/eraser.png) no-repeat";
        },
        resetEraser: function (_x, _y, touch) {

            /*使用橡皮擦-提醒*/
            var t = this;
            //this.cxt.lineWidth = 30;
            /*source-over 默认,相交部分由后绘制图形的填充(颜色,渐变,纹理)覆盖,全部浏览器通过*/
            t.cxt.globalCompositeOperation = "destination-out";
            t.cxt.beginPath();
            t.cxt.arc(_x, _y, t.eraserRadius, 0, Math.PI * 2);
            t.cxt.strokeStyle = "rgba(250,250,250,0)";
            t.cxt.fill();
            t.cxt.globalCompositeOperation = "source-over";
        }
    };

    var appbarstate = 0;//down

    var TouchDragEvent = {
        state: "0",//down
        init: function () {
            this.touch = ("createTouch" in document);//判定是否为手持设备
            this.touch = false;
            this.StartEvent = this.touch ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
            this.MoveEvent = this.touch ? "touchmove" : "mousemove";
            this.EndEvent = this.touch ? "touchend" : "mouseup";
            this.mainDiv = document.getElementById("drawDiv");
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

    window.onload = function () {
                //document.getElementById("onclickSound").play();
                var face = document.getElementById("face");
                var facesTouch = document.getElementById("facesTouch");

                TouchDragEvent.init();

                document.getElementById("drawDiv").onclick = function () {
                    appbarDownEvent();
                    if (pageState != 0) {
                        mask.delete_mask();
                        mask = null;
                        document.getElementById("showfaceDiv").style.display = "none";
                        $("#drawDiv").animate({top: "0"}, 1000, "swing", function () {
                            pageState = 0;
                        });
                    }
                }

                document.getElementById("removeFilter").addEventListener("click", function () {
                    face.style.background = "";
                    face.style.display = "none";
                }, false);
                
                var path = ["url(/images/ShowModelPage/faces/guanyu.png)", "url(/images/ShowModelPage/faces/guanyu1.png)", "url(/images/ShowModelPage/faces/guanyu2.png)", "url(/images/ShowModelPage/faces/guanyu3.png)"];
                
                var G = function (ID) {
                    return document.getElementById(ID);
                }

                document.getElementById("pen").style.background = "url(/images/ShowModelPage/pen/pen.png) no-repeat";
                paint.init();

                var isFaceFilterOn = false;

                document.getElementById("faceFilter").addEventListener("click", function () {
                    window.parent.document.getElementById("clickSound").play();
                    console.log(isFaceFilterOn);
                    if (!isFaceFilterOn) {
                        document.getElementById("faceFilter").style.background = "url(/images/ShowModelPage/faceFilter-focus.png) no-repeat";
                        document.getElementById("faces").style.display = "block";
                        document.getElementById("faces").className = "showFaces";
                        isFaceFilterOn = true;
                    }
                    else {
                        document.getElementById("faceFilter").style.background = "url(/images/ShowModelPage/faceFilter.png) no-repeat";
                        document.getElementById("faces").className = "hideFaces";
                        setTimeout(function () {
                            document.getElementById("faces").style.display = "none";
                        }, 1000);
                        
                        isFaceFilterOn = false;
                    }
                }, false);

                document.getElementById("faceBtn1").addEventListener("click", function () {
                    // face.style.background = "url(/images/ShowModelPage/faces/guanyu.png)";
                    // face.style.display = "block";
                    var img = new Image();
                    img.src = "/images/ShowModelPage/faces/guanyu.png";
                    img.onload = function () {
                        var canvas = document.getElementById("canvas");
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 194, 3, 297, 399);
                    }
                }, false);
                document.getElementById("faceBtn2").addEventListener("click", function () {
                    // face.style.background = "url(/images/ShowModelPage/faces/guanyu1.png)";
                    // face.style.display = "block";
                    var img = new Image();
                    img.src = "/images/ShowModelPage/faces/guanyu1.png";
                    img.onload = function () {
                        var canvas = document.getElementById("canvas");
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 194, 3, 297, 399);
                    }
                    
                }, false);
                document.getElementById("faceBtn3").addEventListener("click", function () {
                    // face.style.background = "url(/images/ShowModelPage/faces/guanyu2.png)";
                    // face.style.display = "block";
                    var img = new Image();
                    img.src = "/images/ShowModelPage/faces/guanyu2.png";
                    img.onload = function () {
                        var canvas = document.getElementById("canvas");
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 194, 3, 297, 399);
                    }
                }, false);
                document.getElementById("faceBtn4").addEventListener("click", function () {
                    face.style.background = "url(/images/ShowModelPage/faces/guanyu3.png)";
                    face.style.display = "block";
                }, false);

                (function () {
                    var i = 0;
                    var G = document.getElementById("paper"); 
                    var timer = null, speed = 50;
                    G.getElementsByTagName("li")[0].style.display = "block";
                    ; (function () {
                        if (i >= G.getElementsByTagName("li").length) {
                            for (var j = 0; j < G.getElementsByTagName("li").length; j++) {
                                G.getElementsByTagName("li")[j].style.display = "none";
                            }
                            i = 1;
                            G.getElementsByTagName("li")[0].style.display = "block";
                        } else {
                            for (var j = 0; j < G.getElementsByTagName("li").length; j++) {
                                //console.log(j+""+i);
                                if (j === i) {
                                    G.getElementsByTagName("li")[j].style.display = "block";
                                } else {
                                    G.getElementsByTagName("li")[j].style.display = "none";
                                }
                            }
                            i++;
                        }
                        if(i < 18)
                            timer = setTimeout(arguments.callee, speed);
                    })();

                })();


    } 
})();

