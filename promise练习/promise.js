//  //煮开水
// var boilWater = function(){
// 	return new Promise(function(resolve){
// 		setTimeout(function(){
// 			console.log('boilWater')
// 			resolve("boilWater")
// 		},10 * 1000) 		//10秒钟
// 	})
// }

// //洗杯子
// var washGlass = function(){
// 	return new Promise(function(resolve){
// 		setTimeout(function(){
// 			console.log("washGlass")
// 			resolve("washGlass")
// 		},2 * 1000)		//2秒钟
// 	})
// }

// //泡茶叶
// var prepareTeaLeaves = function(){
// 	return new Promise(function(resolve){
// 		setTimeout(function(){
// 			console.log("prepareTeaLeaves")
// 			resolve("prepareTeaLeaves")
// 		},1 * 1000)		//1秒钟
// 	})
// }

let boilWater = () => new Promise(resolve => setTimeout(
		() => {console.log("boilWater");resolve("boilWater")},10 * 1000 
	))

let washGlass = () => new Promise(resolve => setTimeout(
		() => {console.log("washGlass");resolve("washGlass")},2 * 1000
	))

let prepareTeaLeaves = () => new Promise(resolve => setTimeout(
		() => {console.log("prepareTeaLeaves");resolve("prepareTeaLeaves")},1 * 1000
	))

console.time("Promise")
boilWater()
.then(() => washGlass())
.then(() => prepareTeaLeaves())
.then(() => {console.timeEnd("Promise")})