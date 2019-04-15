# code
[toc]


#GIT
## git pull 和 git fetch的区别
首先，他们都可以将远端仓库更新至本地

`FETCH_HEAD`:版本链接，记录在本地，指向目前已从远程仓库取下来的分支的最新版本

`commit-id`:每次commit之后产生的唯一识别版本的序列号

`git fetch`:只会将本地仓库所关联的远程库的commit-id更新到最新，本地仓库没有变化

`git pull`:会将本地仓库更新至远程库的最新状态

从结果上看：git pull = git fetch + git merge

#javascript
## es6箭头运算符this指向
箭头函数自身是没有this的，	他的this是`继承`自父执行上下文，在定义时绑定

- `new运算符`调用？不行，要报错，因为它没有this
- `call`、`apply`、`bind`改变this指向？不行，没有用，因为它没有this
- 作为`对象的方法`使用咧？this指向的不是对象，是对象所处环境的this指向

## javascript原型继承
### 构造函数、原型对象、实例之间的关系
- 每个构造函数都有一个原型对象prototype
- 每个原型对象prototype都有一个指向构造函数的指针constructor
- 每个实例都有一个指向原型对象的内部指针__proto__
###原型继承
`功能`：把父类的私有和公有的属性和方法都变成子类的公有属性或方法

`核心`：重写了原型对象，将子类的原型指向父类的实例
```javascript
    function Father(){
	    this.handsome = true;
	    this.rich = true;
	    this.house = ["bieshu","haijing"];
    }
    function Son(){
    }
    //核心代码
    Son.prototype = new Father();
    //constructor丢失
    Son.prototype.constructor = Son;
```
`不足`：

* 父类中的引用类型数据作为公有属性，子类一操作之后会影响子类二
* 不能灵活的向父类型的构造函数中传参

### call继承
`功能`：把父类的私有属性变成子类的私有属性

`核心`：子类构造函数中使用call调用父类构造函数
``` javascript
    function Father(){
	    this.handsome = true;
	    this.rich = true;
    }
    function Son(){
      //核心代码
	    Father.call(this)
    }
```
 `不足`：

 - 只能继承父类的私有属性和方法
 - 不能实现函数复用，每个子类实例都有一样的函数，影响性能

### 拷贝继承

 `功能`:子类继承父类的公有+私有属性和方法
 `核心`:在子类构造函数中遍历父类实例
 
```javascript
    function Father(){
	   this.hansome = true;
    }
	Father.prototype.beRicher=function(){}
	function Son(){
		var father = new Father();
		for(var prop in father){
			this[prop]=father[prop]
			/*只拷贝私有属性
			if(father.hasOwnProperty(prop)){
				this[prop]=father[prop]
			}
			*/
		}
	}
```
 `不足`:

 - 如果拷贝公有和私有属性的话，就无法实现函数复用
 - 如果只靠被私有属性的话，就跟call继承一样
 
 
### 混合继承
#### call+原型继承
功能：继承公有+私有
核心：原型继承+call继承
```javascript
    function Father(){
	    this.handsome = true;
    }
    function Son(){
	    Father.call(this)
    }
    Son.prototype = new Father();
    Son.constructor = Son;
```
不足：

- 使用了两次父类的构造函数
- 子类的原型上有多余一份的父类的属性

#### call+拷贝继承 (这种方式也挺好的)
`功能`：call继承私有、拷贝继承原型

`核心`：拷贝继承+cll继承
```javascript
    function Father(){
	    this.handsome = true;
    }
    function Son(){
	    Father.call(this)
    }
    for(var prop in Father.prototype){
	    Son.prototype[prop] = Father.prototype[prop]
    }
```
#### 寄生式组合继承（最佳方式）
`功能`：是call+原型继承的升级版

`核心`：将父类的原型包装成一个副本

```javascript
    function Father(){
	    this.handsome = true;
    }
    function Son(){
	    Father.call(this)
    }
    Son.prototype = Object.create(Father.prototype)
    Son.prototype.constructor = Son
```

### 中间件继承
功能：继承父类的公有方法
核心：将子类的prototype的\__proto__属性指向父类的prototype
```javascript
    function Father(){
	    this.handsome = true;
    }
    function Son(){
    }
	Son.prototype.__proto__ = Father.prototype;
```
不足：
- 只能继承公有属性和方法

## 闭包

## 事件捕获与冒泡
[segmentFault讲解文章](https://segmentfault.com/a/1190000005654451)
[js事件模型](https://segmentfault.com/a/1190000006934031#articleHeader10)
### 区别
为了解决页面中的事件流而提出

`事件冒泡`:由微软提出，顺序是`button -> body -> html -> document` (从具体的到不太具体的)

`事件捕获`:由网景提出，顺序是`document -> html -> body -> button` (从不太具体的到具体的)

`w3c`采用折中的方式，先捕获再冒泡

addEventListener函数的第三个参数`useCapture`就是为这个准备的

默认为`false`，表示在事件冒泡阶段调用事件处理函数；如果为`true`，则表示在事件捕获阶段调用事件处理函数。

- 对于非target节点，先捕获再冒泡
- 对于target节点则是先调用先注册的事件

### 应用
- 事件代理：使用事件代理，减少事件处理函数的个数

## 跨域
- Flash跨域
- 服务器代理中转（服务器上没有同源策略）
- CORS跨域（服务器的配置）
- document.domain（针对基础域名相同的情况）
在脚本文件里写上`document.domain = 'xxx.com'`
- Jsonp(都是GET请求)
    - src不受同源策略影响（`<img>、<script>、<iframe>`）
    - script标签使用src加载文件内容放到script标签内部
    - 数据放在服务器上，并且以json的形式存储
    - 无法监控src属性是否读取数据完成，所以利用回调函数处理
    - src获取数据时添加一个参数cb=handleFunction

```javascript
    //异步加载文件
    var oScript = document.createElement('script');
    oScript.src = './index.txt？cb=handleFunction';
    document.body.appendChild(oScript);
    document.body.removeChild(oScript);
    //回调函数
    function handleFunction(data){
        console.log(data)
    }
```
## cookie
cookie是服务器生成，发送给浏览器，浏览器会将cookie以键值对的形式保存在某个目录下的文本文件内，下次请求同一网站的时候就会发送cookie给服务器。
cookie就是一个小型文件
浏览器一个域名下最多几十个cookie，一个cookie最大4K左右
### 标记用户的三个首部：
- form:e-mail
- user-agent:记录浏览器
- referer:跳转链接
### cookie
- domain
- path
- expire:session表示临时cookie；max-age设置存储时间
document.cookie="name=zonglang;max-age=1000;path=/"
增：直接写
删：设置max-age=-1
查：对document.cookie的字符串进行处理

## typeof、instanceof、toString判断变量类型
### typeof 
利用typeof可以判断七种变量类型变量类型，如`number`,`string`,`boolean`,`undefined`,`object`,`function`,`symbol`；
但是缺点是:
1、不能判断是哪种具体的`object`，是数组还是对象
2、将null判断为object


# html

## 替换元素和非替换元素
html里的元素分为替换元素和非替换元素
- `替换元素`:指作为其他内容占位符的一个元素，如`img`,`input`,虽然是行内元素，但是可以设置宽高，并且margin属性对其也起作用
- `非替换元素`:指内容包含在文档中的元素，例如段落的内容就在元素内部


# css
## nth伪类选择器
- :first-child
- :last-child
- :nth-child
	- :nth-child(an+b),n为从0开始的正整数

## css属性是否区分大小写
html和css都是对大小写不敏感，但是一般都采用小写的写法

## 行内(inline)元素 设置margin-top和margin-bottom 是否起作用
对于`行内非替换元素`设置是不起作用的，因为外边距不会改变行高，但是左右边距会有影响，padding-top和padding-bottom也是同理

## 
[css权重](https://github.com/zonglang/code/issues/1)
<a href="https://github.com/zonglang/code/issues/1" target="_blank">css权重</a>

##BFC
### 什么是bfc？
块格式上下文（block formatting context),不太好解释定义，我把它当成一种特别强势的一块渲染区域，内部有特殊的布局规则：
- 内部一行一行放置块级盒子
- 内部相邻盒子的竖直margin会合并
- 能够解决margin折叠问题(两个margin必须是邻接的)
- 一个块格式上下文包括创建它的元素内部的所有内容，除了位于其他bfc的后代元素
- 能够清除浮动（但是最好还是用clearfix）


### 产生
- 浮动元素(默认宽度为0 )
- 绝对定位元素(默认宽度为0 )
- 块级内联元素(默认宽度为0 )
- overflow不为visble的块元素
- display:flow-root(无副作用)

### 作用代码
1、包含浮动元素
```css
    .father{
	    border:1px solid red;
	    /*产生bfc布局*/
	    float:left;
	    position:absolute;
	    overflow:auto;
	    display:inline-block;
	    display:flow-root;/*无副作用*/
    }
    .son{
	    width:100px;
	    height:100px;
	    float:left:
	    background:green;
    }
```

2、两栏布局
```css
    .left{
	    width:200px;
	    height:1000px;
	    float:left;
    }
    .right{
	    height:1000px;
	    display:flow-root
    }
```

## css实现居中
[实现的代码](http://js.jirengu.com/qayol/1/edit)
### absolute + 负margin
```css
    .item{
      height:200px;
      width:200px;
      position:absolute;
      background: red;
      top:50%;
      margin-top:-100px;
    }
```
首先绝对定位，上50%，再用负边距微调

### absolute + calc()
```css
    .item{
        position:absolute;
        width:100px;
        height:100px;
        top:calc(50%-50px);
        left:calc(50%-50px);
    }
```
绝对定位，使用calc()计算距离

### absolute + translate
```css
    .item{
        position:absolute;
        top:50%;
        left:50%;
        transform:translateY(-50%,-50%);
    }
```
这个简直是好用的不要不要的吧

### absolute + margin auto
```css
    .container{
      height: 300px;
      border:1px solid black;
      position:relative;
    }
    .item{
      height: 100px;
      width: 100px;
      background: red;
      position:absolute;
      top:0;
      bottom:0;
      margin:auto;
    } 
```
首先绝对定位，上下距离为0，再用margin自动填充

### line-height + vertical-align
```css
    .container{
      height: 500px;
      line-height:500px;
      border:1px solid;
      text-align:center;
    }
    .item{
      display:inline-block;
      vertical-align:middle;
      line-height:initial;
      background: red;
      width:100px;
      height: 100px;
    }
```
父元素设置行高垂直居中、设置text-align水平居中，
子元素设为行内元素，vertical-align对齐
### 表格法 + vertical-align
多行文本居中
```css
    .container{
      display:table;
      height: 300px;
      border:1px solid black;
    }
    .item{
      display:table-cell;
      vertical-align:middle;
      word-wrap:break-word;
      word-break: break-all;
      height:100px;
      width:100px;
      background: red;
    }
```
父元素设置table，子元素设置teble-cell，子元素内的文本就居中了

### padding实现居中效果
```css
    .container{
      padding:5% 0;
      border:1px solid black;
    }
    .item{
      padding:10% 0;
    }
```
设置上下padding一致实现居中

### 浮动元素法实现居中效果
```css
    .container{
      height:500px;
      border:1px solid ;
    }
    .float{
      float:left;
      height:50%;
      width:100%;
      background:red;
      margin-bottom:-100px;
    }
    .item{
      clear:both;
      width:200px;
      height: 200px;
    }
```
设置一个浮动元素占位50%，然后负边距微调，清除浮动

### flex布局
```css
    .container{
        display:flex;
        align-items:center;
    }
```

### 

## css自动换行、强制不换行、强制断行

## margin、padding实现高度自适应
> 当margin/padding取值形式为百分比的时候，无论是`left`/`right`/`top`/`bottom`,都是以`父元素的width`为参照物

可以使用padding-top/padding-bottom的百分比来实现占位，将容器的高度撑起来
由于使用这个撑起来之后不能使用`max-height`限制高度，所以一般使用子元素或者伪元素的padding来撑起父容器
```css
    .container{
      width:50%;
      background: red;
      overflow:hidden; /*触发bfc解决margin折叠问题*/
    }
    .container::before{
      content:'';
      display:block;
      margin-top:100%;/*父元素宽度的100%*/
    }
```
