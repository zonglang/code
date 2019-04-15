//创建一个地图类
function Map(mapInfo){
	//挂载到地图容器里去
	this.mapOb = document.getElementById(mapInfo.container)
	this.restartBtn = document.getElementById(mapInfo.restartBtn)
	this.chooseLevelBtn = document.getElementById(mapInfo.chooseLevelBtn)
	this.levelInput = document.getElementById(mapInfo.levelInput)
	this.lastLevelBtn = document.getElementById(mapInfo.lastLevelBtn)
	this.nextLevelBtn = document.getElementById(mapInfo.nextLevelBtn)
	this.levelText = document.getElementById(mapInfo.levelText)
	this.mapGrids = []
	//记录当前小人的位置
	this.people = {
		x:0,
		y:0,
		direction:"down"
	}
	this.level = 0
	//记录图片
	this.imgs = {}
	//记录获胜条件
	this.successNum = 0
	//地图的默认宽高为16 x 16
	this.w = 16
	this.h = 16
	//地图默认格子的大小
	this.gridSize = 40	
	//加载图片
	this.initImgs()
	//初始化地图
	this.initCanvas()
	//设置监听事件
	this.eventListen()
	this.loadMap()
}
Map.prototype = {
	initCanvas:function(){
		//创建一个canvas
		this.canvas =  document.createElement("canvas")
		//计算canva的宽高
		this.canvas.width = (this.w * this.gridSize + 10)
		this.canvas.height = (this.h * this.gridSize + 10)	
		this.mapOb.appendChild(this.canvas)
	},
	initImgs:function(){
		var imgPath = {
			"block" : "img/block.gif",
			"wall" : "img/wall.png",
			"box" : "img/box.png",
			"ball_in":"img/ball_in.png",
			"ball" : "img/ball.png",
			"up" : "img/up.png",
			"down" : "img/down.png",
			"left" : "img/left.png",
			"right" : "img/right.png",
	    }
	    for(var path in imgPath){
	    	var img = new Image()
	    	img.src = imgPath[path]
	    	this.imgs[path] = img
	    }
	},
	eventListen:function(){
		this.restartBtn.addEventListener("click",()=>{
			this.loadMap()
		})
		this.chooseLevelBtn.addEventListener("click",()=>{
			var level = Number(this.levelInput.value) - 1
			this.chooseLevel(level)
		})
		this.lastLevelBtn.addEventListener("click",()=>{
			this.chooseLevel(this.level-1)
		})
		this.nextLevelBtn.addEventListener("click",()=>{
			this.chooseLevel(this.level+1)
		})
		//开始监听键盘事件
		window.onkeydown = (e) => {
			switch(e.key.toLowerCase()){
				case "w":
				case "arrowup":
					this.movePeople("up")
					break
				case "s":
				case "arrowdown":
					this.movePeople("down")
					break
				case "a":
				case "arrowleft":
					this.movePeople("left")
					break
				case "d":
				case "arrowright":
					this.movePeople("right")
					break
			}
		}
		//监听滑动事件
		var startx, starty;
		//获得角度
		function getAngle(angx, angy) {
		    return Math.atan2(angy, angx) * 180 / Math.PI;
		};

		//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
		function getDirection(startx, starty, endx, endy) {
		    var angx = endx - startx;
		    var angy = endy - starty;
		    var result = 0;

		    //如果滑动距离太短
		    if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
		        return result;
		    }

		    var angle = getAngle(angx, angy);
		    if (angle >= -135 && angle <= -45) {
		        result = 1;
		    } else if (angle > 45 && angle < 135) {
		        result = 2;
		    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
		        result = 3;
		    } else if (angle >= -45 && angle <= 45) {
		        result = 4;
		    }

		    return result;
		}
		//手指接触屏幕
		document.addEventListener("touchstart", function(e){
		    startx = e.touches[0].pageX;
		    starty = e.touches[0].pageY;
		    console.log(e)
		}, false);
		//手指离开屏幕
		document.addEventListener("touchend", (e) => {
		    var endx, endy;
		    endx = e.changedTouches[0].pageX;
		    endy = e.changedTouches[0].pageY;
		    var direction = getDirection(startx, starty, endx, endy);
		    switch (direction) {
		        case 0:
		            break;
		        case 1:
		            this.movePeople("up")
		            break;
		        case 2:
		            this.movePeople("down")
		            break;
		        case 3:
		            this.movePeople("left")
		            break;
		        case 4:
		            this.movePeople("right")
		            break;
		        default:
		    }
		}, false);
	},
	loadMap:function(){
		//加载地图
		var tmpMap = LEVELS[this.level]
		this.successNum = 0
		this.people.direction = "down"
		//遍历地图
		//深复制地图
		for(var i = 0,len1 = this.w;i < len1;i++){
			for(var j = 0,len2 = this.h;j < len2;j++){
				if(!this.mapGrids[i])
					this.mapGrids[i]=[]
				this.mapGrids[i][j] = tmpMap[i][j]
				//找到人的位置
				if(this.mapGrids[i][j] == 4){
					this.people.x = j
					this.people.y = i
				}
				//找个箱子目标个数
				if(this.mapGrids[i][j] == 2){
					this.successNum++
				}
			}
		}
		this.paintMap()
		return this
	},
	chooseLevel:function(level){
		if(level<0){
			level = 0
			alert("至少从第1关开始")
		}
		else if(level>LEVELS.length-1){
			level = LEVELS.length-1
			alert(`最多为第${LEVELS.length}关`)
		}
		this.level = level
		this.loadMap()
	},
	paintMap:function(){
		//更改选择关卡的文字
		levelText.innerHTML = `第${this.level + 1}关`
		//根据map绘制地图
		var num = 0
		var loseFlag = true
		for(var i = 0,len1 = this.w;i < len1;i++){
			for(var j = 0,len2 = this.h;j < len2;j++){
				var gridValue = this.mapGrids[i][j]
				var upgridValue = typeof this.mapGrids[i-1] == "undefined" ? 1 :this.mapGrids[i-1][j]
				var downgridValue = typeof this.mapGrids[i+1] == "undefined" ? 1 :this.mapGrids[i+1][j]
				var leftgridValue = typeof this.mapGrids[i][j-1] == "undefined" ? 1 :this.mapGrids[i][j-1]
				var rightgridValue = typeof this.mapGrids[i][j+1] == "undefined" ? 1 :this.mapGrids[i][j+1]
				// 记录到达目标的箱子个数
				if(gridValue == 5)
					num++
				//判断箱子是否可以移动
				if(gridValue == 3 || gridValue == 5){
					if((upgridValue == 0 || upgridValue == 2 || upgridValue == 4)
						&& (downgridValue == 0 || downgridValue == 2 || downgridValue == 4))
						loseFlag =false
					if((leftgridValue == 0 || leftgridValue == 2 || leftgridValue == 4)
						&& (rightgridValue == 0 || rightgridValue == 2 || rightgridValue == 4))
						loseFlag =false
				}
				// 绘制格子
				var ctx = this.canvas.getContext("2d")
				ctx.strokeStyle = "red"
				ctx.lineWidth = 1
				var size = this.gridSize
				this._paintGrid(ctx,
								size * j,
								size * i,
								gridValue)
			}
		}
		//如果所有箱子都到达目标点 ==> 胜利
		if(num == this.successNum){
			this.playerWin()
		}
		else if(loseFlag){
			this.playerLose()
		}
		return this
	},
	movePeople:function(direction){
		var next1={
			"x":this.people.x,
			"y":this.people.y,
			"direction":""
		},next2={
			"x":this.people.x,
			"y":this.people.y,
			"direction":""
		}
		switch(direction){
			case "left":
				next1.x = this.people.x-1
				next2.x = this.people.x-2
				next1.direction = next2.direction = "left"
				break
			case "right":
				next1.x = this.people.x+1
				next2.x = this.people.x+2
				next1.direction = next2.direction = "right"
				break
			case "up":
				next1.y = this.people.y-1
				next2.y = this.people.y-2
				next1.direction = next2.direction = "up"
				break
			case "down":
				next1.y = this.people.y+1
				next2.y = this.people.y+2
				next1.direction = next2.direction = "down"
				break
		}
		console.log(next1,next2)
		console.log(this._canImove(next1, next2))
	},
	playerWin:function(){
		setTimeout(function(){
			alert("赢了")
		},500)
	},
	playerLose:function(){
		setTimeout(function(){
			alert("输了")
		},500)
	},
	_canImove:function(n1, n2){
		var n1_value = this.mapGrids[n1.y][n1.x]
		var n2_value = this.mapGrids[n2.y][n2.x]
		console.log(n1_value,n2_value)
		// 出地图边界
		if(n1.x < 0 || n1.x >= this.w || n1.y < 0 || n1.y >= this.h){
			console.log("出界了")
			return false
		}
		// 直接撞墙
		if(n1_value == 1){
			console.log("撞墙了")
			return false 
		}
		// 下一个为空地板或者目标时
		// 直接可以移动
		if(n1_value == 0 || n1_value == 2){
			console.log("自身移动了")
			this.mapGrids[this.people.y][this.people.x] -= 4
			this.mapGrids[n1.y][n1.x] += 4
			//人的位置变成下一个点的位置
			this.people.x = n1.x
			this.people.y = n1.y
			this.people.direction = n1.direction
			this.paintMap()
			return true
		}
		// 推动箱子
		if((n1_value == 3 || n1_value == 5)&& 
			(n2_value == 0 || n2_value == 2)){
			console.log("推动了箱子")
			//人的位置改变
			this.mapGrids[this.people.y][this.people.x] -= 4
			this.mapGrids[n1.y][n1.x] += 4
			//人的位置变成下一个点的位置
			this.people.x = n1.x
			this.people.y = n1.y
			this.people.direction = n1.direction
			//箱子的位置改变
			this.mapGrids[n1.y][n1.x] -= 3
			this.mapGrids[n2.y][n2.x] += 3
			this.paintMap()
			return true
		}
		if(n1_value == 4 || n1_value == 6){
			alert("错误：下一个的值为4")
		}
		return false
	},
	_paintGrid:function(ctx,x,y,value){
		var size = this.gridSize
		var img = this.imgs["block"]
		//绘制mapGrids[i][j]
		// 0 为 不绘制
		// 1 为 墙壁
		// 2 为 目标
		// 3 为 箱子
		// 4 为 人
		// 5 为 箱子放在目标上
		// 6 为 人站在目标上
		// 7 为 错误
		ctx.drawImage(img, x, y, size, size);
		switch(value){
			case 1:
				//绘制墙壁
				img = this.imgs["wall"]
				ctx.drawImage(img, x, y, size, size);
				break
			case 2:
				//绘制目标
				img = this.imgs["ball"]
				ctx.drawImage(img, x, y, size, size);
				break
			case 3:
				//绘制箱子
				img = this.imgs["box"]
				ctx.drawImage(img, x, y, size, size);
				break	
			case 4:
				//绘制人
				img = this.imgs[this.people.direction]
				console.log(this.people.direction)
				ctx.drawImage(img, x, y, size, size);
				break
			case 5:
				//绘制箱子
				img = this.imgs["box"]
				ctx.drawImage(img, x, y, size, size);
				//绘制目标
				img = this.imgs["ball_in"]
				ctx.drawImage(img, x, y, size, size);
				break
			case 6:
				//绘制目标
				img = this.imgs["ball"]
				ctx.drawImage(img, x, y, size, size);
				//绘制人
				img = this.imgs[this.people.direction]
				ctx.drawImage(img, x, y, size, size);
				break
			default:
				//其他
				break
		}
	}
}

Map.initImgs = function(){
	var imgPath = {
		"block" : "img/block.gif",
		"wall" : "img/wall.png",
		"box" : "img/box.png",
		"ball" : "img/ball.png",
		"ball_in" : "img/ball_in.png",
		"up" : "img/up.png",
		"down" : "img/down.png",
		"left" : "img/left.png",
		"right" : "img/right.png",
    }
    for(var path in imgPath){
    	var img = new Image()
    	img.src = imgPath[path]
    }
}