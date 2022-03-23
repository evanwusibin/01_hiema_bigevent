$(function(){
    // 点击去注册账号
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })


    // 点击去登录链接
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象 导入了layui的js文件就可以用了
    var form = layui.form
    var layer = layui.layer
    // 通过form.verify()自定义效验规则
    form.verify({
        //自定义username
        username: function(value){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
              return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
              return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
              return '用户名不能全为数字';
            }
            
            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if(value === 'xxx'){
              alert('用户名不能为敏感词');
              return true;
            }
          },
        //自定义pass效验规则
        pass:[/^[\S]{6,12}$/,'密码必须6到12位,且不能出现空格'],
        // 效验密码是否一致的规则
        repass:function(value){
            //通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败就return 一个提示消息
            var pass = $('.reg-box [name=password]').val()
            if(pass !== value) {
                return '两次密码不一致'
            }
        } 
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        //阻止表单的默认提交行为 action有默认提交行为
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',data,function(res){
        // console.log(res);
        if(res.status !== 0) {
            // return console.log('res.message');
            return layer.msg(res.message)
        }
         layer.msg('注册成功！');
        //模拟人的注册行为
         $('#link_login').click()
        })
    })


    // 监听登录表单的提交

    $('#form_login').submit(function(e){
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/api/login',
            // 快速获取表单中的数据
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                console.log(res.token);

                //将登录成功得到的token字符串保存到localStorage
                // 后续申请有权限的接口需要用 在 接口测试工具里面 Authorization  把接口复制进来
                localStorage.setItem('token',res.token)



                //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })












})