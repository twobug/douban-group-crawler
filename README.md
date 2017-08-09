利用 Node.js 实现爬虫，爬取了豆瓣西安租房小组最新回复的100条帖子的内容，再通过express将数据传到前端，展示在页面上，省去一个一个点开筛选租房信息的时间。作为 Node.js 新手的练手项目，项目十分简单，可以帮助新手理解简单的爬虫工作原理、前后端数据交互等知识点。
同时该项目也存在不完善的地方，欢迎大家提出意见和建议，我也会在学习过程中不断完善这个应用。

## 技术栈：
- 后台：express superagent cheerio async
- 前端：JQuery ajax

## 我的软件版本（2017.08）
Node.js v8.1.4

## 项目运行：

```
# 克隆到本地：
$ git clone git@github.com:Nicole0320/douban-group-crawler.git

# 安装依赖：
$ git install

# 开启本地服务器
$ npm start
```
开启本地服务器后，打开 http://localhost:3000/app.html 就可以看到抓取到的数据展示页

## 展示页截图：
![项目截图](https://raw.githubusercontent.com/Nicole0320/douban-group-crawler/master/APP/douban.PNG)

## 关于下一版本的想法
- 添加数据检索筛选，根据用户输入将符合条件的数据筛选出来展示
- 添加自定义爬取小组地址
- 数据量太大或爬取频率太高都会被豆瓣ban掉，试试看添加请求头之类的办法能不能降低被ban的概率