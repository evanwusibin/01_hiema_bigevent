$(function(){
    var layer = layui.layer
    var form = layui.form


    initArtCateList()

    //获取文章分类列表，快速渲染表格里面的数据 采用art-template
    function initArtCateList(){
        $.ajax({
            method:'GET',
            ur:'/my/article/cates',
            success: function(res){
                // console.log(res);
                // 前者是需要渲染的大标签的id名字，不要加#，后者是服务器返回来的数据
                // 然后拿到tbody的标签采用html方法渲进来
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }


    //为添加类别绑定的点击事件，打开弹出层
    // 根据索引打开弹出层
    var indexAdd = null
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type:1,
            area:['500px','250px'],
            title:'添加新闻分类',
            //html是用来渲染页面的
            content:$('#dialog-add').html()
        })

    })

    //通过代理的形式为 form-add绑定submit事件  事件委托，因为是动态添加的元素
    // 找一个在页面中存在的，一般是父元素，代理到form-add,绑定提交表单事件
    // 注意阻止默认提交行为 ajax的post请求
    $('body').on('submit','form-add',function(e){
        e.preventDefault()
        console.log('ok');
        $.ajax({
            method:'POST',
            url:'/my/article/addcates',
            //快速获取到表单中的数据 使用 serialize快速获取
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0 ) {
                    return layer.msg('添加新闻类别失败')
                }
                //新增就重新小于渲染一遍
                initArtCateList()
                layer.msg('新增分类成功')
                
                
                //根据索引关闭对应的弹出层
                layer.close(indexAdd)

                 
            }
        })

    })

    //通过代理 事件委托 为btn-edit按钮绑定点击事件
    $('tbody').on('click','btn-edit',function(e){
        console.log('ok');
        //弹出一个修改文字分类信息的层
        indexEdit = layer.open({
            type:1,
            area:['500px','250px'],
            title:'修改新闻分类',
            //html是用来渲染页面的
            content:$('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        //发起请求获取对应的分类数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates/' + id,
            success:function(res){
                console.log(res);
                form.val('form-edit',res.data)

            }
        })




    })

    //通过代理的形式为修改分类的表单绑定 submit事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) {
                    return layer.msg(('更新分类新闻失败'))
                }
                layer.msg('更新新闻分类成功')
                //关闭弹出层
                layer.close(indexEdit)
                //刷新内容数据
                initArtCateList()
            }
        })
    })


    //通过代理的形式给删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(e){
        // console.log('ok');
        var id = $(this).attr('data-id')


        //提示用户是否要删除,调用服务器接口在服务器删除重新渲染到页面就会少一个
        //eg1
    layer.confirm('真的要删除吗?', {icon: 3, title:'提示'}, function(index){
    //do something
    $.ajax({
        method:'GET',
        url:'/my/article/deletecase/' + id,
        success: function(res){
            if(res.status !==0) {
                return layer.msg('删除新闻失败')
            }
            layer.msg('删除分类成功！')
            layer.close(index)
            initArtCateList()
        }
    })
    
    layer.close(index);
  });
    })
})