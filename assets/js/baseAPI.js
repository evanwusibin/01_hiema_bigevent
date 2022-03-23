
// 注意每次调用$.get() 或$.post()或$.ajax()的 时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    // console.log(options.url);
    // 发起真正的ajax请求之前统一拼接根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    //统一为有权限的接口设置headers请求头
    if(options.url.indexOf('/my/') !== -1){
    options.headers = {
        Authorization: localStorage.getItem('token') || ''
    }
   }



   //全局统一挂在 complete回调，给全局统一的ajax请求挂载这个
   options.complete = function(res){
    // 调用有权限接口需要用这个
    //阻止匿名登录不论成功还是失败最终都会调用complete
    console.log('执行了complete回调');
    //在complete回调函数中石油res.responseJSON拿到服务器响应胡来的数据
    if(res.reponseJSON.status === 1 && res.reponseJSON.message === '身份认证失败！'){
        // 1、强制清空 token
        localStorage.removeItem('token')
        // 2、强制跳转到登录界面
        location.href='./login.html'

    }
   }
})
