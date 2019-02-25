//煮开水
var boilWater = function(cb){
	setTimeout(function(){
		console.log('boilWater')
		cb("boilWater")
	},10*1000)		//10秒钟
}

//洗杯子
var washGlass = function(cb){
	setTimeout(function(){
		console.log("washGlass")
		cb("washGlass")
	},2*1000)		//2秒钟
}

//泡茶叶
var prepareTeaLeaves = function(cb){
	setTimeout(function(){
		console.log("prepareTeaLeaves")
		cb("prepareTeaLeaves")
	},1 * 1000)		//1秒钟
}

// callback hell
console.time("callback")
boilWater(function(boilWater){
	washGlass(function(washGlass){
		prepareTeaLeaves(function(prepareTeaLeaves){
			console.log(boilWater + washGlass + prepareTeaLeaves)
			console.timeEnd("callback")
		})
	})
})

