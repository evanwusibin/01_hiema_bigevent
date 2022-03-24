$(function(){
    var form = layui.form
    var layer = layui.layer


    // layui里面验证表单的信息需要导入layui的js以及实现定义好layui.form
    form.verify({
        nickname:function(value){
            if(value.length > 6){
                return '昵称长度必须在 1-6 个字符之间'
            }
        }
    })



    initUserInfo()
    //初始化用户信息
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                //调用form.val快速给表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }


    //重置表单的数据，表单的按钮事先一定要先阻止浏览器默认提交行为 安妮需要先设置 submit name type
    $('#btnReset').on('click',function(e){
        //阻止默认表单重置行为
        e.preventDefault();
        //重新获取用户信息，重新提交表单
        initUserInfo()
    })


    //表单数据的提交  监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        //阻止表单的默认提交行为
        e.preventDefault()
        //发起ajax请求，把信息提交到后台
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            //快速拿得到表单内部的数据 对于form表单使用 serialize()方法快速获取表单数据
            data:$(this).serialize(),          
            success:function(res){
                if(res.status !==0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                //调用父页面的方法，重新渲染用户的头像和用户信息
                window.parent.parent.getUserInfo()
                // window.parent.rendarAvatar()
            }
        })
    })




})