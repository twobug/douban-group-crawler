var root = $('#rent-list');
$.ajax({
    url: 'getDetail',
    type: 'get',
    success: onSuccess,
    error: onError
})

function onSuccess(res){
    root.append(JSON.stringify(res[0]));
    console.log(res);
    console.log('成功啦！')
}

function onError(){}