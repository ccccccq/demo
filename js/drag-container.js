//鼠标初始化位置
var initMouseX = 0;
var initMouseY = 0;
//元素的初始化位置
var initObjX = 0;
var initObjY = 0;
//暂时的用户编号
var userId = 123;
//鼠标按下标识
var isDraging = false;
var moveX;
var moveY;
//复制的新元素
var newEle;
var x,y;
var rightX,rightY;
var objX,objY;
//中间框框距离左上的距离以及框框长度
var desTop = $(".gain").offset().top;
var desLeft = $(".gain").offset().left;
var desWidth =  $(".gain").width();
var desHeight  =  $(".gain").height();
//撤回的那个元素
var undoEle;
//移动的实体
var cloneEle;

//鼠标右键重写
$(document).ready(function(){
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
                undoEle.css("display",""); //撤回

            }
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
                    if(res.data == 'del')
                    {
                       undoEle = $(this);
                        $(this).addClass("disNone"); //暂时隐藏
                    }
                }
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
})


window.addEventListener(
    "load",
    function(evt) {
        $(".draggable").attr("isDrag",false);
        $(".draggable").each(function(index,elem){
            $(".draggable:eq("+index+")").on("mousedown",function(evt){
                evt.preventDefault();
                //鼠标初始化位置
                initMouseX = evt.pageX;
                initMouseY = evt.pageY;
                if(!$(this).hasClass('cloneEle')) {
                    cloneEle = $(this).clone(true);
                    cloneEle.addClass("cloneEle");
                    cloneEle.appendTo(".input_form");
                }
                //元素的初始化位置
                initObjX = $(this).offset().left;
                initObjY = $(this).offset().top;
                $(this).attr("name","" + userId + getDate());
                //鼠标按下标识
                $(this).attr("isDrag",true)
            }).on("mousemove",function(evt){
                if (cloneEle && $(this).attr("isDrag") == "true") {
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
                $(this).appendTo(".gain");
                //调用函数addEdit 入参：当前组件品种 返回：相应编辑区的代码
                addEdit($(this).attr("class").split(" ")[0])
            })
        })

    },
    false
);
var comp_codes = [
    "<input type='text' class='input-text draggable'  value='本文'>",
    "<input type='text' class='input-text draggable'  value='本文'>" ]
var len = $(".compo").children().length;
for(var i =0;i<len;i++){
    var html ="";
    //调用后端服务，入参：comp_style 回：comp_status=1 的comp_code 的数组
    for(var j=0;j<comp_codes.length;j++){
        $(".compo").children()[i].innerHTML += comp_codes[j];
    }
}
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
   //传给后台 kind
  // 得到代码
  var str = '<p>32313</p>';
  $(".edit").html(str);
}
