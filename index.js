/**
 * Created by jiahao on 2015/12/17.
 */
var pictureSource;		//图片来源
var destinationType;		//设置返回值的格式

// 等待PhoneGap连接设备
document.addEventListener("deviceready",onDeviceReady,false);

// PhoneGap准备就绪，可以使用！
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// 当成功获得一张照片的Base64编码数据后被调用
//function onPhotoDataSuccess(imageData) {
//
//    // 取消注释以查看Base64编码的图像数据
//    // console.log(imageData);
//    // 获取图像句柄
//    var smallImage = document.getElementById('smallImage');
//
//    // 取消隐藏的图像元素
//    smallImage.style.display = 'block';
//
//    // 显示拍摄的照片
//    // 使用内嵌CSS规则来缩放图片
//    smallImage.src = "data:image/jpeg;base64," + imageData;
//}

// 当成功得到一张照片的URI后被调用

//// “Capture Photo”按钮点击事件触发函数
//function capturePhoto() {
//
//    // 使用设备上的摄像头拍照，并获得Base64编码字符串格式的图像
//    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
//}
//
//// “Capture Editable Photo”按钮点击事件触发函数
//function capturePhotoEdit() {
//
//    // 使用设备上的摄像头拍照，并获得Base64编码字符串格式的可编辑图像
//    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true });
//}

//“From Photo Library”/“From Photo Album”按钮点击事件触发函数
function getPhoto(source) {

    // 从设定的来源处获取图像文件URI
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,sourceType: source });
}

// 当有错误发生时触发此函数
function onFail(mesage) {
    alert('Failed because: ' + message);
}

// 当成功得到一张照片的URI后被调用
function onPhotoURISuccess(imageURI) {
    var cameraPic =document.getElementById("cameraPic"),
        cameraImg=document.getElementById('cameraImg'),
        picChoice=document.getElementById('pic-choice-4');
    cameraPic.style.display="block";
    cameraImg.src=imageURI;
    picChoice.checked="checked";
    picChoice.value=imageURI;
}


window.onload = function () {
    var tileSize,//格子的大小
        numTiles,//格子的数量
        tilesArray,//格子对象的数组
        emptyGx,//空格子的x位置
        emptyGy,//空格子的Y位置
        frame_width,//pic-frame的宽度
        timeSelect = document.getElementById('time'),//选取id=time 的select节点
        time = timeSelect.children,//设置时间
        selectArray = ["easy", "normal", "hard"],
        showTimeOut = $('.showTimeOut'),//获取时间到了显示的节点
        goContent = $('#goContent'),
        showT = $('#showTime'),//获取showTime的节点
        timer = null,//设置时间计时器,
        back,
        beginTime = new Date(),
        imgUrl,
        img,
        bf_width,
        bf_height,
        proportion,
        leftOrTopTo;


        function setUp() {
        var x, y;
        timer = null;//时间计时器清空
        setWH();//设置pic-frame以及well-done-image的长宽使其自适应屏幕大小
        imgUrl = $("input[name='pic-choice']:checked").val();
        checkWH();
            if(bf_width>=bf_height){
                $("#pic-guide").css( setBackground(0,0,0,0,bf_width * proportion,frame_width,-leftOrTopTo * proportion,0));

            }else{
                $("#pic-guide").css( setBackground(0,0,0,0,frame_width,bf_height*proportion,0,leftOrTopTo*proportion));

            }
        //设置完成任务之后显示的图片
        $("#well-done-image").attr("src", imgUrl);
        //移除上一次的格子
        $(".tile").remove();
        //tilesArray=null;//删除闭包，释放空间
        //创建新的格子
        numTiles = $("#difficulty").val();
        tileSize = frame_width / numTiles;
        emptyGx = emptyGy = numTiles - 1;
        tilesArray = [];
        for (y = 0; y < numTiles; y++) {
            tilesArray[y] = [];
            for (x = 0; x < numTiles; x++) {
                if (y == numTiles - 1 && x == numTiles - 1) {
                    break;
                }
                var tile = tileObj(x, y);
                tilesArray[y][x] = tile;
                $("#pic-frame").append(tile.$element);
            }
        }
        //打乱新建的格子
        for (var i = 0; i < 100; i++) {
            shuffle();
        }
        if (checkSolved()) {
            $.mobile.changePage("#well-done", "pop");
        }
    }
    //设置提示背景的pic-guide的函数
    function setBackground(left1,top1,width1,height1,size1,size2,pos1,pos2){
           return {
               left: left1 + "px",
               top: top1 + "px",
               width: width1 + "px",
               height: height1 + "px",
               "background-image": "url(" + imgUrl + ")",
               "background-size": size1 + "px " + size2 + "px",
               "background-position": pos1 + "px " + pos2 + "px"
           }
    }
    function checkWH(){
        img=new Image();
        img.src=imgUrl;
        bf_width=img.width;
        bf_height=img.height;
        proportion=frame_width/bf_height;//目标图与原图的比例
        leftOrTopTo=(bf_width-bf_height)/2;
    }
    //显示时间
    function showTime() {
        var timeVal = $('#time').val();
        i = 0;
        showT.css('color', 'darkslateblue');
        //alert(timeVal);
        clearInterval(timer);
        if (timeVal == "noTime") {
            timer = setInterval(function () {
                showT.text(i++);
            }, 1000);
        } else {
            timer = setInterval(function () {
                showT.text(timeVal--);
                if (timeVal < 10) {
                    showT.css('color', 'red');
                    if (timeVal == -1) {
                        clearInterval(timer);
                        goContent.addClass('opacity');
                        //showTimeOut.style.display='';
                        showTimeOut.css("display", "block");
                    }
                }
            }, 1000);
        }
    }


    //打乱格子，animate time =0
    function shuffle() {
        var test;
        if (Math.floor(Math.random() * 2)) {
            test = randIndex(emptyGx);
            moveTiles(tilesArray[emptyGy][test], false);
        }
        else {
            test = randIndex(emptyGy);
            moveTiles(tilesArray[test][emptyGx], false);
        }
    }

    function randIndex(value) {
        while (1) {
            var randIndex = Math.floor(Math.random() * numTiles);
            if (randIndex !== value) {
                return randIndex;
            }
        }
    }

    //判断格子移动的方向，以及是否可以移动
    function moveTiles(tile, times) {
        var clickPos, x, y, dir, t;
        if (tile.gy == emptyGy) {
            clickPos = tile.gx;
            dir = tile.gx < emptyGx ? 1 : -1;
            for (x = emptyGx - dir; x !== clickPos - dir; x -= dir) {
                t = tilesArray[tile.gy][x];
                t.move(x + dir, tile.gy, times);
            }
            emptyGx = clickPos;
        }
        else if (tile.gx == emptyGx) {
            clickPos = tile.gy;
            dir = tile.gy < emptyGy ? 1 : -1;
            for (y = emptyGy - dir; y !== clickPos - dir; y -= dir) {
                t = tilesArray[y][tile.gx];
                t.move(tile.gx, y + dir, times);
            }
            emptyGy = clickPos;
        }
        tilesArray[emptyGy][emptyGx] = 0;//把空各自的x,y 对应的tilesArray[y][x],设置为0，
    }

    //设置pic-frame和well-done-image的长宽，适应浏览器，使长是浏览器的80%，宽等于长，
    function setWH() {
        frame_width = document.body.offsetWidth * 0.9;
        $("#pic-frame").css({"width": frame_width + "px", "height": frame_width + "px"});
        $("#well-done-image").css({"width": frame_width + "px", "height": frame_width + "px"});
    }

    //tileObj对象运用闭包，创建所有格子，把他保存在tilesArray[][]中；每一个格子中拥有这个格子自身的所有操作，包括
    //移动，保存初始位置，检测是否在正确的位置上
    function tileObj(gx, gy) {
        var solverGx = gx,
            solverGy = gy,
            left = tileSize * gx,
            top = tileSize * gy,
            $tile = $("<div class='tile'></div>"),

            that = {
                $element: $tile,
                gx: gx,
                gy: gy,
                move: function (ngx, ngy, animate) {//animate表示时间
                    that.gx = ngx;
                    that.gy = ngy;
                    tilesArray[ngy][ngx] = that;
                    if (animate) {
                        $tile.animate({
                            left: ngx * tileSize,
                            top: ngy * tileSize
                        }, 250);
                    } else {
                        $tile.css({
                            left: ngx * tileSize,
                            top: ngy * tileSize
                        });
                    }
                },
                checkSolved: function () {
                    if (that.gx !== solverGx || that.gy !== solverGy) {
                        return false;
                    }
                    return true;
                }
            };
        //设置格子的css 属性
        if(bf_width>=bf_height){
            $tile.css(setBackground(left,top,tileSize-2,tileSize-2,bf_width * proportion,frame_width,-left-leftOrTopTo * proportion,-top));
            }else{
            $tile.css(setBackground(left,top,tileSize-2,tileSize-2,frame_width,bf_height*proportion,-left,-top+leftOrTopTo*proportion));
            }
        $tile.data('tileObj', that);
        return that;
    }

//tileObj结束

    function setOpt(val) {
        for (var i = 0; i < 3; i++) {
            time[i + 1].value = val[i];
            time[i + 1].innerHTML = selectArray[i] + " (" + val[i] + "s)";
        }
    }

    //绑定事件
    function bindEvents() {
        //绑定事件，选择时间select框中不同难度的时间随着用户选择的格子数不同变化
        $("#time").bind('click', function () {
            var val = $("#difficulty").val();
            switch (val) {
                case '3':
                    setOpt([60, 30, 10]);
                    break;
                case '4':
                    setOpt([200, 60, 30]);
                    break;
                case '5':
                    setOpt([500, 200, 60]);
                    break;
            }
        });
        //绑定pic-frame的触摸点击事件，tab,tab是jQuery mobile 的点击事件,bind()可以为元素绑定多个事件
        $('#pic-frame').bind('tap', function (evt) {
            var $targ = $(evt.target);//找到事件源
            if (!$targ.hasClass('tile'))return;
            var Obj = $targ.data('tileObj');
            moveTiles($targ.data('tileObj'), true);
            if (checkSolved()) {
                $.mobile.changePage("#well-done", "pop");
            }
        });
        $('.goMain').bind("click", function () {
            clearInterval(timer);
            showTimeOut.css('display', 'none');
            goContent.removeClass('opacity');
            showT.css('color', 'darkslateblue');
        });
        $('#reStart').bind('click', function () {
            showTimeOut.css('display', 'none');
            goContent.removeClass('opacity');
            showT.css('color', 'darkslateblue');
            clearInterval(timer);
            showTime();
            shuffle();
        });
        $('#play-button').bind('click', function () {
            setUp();
            showTime();
            document.getElementById("lookPic").name = "1";
        });
        $("#backAndroid").bind("click", function () {
            backTime();
        });
        //监听查看原图按钮
        $("#lookPic").bind('click', function () {
            var time2 = null;
            if (this.name == '1') {
                this.name = '0';
                $('#pic-guide').fadeTo(1000, 1);
            }
            else {
                this.name = '1';
                $('#pic-guide').fadeTo(1000, 0.2);
            }
            for (var i = 0; i < numTiles; i++) {
                for (var j = 0; j < numTiles; j++) {
                    if (tilesArray[i][j])
                        tilesArray[i][j].$element.fadeToggle(((i) * numTiles + j) * 30 * (6 - numTiles));
                }
            }
        });

    }


    function backTime() {
        var getNowTime = new Date();
        var fullSec = (getNowTime.getTime() - beginTime.getTime()) / 1000;
        var hour = Math.floor(fullSec / 3600);
        var minute = Math.floor((fullSec % 3600) / 60);
        var second = Math.floor((fullSec % 3600) % 60);
        var allTime = hour + ":" + minute + ":" + second;
        window.js.method(allTime);
        //alert(minute+":"+second);
    }

    //判断拼图是否完成
    function checkSolved() {
        var gy, gx;
        for (gy = 0; gy < numTiles; gy++) {
            for (gx = 0; gx < numTiles; gx++) {
                if (!(gy == emptyGy && gx == emptyGx ) && !tilesArray[gy][gx].checkSolved()) {//当格子不是空格子，并且不是在原来的位置，就return false
                    return false;
                }
            }
        }
        return true;
    }

    bindEvents();
    setUp();
};