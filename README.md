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
- 作为`对象的方法`使用咧？this指向的是不是对象，是对象所处环境的this指向

## javascript原型继承
### 构造函数、原型对象、实例之间的关系
- 每个构造函数都有一个原型对象prototype
- 每个原型对象prototype都有一个指向构造函数的指针constructor
- 每个实例都有一个指向原型对象的内部指针__proto__
###原型继承
`功能`：把父类的私有和公有的属性和方法都变成子类的公有属性或方法
`核心`：重写了原型对象，将子类的原型指向父类的实例

    function Father(){
	    this.handsome = true;
	    this.rich = true;
	    this.house = ["bieshu","haijing"];
    }
    function Son(){
    }
    Son.prototype = new Father();
    //constructor丢失
    Son.prototype.constructor = Son;
`不足`：
* 父类中的引用类型数据作为公有属性，子类一操作之后会影响子类二
* 不能灵活的向父类型的构造函数中传参

### call继承
`功能`：把父类的私有属性变成子类的私有属性
`核心`：子类构造函数中使用call调用父类构造函数

    function Father(){
	    this.handsome = true;
	    this.rich = true;
    }
    function Son(){
	    Father.call(this)
    }
 `不足`：
 - 只能继承父类的私有属性和方法
 - 不能实现函数复用，每个子类实例都有一样的函数，影响性能

### 拷贝继承

 `功能`:子类继承父类的公有+私有属性和方法
 `核心`:在子类构造函数中遍历父类实例
 

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
 `不足`:
 - 如果拷贝公有属性的话也无法很好的进行函数复用
 
 
### 混合继承
#### call+原型继承
功能：继承公有+私有
核心：原型继承+call继承

    function Father(){
	    this.handsome = true;
    }
    function Son(){
	    Father.call(this)
    }
    Son.prototype = new Father();
    Son.constructor = Son;
不足：
- 使用了两次父类的构造函数
- 子类的原型上有多余一份的父类的属性

#### call+拷贝继承
功能：call继承私有、拷贝继承原型
核心：拷贝继承+cll继承

    function Father(){
	    this.handsome = true;
    }
    function Son(){
	    Father.call(this)
    }
    for(var prop in Father.prototype){
	    Son.prototype[prop] = Father.prototype[prop]
    }
#### 寄生式组合继承（最佳方式）
功能：是call+原型继承的升级版
核心：将父类的原型包装成一个副本

    function Father(){
	    this.handsome = true;
    }
    function Son(){
	    Father.call(this)
    }
    Son.prototype = Object.create(Father.prototype)
    Son.prototype.constructor = Son
    

### 中间件继承
功能：继承父类的公有方法
核心：将子类的prototype的\__proto__属性指向父类的prototype

    function Father(){
	    this.handsome = true;
    }
    function Son(){
    }
	Son.prototype.__proto__ = Father.prototype;
不足：
- 只能继承公有属性和方法

## 闭包


 
#html

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

## css权重

#### 权重的有什么用
解决css规则不生效问题

#### 权重的五个等级
> 一条样式规则的整体权重包含四个独立的部分 : [A、B、C、D]
> 权重是匹配的选择器中的每一种选择器类型的数值决定

**逐级比较，同级比数量**

| 规则      |   权重等级   |
| :--------: |-------: |
|整体权重|ABCD|
| !important    |   ~  |
| 行内样式|1000|
|id选择器|0100|
|类、属性、伪类选择器|0010|
|类型、伪元素选择器|0001|
|通配符、继承的样式|0000|
```
!important > 内联 > ID > 类 = 伪类 = 属性 > 标签(元素) = 伪元素 > 通配符
```

#### 权重的使用规则
* 不推荐使用!important
> `!important`根本没有结构与上下文可言，但是得知道怎么覆盖!important规则 : id选择器的important能覆盖class选择器的important
* 单独使用一个选择器的时候，不能跨等级使css规则失效
> **无论多少个class组成的类选择器，都没有一个ID选择器权重高**，所以一般权重是在一个等级上才有可比性，残酷的是量变不能引起质变的咧。
* 相邻选择器、兄长选择器、亲子选择器、后代选择器都拆分成两个选择器再进行计算。
* 当权重不同的选择器作用在同一元素上时，权重高的css规则生效
* 当权重相同的选择器作用在同一元素上是，后出现的css规则生效(网上还有离元素近的规则生效本质也是后出现的生效)

##BFC
### 什么是bfc？
块格式上下文（block formatting context),不太好解释定义，我把它当成一种特别强势的一块渲染区域，内部有特殊的布局规则：
- 内部一行一行放置块级盒子
- 内部相邻盒子的竖直margin会合并
- 一个块格式上下文包括创建它的元素内部的所有内容，除了位于其他bfc的后代元素
- 能够清除浮动（但是最好还是用clearfix）

### 产生
- 浮动元素(默认宽度为0 )
- 绝对定位元素(默认宽度为0 )
- 块级内联元素(默认宽度为0 )
- overflow不为visble的块元素
- display:flow-root(无副作用)

###作用代码
1、包含浮动元素

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

2、两栏布局

    .left{
	    width:200px;
	    height:1000px;
	    float:left;
    }
    .right{
	    height:1000px;
	    display:flow-root
    }

