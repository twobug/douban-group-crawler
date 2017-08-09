//添加依赖
var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var express = require('express');

var app = express();
var doubanUrl = 'https://www.douban.com/group/temphouse/discussion?start=';

var pageUrls = [];

//获取前4页的列表的地址
for(i=0; i<4; i++){
    pageUrls.push(`${doubanUrl}${i*25}`);
    console.log(`正在获取第 ${i + 1} 页列表`)
}

// 抓取分页内容上的文章链接
console.log('正在解析文章列表...');
async.mapSeries(pageUrls, function(url, callback){
    superagent.get(url).end(function(err, res){
        if(err){
            console.log(err);
        }
        var urlArr = getUrlsFromHtml(res.text)
        callback(null, urlArr);
    })
}, function(err, result){
    var topicUrls = result.join().split(',');
    console.log('正在解析文章内容...');

    //抓取每个主题帖中的内容
    async.mapLimit(topicUrls, 4, function(url, callback){
        getInfoFromEachUrl(url, callback)
    }, function(err, result){
        console.log('数据解析完成！')
        // console.log(result);
        console.log(`本次共爬取了 ${result.length} 条文章数据`)

        //监听请求，发送数据,一次发送15条
        app.get('/getOnePage', function(req, res){
            var index = req.query.start;
            var length = req.query.length;
            console.log(index)
            if(index >= result.length){
                res.send('end');
                return;
            }
            else{
                console.log('先传15条')
                var arr = result.slice(index, (index+length));
                console.log(arr.length)
                res.send(arr);
            }
        })
    })
})

//将获取到的HTML内容中的文章链接都解析出来
function getUrlsFromHtml(html){
    var topicUrls = [];
    var $ = cheerio.load(html);
    $('.article .title a').each(function(index, value){
        var $element = $(value);
        href = $element.attr('href');
        topicUrls.push(href);
    })
    return topicUrls;
}

//对URL数组中的单个URL处理，获得该URL打开的文章标题和第一条评论
function getInfoFromEachUrl(topicUrl, callback){
    superagent.get(topicUrl).end(function(err, res){
        if(err){
            console.log(err);
        }
        var $ = cheerio.load(res.text);
        var jsonObj = {
            title: $('#content h1').text().trim(),
            href: topicUrl,
            content: $('#link-report .topic-content p').text().trim(),
            image: $('#link-report .topic-content .topic-figure img').eq(0).attr('src'),
            time: $('.topic-doc h3 .color-green').html()
        }
        callback(null, jsonObj);
    })
}

//APP目录设置为静态文件托管目录，里面存放前端页面内容
app.use(express.static('APP'));

app.listen(3000, function(){
    console.log('app is running at port 3000')
})