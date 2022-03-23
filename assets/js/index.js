$(function(){
    //获取用户基本信息
    getUserInfo()
    $('#btnLogout').on('click',function(){
        var layer = layui.layer
        // console.log('ok');
        //提示用户是否确认退出
        layer.confirm('真的要离我而去吗?', {icon: 3, title:'提示'}, function(index){
            //do something
            //1、清空本地存储的token
            localStorage.removeItem('token')
            //2、重新跳转登录页面
            location.href = './login.html'
            //关闭confirm询问框
            layer.close(index);
          });
    })
})


//获取用户基本信息
function getUserInfo(){
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象  优化在baseapi里面
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // }
            // 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUxMzUsInVzZXJuYW1lIjoid3VzaWJpbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiIiLCJlbWFpbCI6IiIsInVzZXJfcGljIjoiIiwiaWF0IjoxNjQ4MDMyNjA5LCJleHAiOjE2NDgwNjg2MDl9.aUy6lh_U9HnvVJwikGciJngrduOkKnht5bXk1e4x4kY'
        
        success: function(res){
            console.log(res);
            if(res.status !==0){
                return layui.layer.msg('获取用户信息失败')
            } 
            //调用 rendarAvatar渲染用户头像
            rendarAvatar(res.data)
        },
        // 调用有权限接口需要用这个
        //阻止匿名登录不论成功还是失败最终都会调用complete
        // complete: function(res){
        //     console.log('执行了complete回调');
        //     //在complete回调函数中使用res.responseJSON拿到服务器响应胡来的数据
        //     if(res.reponseJSON.status === 1 && res.reponseJSON.message === '身份认证失败！'){
        //         // 1、强制清空 token
        //         localStorage.removeItem('token')
        //         // 2、强制跳转到登录界面
        //         location.href='./login.html'

        //     }
        // }
    })
}

// 渲染用户头像
function rendarAvatar(user){
    // 1、获取用户昵称
    var name = user.nickname || user.username
    // 2、设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3、按需求渲染用户头像
    if(user.user_pic !== null) {
        //渲染
        $('.layui-nav-img').attr('src',user.user_pic).show()
    }else {
        //  渲染文本头像
        // return layui.layer.msg('请添加头像')
        // 实际上需要渲染文本头像，需要在图片后面加上一个标签里面写上字母加上背景 边角为50px的圆形头像
        $('.layui-nav-img').hide() 
        // 获取到用户名的第一个字符
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
   
}
