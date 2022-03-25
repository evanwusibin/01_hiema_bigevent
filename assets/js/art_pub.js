$(function(){
    var layer = layui.layer
    var form = layui.form
    initCate()
    // 初始化富文本编辑器
    initEditor()




    //定义加载文章分类的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !==0) {
                    return layer.msg('初始化新闻分类获取失败！')
                }
                layer.msg('新闻获取成功！')
                //调用模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate',res)
                //把数渲染进来
                $('[name=cate_id]').html(htmlStr)
                //一定要记得调用form.render方法循环调用进来
                form.render()

            },

        })
    }



    // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)


  //为选择封面的按钮绑定点击事件区域,注意input是隐藏的，所以点击button是模拟了点击input的行为
  $('#btnChooseImage').on('click',function(){
    $('#coverFile').click()
  })

  //监听coverFile的change事件，获取用户选择的文件列表
  $('#coverFile').on('change',function(e){
    //获取到文件的列表数组
    var files = e.target.Files
    //判断用户是否选择了文件
    if(files.length == 0){
        return 
    }
    //根据文件创建对应的url地址
    // var file = e.target.files[0]
    var newImgURL = URL.createObjectURL(files[0])

    // 为裁剪区域重新赋值图片
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
  })


  // 定义文章发布状态，默认是已发布
  var art_state = '已发布'
  //为存为草稿按钮绑定点击事件处理函数
  $('#btnSave2').on('click',function(){
      art_state = '草稿' //触发了这个点击事件就把状态设置为草稿
  })


  //为表单绑定submit提交事件
  $('#form-pun').on('submit',function(e){
    //1、阻止表单的默认提交行为 ，只有submit才需要阻止其他都不需要
    e.preventDefault()

    //2、基于form表单快速创建FormData对象  ,通过下面这个方法创建原生的form对象
    var fd = new FormData($(this)[0])
    // 将文章的发布状态存到fd中
    fd.append('state',art_state)  //前面是名字后面是真正的值的名字

    //循环打印对象，证明里面有数据,打印里面的每一个键值对
    // fd.forEach(function(v,k){
    //     console.log(k,v);
    // })



    //4、将封面裁剪过后的图片输出为一个图片对象
        $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
    })
    .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
    // 得到文件对象后，进行后续的操作

    // 5将文件对象存储到 fd中
    fd.append('cover_img',blob)


    //6、发起ajax数据请求，把表单发布到服务器实现文章的添加功能

    //调用方法
    publishArticle(fd)



    })
  })

  //定义一个发表文章的方法
  function publishArticle(fd){
    $.ajax({
        method:'POST',
        url:'/my/article/add',

        //注意，如果是向服务器提交 FormData格式的数据
        // 必须添加以下两个配置项

        data:fd,
        contentType:false,
        processData:false,
        //如果不加以上两个属性该请求就会失败


        success:function(res){
            if(res.status !== 0) {
                return layer.msg('发布新闻失败!')
            }
            layer.msg('新闻发布成功！')
            //重新跳转到文章列表页面

            //发布文章成功后条跳转到文章列表页面
            location.href = './article/art_list.html'

        },
    })
  }




})