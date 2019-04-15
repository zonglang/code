module.exports = {
	entry:"./src/entry.js",
	output:{
		// filename:"index-[hash:8].js",
		filename:"index.js",
		path:__dirname + "/out"
	},
	module:{
		rules:[
			{test:/.js$/, use:['babel-loader']},
			{test:/.css$/,use:['style-loader','css-loader']},
			{test:/.jpg|png|gif|svg/,use:['url-loader']}
		]
	}
}