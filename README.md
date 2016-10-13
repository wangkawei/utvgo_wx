# utvgo 微信版，包括点播，直播，广播功能；为智慧佛山而做




# 使用gulp构建前端开发环境

此构建环境包括如下功能：

* 解析less，组合压缩css
* 组合压缩js
* js检查
* css里图片md5方式的版本管理
* html里图片、css和js文件引用的md5方式管理



### 安装
首先要装好nodejs，npm，gulp,supervisor,pm2
安装supervisor

```
npm install supervisor -g
```

开发可用supervisor,上线用pm2
```
supervisor server/bin/www

//pm2资料：https://blog.linuxeye.com/435.html
pm2 start server/bin/www --watch


```


在项目根目录打开终端，依次输入如下命令

```
//安装项目需要的依赖包
npm install

//启动服务(后台启动加 &);服务开启，监听了8082端口
supervisor server/bin/www


```


安装package.json里的依赖包


### 安装后目录如下
> --dest  //放构建后的文件，文件目录结构与项目代码原文件一样

> --res   //放js，css，less，images代码原文件

>> --images //图片

>> --less  //css或less

>> --js //js代码原文件

>> --temp  //存放构建过程中生成的临时文件

>  --node_modules //构建环境依赖的包

>  --cmd.bat //win下在当前目录路径打开终端

>  --*.html //html代码原文件

>  --README.md  //项目说明文件

>  --gulpfile.js  //构建程序





注意：css less js images 构建不能自动嵌套文件夹




### 配置nginx 样例
```

upstream utvgo_wx_nodejs {
    server localhost:8082 max_fails=2 fail_timeout=20s;
}

server {
    listen       8888;
    server_name  localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;
	root   D:/utvgo_wx/;
    


    location /utvgo_wx/dest/index.html {
        #alias   D:/utvgo_wx/dest/;
        
        #index   index.html;
        #rewrite ^/ http://10.10.16.91;    //将客户端的请求重定向
        proxy_pass http://localhost:8082/utvgo_wx/dest/index.html;
        proxy_set_header Host $http_host;
        proxy_set_header  X-Real-IP  $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /utvgo_wx/dest/login.html {
        #alias   D:/utvgo_wx/dest/;
        
        #index   index.html;
        #rewrite ^/ http://10.10.16.91;    //将客户端的请求重定向
        proxy_pass http://localhost:8082/utvgo_wx/dest/login.html;
        proxy_set_header Host $http_host;
        proxy_set_header  X-Real-IP  $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    #这中配置会自动把匹配的地址后面的路径也一起转发过去
    location /utvgo_wx/dest/getWXsignature/ {
        #alias   D:/utvgo_wx/;
        
        #index   index.html;
        #rewrite ^/ http://10.10.16.91;    //将客户端的请求重定向
        proxy_pass http://utvgo_wx_nodejs;
        proxy_redirect off;
        proxy_next_upstream error timeout;
        proxy_set_header Host $http_host;
        proxy_set_header  X-Real-IP  $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /utvgo_wx/ {
        alias   D:/utvgo_wx/;
        
        #index   index.html;
        #rewrite ^/ http://10.10.16.91;    //将客户端的请求重定向
        #proxy_pass http://localhost:8082/index;
    }
	

    #error_page  404              /404.html;

   
}

```
