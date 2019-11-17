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

