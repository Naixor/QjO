(function () {
    "use strict"

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
                TouchDragEvent.init();
                appbarDownEvent();

                function imgPromise(picUrl) {
                    var picName = picUrl.substring(picUrl.lastIndexOf('/') + 1, picUrl.length); //从url截取图片名称
                    var picFile;
                    //1创建文件
                    //2请求数据
                    //3保存数据
                    return createFile(dirctoryImgFolder + picName).then(function (file) {
                        picFile = file;
                    }).then(function () {
                        return WinJS.xhr({ url: picUrl, responseType: "blob" });//请求网络图片
                    }).then(function complete(result) {
                        if (result.status === 200) {
                            console.log(picUrl + " 图片下载成功");
                            return writeBuffer(picFile, result.response);
                        }
                    }, function onError() {
                        console.log(picUrl + " ---图片下载失败---");
                    });
                }
                //创建文件
                function createFile(fileName) {
                    return localFolder.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.replaceExisting);
                }
                //将图片的blob数据保存到文件
                function writeBuffer(file, blob) {
                    return file.openAsync(Windows.Storage.FileAccessMode.readWrite).then(function (output) {
                        // Get the IInputStream stream from the blob object
                        var input = blob.msDetachStream();
                        // Copy the stream from the blob to the File stream
                        return Windows.Storage.Streams.RandomAccessStream.copyAsync(input, output).then(function () {
                            output.flushAsync().done(function () {
                                input.close();
                                output.close();
                                console.log("File '" + file.name + "' saved successfully '");
                            }, function () { console.log("保存失败"); });
                        }, function () { console.log("保存失败"); });
                    }, function () { console.log("保存失败"); });
                }

                ///imgPromise("192.168.1.117:8081/images/1.jpeg");

                // add event handler
                var addEvent = (function () {
                    if (document.addEventListener) {
                        return function (el, type, fn) {
                            if (el && el.nodeName || el === window) {
                                el.addEventListener(type, fn, false);
                            } else if (el && el.length) {
                                for (var i = 0; i < el.length; i++) {
                                    addEvent(el[i], type, fn);
                                }
                            }
                        };
                    } else {
                        return function (el, type, fn) {
                            if (el && el.nodeName || el === window) {
                                el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
                            } else if (el && el.length) {
                                for (var i = 0; i < el.length; i++) {
                                    addEvent(el[i], type, fn);
                                }
                            }
                        };
                    }
                })();

                // inner variables
                var dragItems;
                updateDataTransfer();
                var dropAreas = document.querySelectorAll('[droppable=true]');

                // preventDefault (stops the browser from redirecting off to the text)
                function cancel(e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    return false;
                }

                // update event handlers
                function updateDataTransfer() {
                    dragItems = document.querySelectorAll('[draggable=true]');
                    for (var i = 0; i < dragItems.length; i++) {
                        addEvent(dragItems[i], 'dragstart', function (event) {
                            event.dataTransfer.setData('obj_id', this.id);
                            return false;
                        });
                    }
                }

                // dragover event handler
                addEvent(dropAreas, 'dragover', function (event) {
                    if (event.preventDefault) event.preventDefault();

                    // little customization
                    this.style.borderColor = "#000";
                    return false;
                });

                // dragleave event handler
                addEvent(dropAreas, 'dragleave', function (event) {
                    if (event.preventDefault) event.preventDefault();

                    // little customization
                    this.style.borderColor = "#ccc";
                    return false;
                });

                // dragenter event handler
                addEvent(dropAreas, 'dragenter', cancel);

                // drop event handler
                addEvent(dropAreas, 'drop', function (event) {
                    if (event.preventDefault) event.preventDefault();

                    // get dropped object
                    var iObj = event.dataTransfer.getData('obj_id');
                    var oldObj = document.getElementById(iObj);

                    // get its image src
                    var oldSrc = oldObj.childNodes[0].src;
                    oldObj.className += 'hidden';

                    var oldThis = this;

                    setTimeout(function () {
                        oldObj.parentNode.removeChild(oldObj); // remove object from DOM

                        // add similar object in another place
                        oldThis.innerHTML += '<a id="' + iObj + '" draggable="true"><img src="' + oldSrc + '" /></a>';

                        // and update event handlers
                        updateDataTransfer();

                        // little customization
                        oldThis.style.borderColor = "#ccc";
                    }, 500);

                    return false;
                });
    }
})();