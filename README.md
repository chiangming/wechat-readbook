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
### 组件解偶
> vuex中混写变量和方法的使用
1.在modules/xxx.js下定义state中的变量，定义mutations中的同步set方法
2.在store/actions.js中定义action中的异步方法
3.在store/getters.js中定义state变量的简化
4.在utils/mixin.js中computed的...mapGetters和...mapGetters中限定加入混写的变量名和方法名

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

# epubjs阅读器
```javascript
this.book = new Epub(url)

this.rendition = this.book.renderTo('read', {
  width: innerWidth,
  height: innerHeight,
  method: 'default'
})

this.rendition.display()
```

## 书签手势

event.preventDefault() // 禁用默认方法调用        event.stopPropagation() // 禁止事件传播

## 字体大小设置
使用`this.book.rendition.theme.fontSize(fontSize)`进行epub字体大小设置

## 字体样式设置
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

> 中文字体切换存在bug


