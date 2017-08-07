//添加依赖
var async = require('async');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var v2exUrl = 'https://www.douban.com/group/temphouse/discussion?start=0/';

superagent.get(v2exUrl).end(function(err, res){
    if(err){
        return console.error(err);
    }
    var topicUrls = [];
    getUrlsFromHtml(topicUrls, res.text)
    async.mapLimit(topicUrls, 4, function(url, callback){
        var delay = Math.floor(Math.random()*1000+1000);
        getInfoFromEachUrl(url, callback)
    }, function(err, result){
        console.log('final:')
        console.log(result);
    })
})

//将获取到的HTML内容中的文章链接都解析出来
function getUrlsFromHtml(Urls, html){
    var $ = cheerio.load(html);
    $('.article .title a').each(function(index, value){
        var $element = $(value);
        href = $element.attr('href');
        Urls.push(href);
    })
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