var root = $('#rent-list');
var INDEX = 0;

$(window).on('load', function(e){
    getOnePage(INDEX);
})

$('#load-more').on('click', function(e){
    console.log(INDEX);
    getOnePage(INDEX);
})


// 分页获取数据
function getOnePage(index){
    $.ajax({
        url: 'getOnePage',
        type: 'get',
        data: {
            start: index,
            length: 15
        },
        success: onSuccess,
        error: onError
    })
    function onSuccess(res){
        console.log(res)
        if(res === 'end'){
            $('#load-more').text('没有更多了').off('click');
            return;
        }
        $.each(res, function(index, item){
            root.append(getHTML(item));
        })
        INDEX += 15;
        console.log(index);
        console.log('成功啦！')
    }
    function onError(){}
}


function getHTML(obj){
    var html = `<li>
                    <h1><a href="${obj.href}">${obj.title}</a></h1>
                    <h3>${obj.time}</h3>
                    <p>${obj.content}</p>
                    ${obj.image ? `<p class="has-image">帖中有图片</p>`:''}
                </li>`
    return html;
}