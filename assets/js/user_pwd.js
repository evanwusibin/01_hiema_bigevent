$(function(){
    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        samepwd:function(value){
            if(value === $('[name=oldpwd]').val()) {
                return '新旧密码不能够相同哦~'
            }
        },
        repwd: function(value){
            if(value !== $('[name=newpwd]').val()) {
                return '两次密码需要一致哦'
            }
        },
    })


    $('.layui-form').on('submit',function(e){
        //提交事件都需要阻止默认提行为
        e.preventDefault()
        //发起ajax的POST请求
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                // console.log(res); 
                if(res.status !== 0) {
                    return layer.msg( '密码修改失败')
                }
                layer.msg('密码修改成功')
                //转换为原生DOM重置表单，只能通过原生的形式
                $('.layui-form')[0].reset()
                // form.val('',)
                
            }
        })
    })
})