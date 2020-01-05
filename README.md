# 技术难点
- 阅读器开发：分页算法、全文搜索算法
- 离线存储机制：LocalStorage+IndexedDB
- 实现各种复杂手势+交互动画、兼容手势+鼠标操作
- 利用vuex+mixin实现组件解偶+复用
- 使用es6实现数据结构变化

# 项目准备
- 字体图标库
1. 准备好图标
1. 去[IcoMoon](https://icomoon.io/app/#/select "IcoMoon")网站导出图标库

- 项目依赖包及配置
> cnpm i --save-dev node-sass sass-loader

- Web字体
- viewport设置（禁止缩放）
 > `<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">`
  
- rem设置（自适应布局）
> javasript
> `document.addEventListener('DOMContentLoaded', () => {
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    const html = document.querySelector('html')
    html.style.fontSize = fontSize + 'px'
  })`

> css
> ` font-size: 1rem;`

## vuex+mixin封装属性和方法
```
import { mapGetters, mapActions } from 'vuex'

export const mixin = {
  computed: {
    ...mapGetters([……])

  },
  methods: {
    ...mapActions([……])
  }
}

在vue组件中即可使用vuex中的mapGetters和mapActions封装
mixins: [mixin],
```

# 静态资源服务器搭建
- Nginx 下载
- 服务配置：
```
server {
        listen 9000;
        listen [::]:9000;

        server_name resource;

        root /home/ubuntu/resource;
        autoindex on;
        index index.html;

        location / {
            add_header Access-Control-Allow-Origin *; #解决Nginx跨域问题
            try_files $uri $uri/ =404;
        }
        add_header Cache-Control "no-cache, must-revalidate"; #禁用缓存
}
```
# 读书模块
## epubjs阅读器
```javascript
this.book = new Epub(url)

this.rendition = this.book.renderTo('read', {
  width: innerWidth,
  height: innerHeight,
  method: 'default'
})

this.rendition.display()
```
## localStorage
解决cookie存储空间（4k）不足的问题（5M）
实现对象与json的互相转换

通过localStorage实现离线配置的缓存

## 书签手势
```js
// 获取水平偏移量和事件时间差
const offsetX = event.changedTouches[0].clientX - this.touchStartX
const time = event.timeStamp - this.touchStartTime


event.preventDefault() // 禁用默认方法调用        
event.stopPropagation() // 禁止事件传播
```

## 字体大小设置
使用`this.book.rendition.theme.fontSize(fontSize)`进行epub字体大小设置

## 字体样式设置
epub 的rendition.themes.font(font)方法将字体font-family设置到iframe内的body上，部分epub书籍在p标签上设置了字体类覆盖了样式，造成部分字体切换异常

### 字体框选中
```
setFontFamily (font) {
  this.setDefaultFontFamily(font).then(() => {
    this.switchTheme()
    })
  }
```

### 切换文件中的字体
因为epubjs使用iframe来加载epub文件，无法拉取到项目中设置的字体文件
所以需要在epub对象挂载完成时向阅读器dom传入字体文件。`this.rendition.hooks.content`表示阅读器渲染完毕的上下文，使用
```
content.register(contents => {
  contents.addStylesheet('样式文件URL')
})
```
传入的contents对象用来管理资源
样式文件URL根据Vue CLI3 环境变量获取

#### Vue CLI3 环境变量
[环境变量和模式](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)

创建`.env.development`来装载开发模式的环境变量,
使用`${process.env.VUE_APP_FONTS_URL}`获取



### 设置主题样式
根据导入的link的连接动态设置iframe中的内部样式
```js
export function addCss (href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

export function removeCss (href) {
  const link = document.getElementsByTagName('link')
  for (var i = link.length; i >= 0; i--) {
    if (link[i] && link[i].getAttribute('href') != null && link[i].getAttribute('href').indexOf(href) !== -1) {
      link[i].parentNode.removeChild(link[i])
    }
  }
}
```

## 设置进度条
### 分页与进度条
```js
//当book加载完成后
this.book.ready.then(() => {
        this.setCurrentBook(this.book)
        // 返回分页locations
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(()=>{ 
        //对locations进行处理
 })
```
 1. 使用`<input type="range">`的@input和@change事件绑定进度条拖动过程和拖动完成的事件
 2. 滑块前后背景色设置'style.backgroundSize = `${this.progress}% 100%`'
 3. 使用vue的钩子函数updated来渲染更新后的滑块前后背景色
 4. 根据进度条百分比获取当前cfi对象,渲染cfi对象展示页面

### 分章
使用Epub对象的Session属性设置章节section,展示并刷新进度条定位
```js
this.currentBook.rendition.display(section.href).then(() => { 
  this.refreshLocation()
})
```
### 阅读时间
vue文件mounted下执行定时任务 `this.task = setInterval(() => {……}, 1000)`     
在beforeDestroy下清除记时任务  `clearInterval(this.task)`

## 目录设计
1. 使用蒙版组件覆盖阅读器`$toheight:px2rem(48*2);height: calc(100% - #{$toheight});`
2. 使用动态组件`<component :is="cid"/>`来实现组件动态切换
3. 拆解目录 epub api获取到的目录列表是多级树状目录,需要将其转换成一维数组列表`[].concat(...[a,b])`
```js
function flatten (arr) {
  return [].concat(...arr.map(v => [v, ...flatten(v.subitems)]))
}
```
### 目录Scroll

### 全文搜索
参考https://github.com/futurepress/epub.js/wiki/Tips-and-Tricks-%28v0.3%29
```js
function doSearch(q) {
    return Promise.all(
        book.spine.spineItems.map(item => item.load(book.load.bind(book)).then(item.find.bind(item, q)).finally(item.unload.bind(item)))
    ).then(results => Promise.resolve([].concat.apply([], results))); //二维数组降维
};
```
搜索文本高亮
```js
book.rendition.annotations.highlight()
```

### 书签下拉
1. 通过offsetY的watch监听重置vue组件位置

# 书架模块



# 故事模块
## Scroll组件

[ScrollTop相关](https://blog.csdn.net/zh_rey/article/details/78967174)

上拉刷新实现思路：   
1.通过touchstart获取用户第一次点击的坐标  
2.通过touchmove 判断向上滑动还是向下    
3.判断列表的滚动条是否在最顶部    
4.然后判断在这个屏幕滑动的比例 进行状态显示 

下拉加载实现思路：   
1.通过判断滚动条位置算法是否实现下拉加载


## 组件解偶
> vuex中混写变量和方法的使用
1.在modules/xxx.js下定义state中的变量，定义mutations中的同步set方法
2.在store/actions.js中定义action中的异步方法
3.在store/getters.js中定义state变量的简化
4.在utils/mixin.js中computed的...mapGetters和...mapGetters中限定加入混写的变量名和方法名

## 集成步骤
1. 定义vue文件，定义布局和css样式
2. 导入mixin
3. 定义独有的vue methods中
4. 定义变量到vue data中或者vuex module模块下的state
5. 组件解偶配置
6. 在父vue中引入集成vue

# 离线存储
* web-storage-cache
    * 支持localStorage
* localForage
    * 支持回调的异步 API；
    * 支持 IndexedDB，WebSQL 和 localStorage 三种存储模式；
    * 支持 BLOB 和任意类型的数据，让您可以存储图片，文件等。
    * 支持 ES6 Promises

# 服务端开发
## 数据库
```sql
-- 数据库名：book
-- 字符集：utf8
-- 排序规则： uft8_general_ci
CREATE DATABASE `book` CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';
```

```sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Table structure for book
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fileName` varchar(255) DEFAULT NULL,
  `cover` varchar(1024) DEFAULT NULL,
  `title` varchar(1024) DEFAULT NULL,
  `author` varchar(1024) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `bookId` varchar(255) DEFAULT NULL,
  `category` int(3) DEFAULT NULL,
  `categoryText` varchar(255) DEFAULT NULL,
  `language` varchar(10) DEFAULT NULL,
  `rootFile` varchar(255) DEFAULT NULL,
  `totalReaders` INT(11) NOT NULL DEFAULT '0',
  `lastMonthReaders` INT(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fileName` (`fileName`)
) ENGINE = InnoDB AUTO_INCREMENT=466 DEFAULT CHARSET=utf8


-- Record of book
INSERT INTO `book` VALUES ()
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
```

## node
* npm init //创建npm项目
* cnpm i -S express  //使用express作为开发框架
* cnpm i -S cors     //解决跨域问题