//鼠标初始化位置
var initMouseX = initMouseY = 0;
//元素的初始化位置
var initObjX = initObjY = 0;
//暂时的用户编号
var userId = 123;
//鼠标按下标识
var isDraging = false;
var moveX,moveY;
//复制的新元素
var newEle;
//撤回的那个元素
var undoEle;
//移动的实体
var cloneEle;
var x,y;
var rightX,rightY;
var objX,objY;
//中间框框距离左上的距离以及框框长度
var desTop = $(".gain").offset().top;
var desLeft = $(".gain").offset().left;
var desWidth =  $(".gain").width();
var desHeight  =  $(".gain").height();
//是否是从外到内移动的
var regionMove =true;
//鼠标右键重写
// $(document).ready(function(){
//
// })
//左边种类展示的变成立即执行函数字
(function show(){
    //接口 localhost:1337/comp-configs 返回数据库中的组件类别
    var comp_data_callback = $.ajax({url:"http://localhost:1337/comps",async:false});
    //得到组件分类
    var comp_data = eval(comp_data_callback.responseText);
    //按照组件类别分好的对象
    var comp_lists ={};
    for(var i = 0;i < comp_data.length;i++)
    {
        var tempdata = comp_data[i].comp_class;
        //得到每一种种类的组件 且状态码为1
        var tempUrl =  "http://localhost:1337/Comp-Configs?comp_class="+ tempdata +"&comp_status="+1;
        var comps = $.ajax({url:tempUrl,async:false});
        var resp = eval(comps.responseText);
        comp_lists [tempdata] = resp;
        $(".compo ul").append("<li class= "  + comp_data[i].comp_class +">" + comp_data[i].compclass_name +"</li>")
        $(".compo > div").append("<div class= " + comp_data[i].comp_class + "></div>");
        $(".compo > div > div").addClass("showBox");
        for(var j=0;j<resp.length;j++){
            //把一类别组件添加到给类别中
            $(".showBox." + comp_data[i].comp_class).append("<div class=" + resp[j].comp_name + ">" + resp[j].comp_code + " </div>");
            $(".showBox." + comp_data[i].comp_class ).css("display","none");
        }
    }
}());
$(window).load(function(evt) {
    var rcm = window.RMenu;
    rcm.init({
        area:'body',
        items:{
            "copy":{name:"复制",icon:'copy'},
            "del":{name:"删除",icon:'trash-o'},
            "paste":{name:"粘贴",icon:'paste'},
            "undo":{name:"撤回",icon:'undo'}
        },
        callback:function(res){
            if(res.data == 'paste'){
                if(newEle && newEle.hasClass("disNone"))
                    newEle.css("display","");
                //变成原来的样式
                newEle.appendTo(".gain");
                $(document).unbind('mousedown').unbind('mouseup'); }
            else if(res.data == 'undo'){
                if(undoEle)
                //撤回
                    undoEle.css("display",""); }
            $('.draggable').each(function(){
                objX = $(this).offset().left  ;
                objY = $(this).offset().top ;
                var width = $(this).width();
                var height = $(this).height();
                $(document).mousedown(function(event){ //获取鼠标按下的位置
                    if(event.which == 3 ){
                        rightX = event.pageX;
                        rightY = event.pageY;
                    }
                });
                if( rightX<objX +width && rightX >objX && rightY<objY+height && rightY>objY ){
                    if(res.data == 'del') {
                        undoEle = $(this);
                        $(this).addClass("disNone"); //暂时隐藏
                    }}
                else  if(res.data == 'copy'){
                    newEle =  cloneEle.clone(true);
                    $(document).mousedown(function(event){ //获取鼠标按下的位置
                        x = event.pageX;
                        y = event.pageY;
                    });
                    $(document).mouseup(function(event){//鼠标释放
                        newEle.css("left",x );
                        newEle.css("top",y );
                    })
                }
            })
        }
    })
    //点击后显示相应区域内容
    $(".draggable").attr("isDrag",false);
        $(".draggable").each(function(index,elem){
            $(".draggable:eq("+index+")").on("mousedown",function(evt){
                evt.preventDefault();
                //鼠标初始化位置
                initMouseX = evt.pageX;
                initMouseY = evt.pageY;
                regionMove = false;
                if(!$(this).hasClass('cloneEle')) {
                    cloneEle = $(this).clone(true);
                    cloneEle.addClass("cloneEle");
                    $(this).before(cloneEle);
                    regionMove = true;
                }
                //元素的初始化位置
                initObjX = $(this).offset().left;
                initObjY = $(this).offset().top;
                $(this).attr("name","" + userId + getDate());
                //鼠标按下标识
                cloneEle.attr("isDrag",true)
            }).on("mousemove",function(evt){
                // evt.preventDefault();
                if (cloneEle && cloneEle.attr("isDrag") == "true") {
                    // 改变位置
                    moveX = evt.pageX - initMouseX + initObjX; //移动的X的位置
                    moveY = evt.pageY - initMouseY + initObjY;   //移动的Y的位置
                    //设置元素位置
                    $(this).css("left",moveX);
                    $(this).css("top",moveY);
                }
            }).on("mouseup",function(evt){
                $(this).attr("isDrag",false);
                if(moveX < desLeft) moveX = desLeft;
                if(moveY < desTop) moveY = desTop;
                if(moveX > desLeft + desWidth - $(this).width())
                    moveX = desLeft + desWidth - $(this).width();
                if(moveY > desTop + desHeight - $(this).height())
                    moveY = desTop + desHeight - $(this).height();

                $(this).css("left",moveX);
                $(this).css("top",moveY); //移到外面就默认到格子中那行那列
                //调用函数addEdit 入参：当前组件品种 返回：相应编辑区的代码
                if(regionMove){
                    $(this).appendTo(".gain");
                    addEdit($(this))
                }

            })
        })
    });

$(".compo ul li").click(function(){
    var indexLi = $(this).index();
    $(".showBox").eq(indexLi).css("display","");
    $(".showBox").not($(".showBox").eq(indexLi)).css("display","none");
})

//得到当前的时间
function getDate(){
    var now = new Date();
    return now.getTime();
}
//得到界面中的代码
function getCode(){
    var obj = $(".gain").children();
    for(var i=0;i<obj.length;i++){
        console.log(obj[i]);
    }
}

//返回编辑区代码，并渲染
function addEdit(kind){
   var type  = kind.attr("class").split(" ")[0];
   //传给后台 type      得到代码str
   var tempUrl =  "http://localhost:1337/Edit-Configs?edit_compo="+ type;
    var editcode = $.ajax({url:tempUrl,async:false});
    var resp = eval(editcode.responseText);
    $(".edit-container").html(resp[0].edit_code);
    $(".edit-input-fontvalue").change(function(){
        var value = $(".edit-input-fontvalue").val();
        kind.val(value) ;
    })
    $(".edit-text-value").change(function(){
        var value = $(".dit-text-value").val();
        kind.text(value) ;
    })
    $(".edit-text-size").change(function(){
        var value = $(".edit-text-size").val();
        kind.css("font-size",value + "px");
    })
}


