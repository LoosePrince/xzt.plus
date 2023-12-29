        //获取画布对象
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        //背景及同心圆相关参数,
        var canvaseSide = 200,//canvaseSide: 画布大小，从width、height获得
            arcMaxR = 90, //背景中最大同心圆的半径
            arcNum = 5,    //同心圆的个数
            arcOffset = arcMaxR/arcNum, //同心圆的半径差
            arcXPoint = canvaseSide/2,  //圆心x坐标
            arcYPoint = canvaseSide/2;  //圆心y坐标
        //六边形相关参数,
        var sideL = arcMaxR, //六边形边长（与最大同心圆半径同长，你们可以自己算下）
            yOffset = (Math.sqrt(3) * sideL) / 2, //y坐标的偏移量 cos 30° * 边长 
            xOffset = sideL / 2,  //x坐标的偏移量 sin 30° * 边长
            startY = canvaseSide/2, //定义point1 也就是起始点的坐标X
            startX = startY - arcMaxR;//定义point1 也就是起始点的坐标Y
        //定义六边形的6个点，点位置如下图所示
        var pointArray = [
            {"id":1, "x": startX, "y": startY },
            {"id":2, "x": startX + xOffset, "y": startY + yOffset }, 
            {"id":3, "x": startX + xOffset + sideL, "y": startY + yOffset },
            {"id":4, "x": startX + 2 * xOffset + sideL, "y": startY },
            {"id":5, "x": startX + xOffset + sideL, "y": startY - yOffset }, 
            {"id":6, "x": startX + xOffset, "y": startY - yOffset }
        ];
        //留个维度的得分
        var socreArray = [
            {"id":1,"score":10},
            {"id":2,"score":30},
            {"id":3,"score":50},
            {"id":4,"score":70},
            {"id":5,"score":90},
            {"id":6,"score":100},
        ];

        //计算分数以及每次更新的x坐标长度
        var maxIndex , minIndex;
        var drawScoreFrames = 24;
        var drawCount = 0;
        
        /*
        * 绘制背景图片
        */
        function drawBG(){
            //清空画布
            ctx.clearRect(0,0,c.width,c.height);
            ctx.beginPath();
            //绘制同心圆极其背景
            for (var i = arcNum; i >= 0; i--) {
                ctx.strokeStyle = "#E5EBEE";
                ctx.arc(arcXPoint, arcYPoint, i * arcOffset, 0, 2 * Math.PI);
                if (i == arcNum) {
                    ctx.fillStyle = "#F5FAFC";
                    ctx.fill();
                }
            }
            //绘制连线，画出1-4,2-5,3-6 六边形顶点的连线
            for(var i=0;i<3;i++){
                var startPoint = pointArray[i],
                    endPoint = pointArray[i+3];
                ctx.strokeStyle = "#E5EBEE";
                ctx.moveTo(startPoint.x,startPoint.y);
                ctx.lineTo(endPoint.x,endPoint.y);
                ctx.stroke();
            }

            //绘制六边形六个角的实心圆点
            for(var i=0;i<pointArray.length;i++){
                var point = pointArray[i];
                ctx.strokeStyle = "#2F8BF2";
                ctx.fillStyle = "#2F8BF2";
                ctx.beginPath();
                ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
        }

        //计算分数以及每次更新的x坐标长度，主要思路，已固定的圆心坐标为参考系，定义到1,2,3,4,5,6点的线段上展示分数时每次的变化偏移量
        //这个变化变异量与 维度得分、哪条线段、总共渲染帧数有关
        for(var i=0;i<socreArray.length;i++){
            var scoreD = socreArray[i],
                scoreId = scoreD.id,
                scoreVal = scoreD.score;
            if(scoreId == 1){
                scoreD.xoffset = - (scoreVal* arcMaxR)/(100 * drawScoreFrames);
                scoreD.yoffset = 0;
            }
            if(scoreId == 2){
                scoreD.xoffset = - (scoreVal* arcMaxR)/(200 * drawScoreFrames);
                scoreD.yoffset = - (Math.sqrt(3)* scoreVal * arcMaxR)/(200 * drawScoreFrames);
            }
            if(scoreId == 3){
                scoreD.xoffset =  (scoreVal* arcMaxR)/(200 * drawScoreFrames);
                scoreD.yoffset = - (Math.sqrt(3)* scoreVal * arcMaxR)/(200 * drawScoreFrames);
                if(scoreVal > socreArray[1].score){
                    maxIndex = 2;
                }else{
                    maxIndex = 1;
                }
            }
            if(scoreId == 4){
                scoreD.xoffset =  (scoreVal* arcMaxR)/(100 * drawScoreFrames);
                scoreD.yoffset = 0;
            }
            if(scoreId == 5){
                scoreD.xoffset =  (scoreVal* arcMaxR)/(200 * drawScoreFrames);
                scoreD.yoffset =  (Math.sqrt(3)* scoreVal * arcMaxR)/(200 * drawScoreFrames);
            }
            if(scoreId == 6){
                scoreD.xoffset = - (scoreVal* arcMaxR)/(200 * drawScoreFrames);
                scoreD.yoffset =  (Math.sqrt(3)* scoreVal * arcMaxR)/(200 * drawScoreFrames);
                if(scoreVal > socreArray[4].score){
                    minIndex = 5;
                }else{
                    minIndex = 4;
                }
            }
        }

      
        /**
        * 动态渲染得分，思路如下
        * 1、每次清空上次的BG（同心圆）并重新绘制
        * 2、根据这是第几次渲染，计算圆心到1-6个点连线的坐标
        * 3、将坐标连接起来渲染成六边形，并定时开始下一次渲染实现动画
        */
        function dyncDrawSoce(){
            if(drawCount>drawScoreFrames){
                return;
            }
            drawBG();
            ctx.beginPath();
            var grdStartX ,grdStartY,grdEndX,grdEndy;

            for(var i=0;i<socreArray.length;i++){
                var scoreD = socreArray[i];
                if(i == 0){
                    ctx.moveTo(arcXPoint+scoreD.xoffset *drawCount, arcYPoint+scoreD.yoffset *drawCount);
                }else{
                    if(i == maxIndex){
                        grdStartX = arcXPoint+scoreD.xoffset *drawCount;
                        grdStartY =  arcYPoint+scoreD.yoffset *drawCount;
                    }
                    if(i == minIndex){
                        grdEndX = arcXPoint+scoreD.xoffset * drawCount;
                        grdEndy =  arcYPoint+scoreD.yoffset * drawCount;
                    }
                    ctx.lineTo(arcXPoint+scoreD.xoffset * drawCount, arcYPoint+scoreD.yoffset * drawCount);
                }
            }
            ctx.closePath();
            //TODO 这个地方绘制六边形
            //ctx.fill();
            ctx.strokeStyle = '#4C9CF6';
            var grd=ctx.createLinearGradient(grdStartX,grdStartY,grdEndX,grdEndy);
            grd.addColorStop(1,"rgb(122,190,241,0.4)");
            grd.addColorStop(0,"rgb(255,255,255,0.4)");
            ctx.fillStyle = grd;
            ctx.stroke();
            ctx.fill();
            drawCount++;

            setTimeout("dyncDrawSoce();",500/drawScoreFrames);

        }
        dyncDrawSoce();
        
