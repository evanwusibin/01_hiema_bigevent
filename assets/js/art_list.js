$(function(){

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    //导入模板引擎就可以了
    template.default.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() +1)
        var d = padZero(dt.getDate())

        var hh =  padZero(dt.getHours())
        var mm =  padZero(dt.getMinutes())
        var ss =  padZero(dt.getSeconds())

        return y+ '-' + m + '-' + d  + ' ' + hh + ':' + mm + ':' +  ss
    }


    //定义一个不补充0 的函数
    function padZero(n) {
        return n>9? n : '0' + n 
    }



    //定义一个查询的参数对象，将来请求数据的时候，将请求对象数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum:1, //页码值。默认请求第一页数据
        pagesize:2,//没eye显示几条数据，默认每页显示2条
        cate_id:'',//文章分类id
        state:'',// 文章发布
    }


    // 定义完一行调用方法，定义好函数不调用就扥与空
    initTable()
    initCate()


    //获取前文章列表数据的方法【出现死循环原因，jump回调函数】
    function initTable(){
        $.ajax({
            method:'GET',
            url:'my/article/list',
            data: q,
            success:function(res){
                if(res.status !==0) {
                    return layer.msg('获取新闻列表失败！')
                }
                layer.msg('获取新闻列表成功')
                // 把取到的数据用模板引擎渲染到列表里面
                // 使用模板引擎获取数据,第一个参数是id名称不要#需要渲染的地址，第二个参数是需要渲染的数据
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)


                //把表格初始化完成之后就要调用渲染分页的方法
                renderPage()
                //调用了这个，然后这个函数里面又调用了laypage.render函数，形成一个死循环【原因】

            }
        })
    }

    // 获取文章分类列表初始化文章分类方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status !==0) {
                    return layer.msg('获取分类数据失败!')
                }
                //return layer.msg('获取数据成功！')
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate',res)
                //将页面渲染到 指定的标签内部
                $('[name=cate_id]').html(htmlStr)
                //但是没有渲染出来，由于浏览器的渲染机制导致的
                //调用form.render方法通知浏览器重新渲染表单
                form.render(res.total)
            }
        })
    }

    //给form的button绑定一个submit提交事件，就能把数据提交
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        //获取表单中选中向项的值、
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        //为查询参数中q属性赋值
        q.cate_id = cate_id
        q.state = state
        //工具最新的筛选条件，重新渲染表格数据
        initTable()



    })


    //定义渲染分页的方法，以后遇到了分页直接用这个方法就可以了
    //当表格被渲染完成以后再渲染分页方法
    function renderPage(total){ //新参
        // console.log(total);
        //调用 laypage.render()方法来渲染分页结构，就会触发jump回调
        laypage.render({
            elem:'pageBox', //分页容器id
            count:total, //总数据条数
            limit:q.pagesize, //每页显示几条数据
            //指定了总数据条数又有每条数据，自动进行除法计算算出页数
            curr:q.pagenum, // 来指定设置默认被选中的分页
            layout:['count','limit','prev','page','next','skip'], //多余的分页效果上一页下一页
            limits:[2,3,5,10], //设置下拉菜单的默认值





            //触发jump回调的方式有两种
            // 1、点击页码的时候，会触发jump回调
            // 2、只要调用了laypage.render方法就会触发jump回调


            //解决【jump死循环】方法：在这里加一个判断，如果是第二种就不调用initTable方法
            jump:function(obj,first){ //分页发生切换除法的jump回调
                //可以通过first值来判断是哪种方式触发的jump的值
                //如果first的值为true就是方式2，如果是false就是第一种触发方式就调用initTable
                console.log(first);
                console.log(obj.curr);
                q.pagenum = obj.curr //把最新的页码值赋值到q的查询对象

                //把最新的条目数赋值到q这个查询参数的pagesize属性
                q.pagesize = obj.limit
                //实际上原理就是切换条目的时候本质上也会触发一次jump回调在回调中通过obj.limit拿到这个属性
                //找到最新的条目数，赋值到q.pagesize属性中发起初始化table就可以了


                // initTable() //重新把新的页码的数据渲染表格，获取对应的数据列表并且渲染表格
                //但是这样写就会发生发生死循环, jump回调一直在不断被触发
                if(!first) {
                    //通过laypage.render的方法触发的函数用第一种方法
                    layer.msg('jump回调成功！')
                    initTable()
                }

            }
        })


    }



    // 删除文章的功能，给删除按钮绑定点击事件 注意刷新列表数据
    //通过代理的形式为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete',function(){
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        console.log(len);
        //获取到文章的id
        var id = $(this).attr('data-id')
        console.log('ok');
        //询问用户是否要删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method:'GET',
                url:'/my/article/delete/' + id,   //:是一个动态参数
                success:function(red){
                    if(res.status !==0) {
                        return layer.msg('删除新闻失败')
                    }
                    layer.msg('删除新闻成功')
                    // 当数据删除完成之后，需要判断当前这一个页面中，是否还有剩余遇到数据
                    // 如果没有剩余数据，则让页码值 -1
                    // 再重新调用initTable方法



                    if(len ===1) {
                        //如果len的值 =1 证明值删除完毕之后，页面上就没有任何数据了
                        //页码值最小必须十是1，需要先判断是否是1，三元表达式
                        q.pagenum = q.pagenum ===1 ? 1 : q.pagenum-1
                    }

                    initTable()
                    //删除成功之后需要重新渲染列表table中的数据
                }
            })
            
            layer.close(index);
          });
    })













})