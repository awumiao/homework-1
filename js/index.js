window.onload = function() {

    //生成所需的li
    (function() {
        var len = 5 * 5 * 5, //确定生成的li总数
            oUl = document.getElementById('list').children[0], //获取li的父级
            aLi = oUl.children; //获取所有li  动态的获取

        //初始化
        (function() {
            //循环创建len个li
            for (var i = 0; i < len; i++) {
                //创建li
                var oLi = document.createElement('li');
                //给每个LI添加相关属性值
                oLi.index = i;
                oLi.x = i % 5;
                oLi.y = Math.floor(i % 25 / 5);
                oLi.z = 4 - Math.floor(i / 25);

                //获取li内容数据
                var data = flyData[i] || flyData[0];

                //添加li的内容
                oLi.innerHTML = "<b class='liCover'></b>" +
                    "<p class='liTitle'>" + data.type + "</p>" +
                    "<p class='liAuthor'>" + data.author + "</p>" +
                    "<p class='liTime'>" + data.time + "</p>";

                //定义li在3D空间的随机位置
                var tX = Math.random() * 6000 - 3000,
                    tY = Math.random() * 6000 - 3000,
                    tZ = Math.random() * 6000 - 3000;

                //设置li位置初始值
                oLi.style.transform = "translate3D(" + tX + "px," + tY + "px," + tZ + "px)";

                oUl.appendChild(oLi)
            }
            setTimeout(Grid, 20)
        })();

        //弹窗
        (function() {
            //获取元素
            var oAlert = document.getElementById('alert'),
                aTitle = oAlert.getElementsByClassName('title')[0].getElementsByTagName('span')[0],
                oImg = oAlert.getElementsByClassName('img')[0].getElementsByTagName('img')[0],
                oAuthor = oAlert.getElementsByClassName('author')[0].getElementsByTagName('span')[0],
                oInfo = oAlert.getElementsByClassName('info')[0].getElementsByTagName('span')[0];

            //获取点击弹出层需要的元素   
            var oAll = document.getElementById('all'),
                oIframe = document.getElementById('iframe'),
                oBack = document.getElementById('back');

            //通过事件委托给每个li添加点击事件
            oUl.onclick = function(e) {
                //获取点击事件的事件源
                var target = e.target;
                if (target.nodeName == 'B') {
                    //判断alert的display状态来确定是现实还是隐藏
                    if (oAlert.style.display == 'block') {
                        //确定oAlert是显示状态,需要隐藏
                        hid();
                    } else {
                        //确定oAlert是隐藏状态,需要显示
                        //1.获取被点击的li的index索引值
                        var index = target.parentNode.index;
                        //2.通过index获取对应的数据内容
                        var data = flyData[index] || flyData[0];

                        oAlert.index = index;
                        //3.修改弹窗内容
                        aTitle.innerHTML = '课题: ' + data.title;
                        oImg.src = 'src/' + data.src + '/index.png';
                        oAuthor.innerHTML = '主讲老师:' + data.author;
                        oInfo.innerHTML = '描述:' + data.dec;
                        show();
                    }


                }
                //取消事件冒泡
                // return false
                e.cancelBubble = true;
            }

            //点击除了oAlert以外的地方都消失
            document.onclick = function() {
                hid();
            };

            //弹窗跳转
            oAlert.onclick = function() {
                //获取数据
                var data = flyData[this.index] || flyData[0]
                oIframe.src = 'src/' + data.src + '/index.html';
                oAll.className = 'left';
                return false;
            };

            //点击back返回;
            oBack.onclick = function() {
                oAll.className = '';
                return false;
            }

            //点击弹出显示
            function show() {
                if (!oAlert.timer) {
                    oAlert.timer = true;
                    oAlert.style.display = 'block';

                    //设置弹出的初始位置
                    oAlert.style.transform = 'rotateY(0deg) scale(2)';
                    oAlert.style.opacity = '0';


                    //定义运动的参数
                    var time = 400,
                        sTime = new Date();

                    //运动函数  让oAlert从放大2倍的位置移动到正常大小
                    function m() {
                        var prop = (new Date() - sTime) / time;
                        if (prop >= 1) {
                            prop = 1;
                            oAlert.timer = false;
                        } else {
                            requestAnimationFrame(m);
                        }
                        oAlert.style.transform = 'rotateY(0deg) scale(' + (2 - prop) + ')';
                        oAlert.style.opacity = prop;
                    }
                    requestAnimationFrame(m);
                }
            };

            //弹窗隐藏
            function hid() {
                if (oAlert.style.display == 'block' && !oAlert.timer) {
                    oAlert.timer = true;

                    //初始化弹出隐藏的样式
                    oAlert.style.display = 'block';
                    oAlert.style.transform = 'rotateY(0deg) scale(1)';
                    oAlert.style.opacity = '1';
                }

                //定义运动的参数
                var time = 400,
                    sTime = new Date();

                //运动函数  让oAlert从1倍的位置到消失
                function m() {
                    var prop = (new Date() - sTime) / time;
                    if (prop >= 1) {
                        prop = 1;
                        oAlert.timer = false;
                        oAlert.style.display = 'none';
                    } else {
                        requestAnimationFrame(m);
                    }
                    oAlert.style.transform = 'rotateY(' + prop * 180 + 'deg) scale(' + (1 - prop) + ')';
                    oAlert.style.opacity = 1 - prop;
                }
                requestAnimationFrame(m);
            }
        })();

        //拖拽及滚轮事件
        (function() {
            var roX = 0,
                roY = 0,
                trZ = -2000;
            //清除文字被选中
            document.onselectstart = function() {
                return false;
            };
            //鼠标按下事件
            document.onmousedown = function(e) {
                    var e = e || window.event;

                    //定义参数变量
                    var sX = e.clientX, //鼠标点击时的X坐标
                        sY = e.clientY, //鼠标点击时的y坐标
                        lastX = sX, //鼠标移动后最后一次x值
                        lastY = sY, //鼠标移动后最后一次y值
                        x_ = 0, //最后鼠标抬起时最后2点的x差值
                        y_ = 0, //最后鼠标抬起时最后2点的y差值
                        moveTime = 0; //用来解决最后一次move的时间



                    //鼠标移动
                    this.onmousemove = function(e) {
                        var e = e || window.event;

                        //计算鼠标移动的距离
                        x_ = e.clientX - lastX;
                        y_ = e.clientY - lastY;

                        //通过鼠标移动的距离来计算旋转的度数
                        roX -= y_ * 0.15;
                        roY += x_ * 0.15;

                        //旋转ul
                        oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)";

                        //重新赋值
                        lastX = e.clientX;
                        lastY = e.clientY;

                        moveTime = new Date()

                    }

                    //鼠标抬起
                    this.onmouseup = function() {

                        //清除鼠标移动时间
                        this.onmousemove = null;

                        //计算缓冲
                        function m() {
                            //通过系数慢慢减少移动距离
                            x_ *= 0.9;
                            y_ *= 0.9;

                            //通过距离来计算旋转度数
                            roX -= y_ * 0.15;
                            roY += x_ * 0.15;
                            //旋转ul
                            oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)";

                            if (Math.abs(x_) < 0.1 && Math.abs(y_) < 0.1) return;
                            requestAnimationFrame(m);

                        }

                        if (new Date() - moveTime < 100) {
                            requestAnimationFrame(m)
                        }

                    }
                }
                //滚轮事件 改变Z轴移动
                ! function(fn) {
                    //滚轮兼容
                    if (document.onmousewheel === undefined) {
                        //这里是火狐浏览器执行
                        document.addEventListener('DOMMouseScroll', function(e) {
                            var d = -e.detail / 3;
                            fn(d);
                        }, false)
                    } else {
                        document.onmousewheel = function(e) {
                            var d = e.wheelDelta / 120;
                            fn(d);
                        }
                    }
                }(function(d) {
                    trZ += d * 100;
                    oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)";
                })
        })();

        //球形排列
        function Sphere() {
            if (Sphere.arr) {
                for (var i = 0; i < len; i++) {
                    aLi[i].style.transform = Sphere.arr[i];
                }
            } else {
                Sphere.arr = []
                    //定义arr确定球面一共有多少层,以及每层有多少li
                var arr = [1, 3, 7, 11, 13, 17, 21, 17, 13, 11, 7, 3, 1],
                    arrLen = arr.length,
                    xDeg = 180 / (arrLen - 1);

                for (var i = 0; i < len; i++) {
                    //定义遍历来保存此时的li是球面上的第几层,以及当层的第几个
                    var numC = 0, //记录第几层
                        numG = 0; //记录当前层第几个
                    var arrSum = 0; //记录当前层多少个li

                    //判断此时 i是第几层第几个
                    for (var j = 0; j < arrLen; j++) {
                        arrSum += arr[j];
                        if (arrSum > i) {
                            numC = j;
                            numG = arr[j] - (arrSum - i); //当前层总数-剩余数量
                            break;
                        }
                        // console.log(numC, numG)
                    }
                    //y轴旋转度数
                    var yDeg = 360 / arr[numC];
                    var val = "rotateY(" + (numG + 2.2) * yDeg + "deg) rotateX(" + (90 - numC * xDeg) + "deg) translateZ(800px)";
                    Sphere.arr[i] = val;
                    aLi[i].style.transform = val;
                }

            }

        };

        //正方形排列
        function Grid() {
            if (Grid.arr) {
                for (var i = 0; i < len; i++) {
                    aLi[i].style.transform = Grid.arr[i];
                }
            } else {
                Grid.arr = [];
                var disX = 350, //每个li水平(x)方向的间距
                    disY = 350, //每个li垂直(y)方向的间距
                    disZ = 500; //每个li纵深(z)方向的间距

                //for循环每个li,计算每个li的x,y,z的值
                for (var i = 0; i < len; i++) {
                    var oLi = aLi[i],
                        x = (oLi.x - 2) * disX,
                        y = (oLi.y - 2) * disY,
                        z = (oLi.z - 2) * disZ;

                    var val = "translate3D(" + x + "px," + y + "px," + z + "px)";
                    Grid.arr[i] = val;
                    oLi.style.transform = val;
                }

            }
        };

        //元素周期表排列
        function Table() {
            if (Table.arr) {
                for (var i = 0; i < len; i++) {
                    aLi[i].style.transform = Table.arr[i]
                }
            } else {
                Table.arr = [];
                var n = Math.ceil(len / 18) + 2; //计算li要排列多少行
                var midY = n / 2 - 0.5,
                    midX = 18 / 2 - 0.5;

                //定义每个li之间的间距
                var disX = 170,
                    disY = 210;

                var arr = [
                    { x: 0, y: 0 },
                    { x: 17, y: 0 },
                    { x: 0, y: 1 },
                    { x: 1, y: 1 },
                    { x: 12, y: 1 },
                    { x: 13, y: 1 },
                    { x: 14, y: 1 },
                    { x: 15, y: 1 },
                    { x: 16, y: 1 },
                    { x: 17, y: 1 },
                    { x: 0, y: 2 },
                    { x: 1, y: 2 },
                    { x: 12, y: 2 },
                    { x: 13, y: 2 },
                    { x: 14, y: 2 },
                    { x: 15, y: 2 },
                    { x: 16, y: 2 },
                    { x: 17, y: 2 }
                ];

                //循环计算li的位置
                for (var i = 0; i < len; i++) {
                    var x, y;
                    if (i < 18) {
                        x = arr[i].x;
                        y = arr[i].y;
                    } else {
                        x = i % 18;
                        y = Math.floor(i / 18) + 2;
                    }

                    //设置li的位置
                    var val = 'translate3D(' + (x - midX) * disX + 'px,' + (y - midY) * disY + 'px,0px)';
                    Table.arr[i] = val;
                    aLi[i].style.transform = val;

                }
            }

        };

        //螺旋式排列
        function Helix() {
            if (Helix.arr) {
                for (var i = 0; i < len; i++) {
                    aLi[i].style.transform = Helix.arr[i];
                }
            } else {
                Helix.arr = [];
                var h = 3.7, //定义环数
                    tY = 10, //每个li错位y值
                    num = Math.round(len / h), //每环多少个li
                    deg = 360 / num, //li y轴旋转度数
                    mid = len / 2 - 0.5; //以此为中心
                for (var i = 0; i < len; i++) {
                    // var val = "rotateY(" + i * deg + "deg) translateY(0px) translateX(800px)";
                    var val = "rotateY(" + i * deg + "deg) translateY(" + (i - mid) * tY + "px) translateZ(800px)";
                    Helix.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }
        }


        //右下角点击事件
        (function() {
            //获取所有的按钮
            var aBtn = document.getElementById('btn').getElementsByTagName('li');
            aBtn[0].onclick = Table;
            aBtn[1].onclick = Sphere;
            aBtn[2].onclick = Helix;
            aBtn[3].onclick = Grid;
        })();
    })();
}