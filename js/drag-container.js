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
var finalcode1 = '';
//网页标题是否已经存在


var dafalutwebinfos =  $.ajax({url:"http://localhost:1337/web-infos?user_id="+userId ,async:false});
if(eval(dafalutwebinfos.responseText)[0]){
    dafalutwebinfosarray = eval(dafalutwebinfos.responseText)[0];
    $(".pagename").val(dafalutwebinfosarray.web_title);
    $(".keywords").val(dafalutwebinfosarray.web_vital);
    $(".domain").val(dafalutwebinfosarray.web_page)
}

$.putJSON = function(url,data,callback){
    $.ajax({
        url: url,
        type: 'PUT',
        data:data,
        success: function(msg) {
            callback(msg);
        }
    });

};
$.deleteJSON = function(url,data,callback){
    $.ajax({
        url:url,
        type:"delete",
        contentType:"application/json",
        dataType:"json",
        data:data,
        success:function(msg){
            callback(msg);
        },
        error:function(xhr,textstatus,thrown){

        }
    });
};


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
            $(".showBox." + comp_data[i].comp_class).append("<div class=" + resp[j].comp_name + ">" + resp[j].comp_code + " </div><hr>");
            $(".showBox." + comp_data[i].comp_class ).css("display","none");
        }
    }
    var gaindata =  $.ajax({url:"http://localhost:1337/Userwork-temps?user_id=" + userId ,async:false});
    if(eval(gaindata.responseText)[0]){
        $(".gain").html(eval(gaindata.responseText)[0].web_code);
    }
}());
// $(".edit-container").load("test.html");
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
 //公共函数，可以是否已经有数据，无则添加，有则更新
function refreshsave(name,data,callback1,callback2) {
    var jsondata = JSON.stringify(data);
    var userwork_temp = $.ajax({url: "http://localhost:1337/" + name + "?user_id=" + userId, async: false});
    if (eval(userwork_temp.responseText)[0]) {
        var userwork_temp_id = eval(userwork_temp.responseText)[0].id;
    }
    // 如果是web-infos 转发端口
    if (name == "web-infos") {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://localhost:5000/" + name,
                data: JSON.stringify(data),
                success: callback1
            })
        }
        //数据库中已经存在数据
        if (userwork_temp_id) {
            $.putJSON("http://localhost:1337/" + name + "/" + userwork_temp_id,
                data, callback1);
        }
        else {
            $.post("http://localhost:1337/" + name,
                data, callback2);
        }
        return data;
}
//每隔5分钟自动保存
setInterval(function(){
    var obj = $(".gain").children();
    var finalcode = "";
    for (var i = 0; i < obj.length; i++) {
        finalcode += obj[i].outerHTML;
    }
    var data = {
        user_id:userId,
        web_code: finalcode
    }
    finalcode1 = refreshsave("Userwork-temps",data,function(data){
        //返回的数据
        alert("您的网页已经重新暂存成功");
    },function(data){
        //返回的数据
        alert("您的网页已经暂时保存成功");
    }).finalcode;
    },50000);

$(".compo ul li").click(function(){
    var indexLi = $(this).index()-1;
    $(".showBox").eq(indexLi).css("display","");
    $(".showBox").not($(".showBox").eq(indexLi)).css("display","none");
})
//得到页面中的代码
$(".save").click(function(){
    var obj = $(".gain").children();
    var finalcode = "";
    for (var i = 0; i < obj.length; i++) {
        finalcode += obj[i].outerHTML;
    }
    var data = {
            user_id:userId,
            web_code: finalcode
    }
    finalcode1 = refreshsave("Userwork-temps",data,function(data){
        //返回的数据
        alert("您的网页已经重新暂存成功");
    },function(data){
        //返回的数据
        alert("您的网页已经暂时保存成功");
    }).finalcode;
})

//生成代码
$(".createCode").click(function() {

    var flag = copyText(finalcode1);
    if (flag) {
        alert("代码已复制至剪切板");
    }
    else {
        alert("复制失败");
    }
})
function copyText(text) {
    var textarea = document.createElement("input");//创建input对象
    var currentFocus = document.activeElement;//当前获得焦点的元素
    document.body.appendChild(textarea);//添加元素
    textarea.value = text;
    textarea.focus();
    textarea.select();
    try {
        var flag = document.execCommand("copy");//执行复制
    } catch(eo) {
        var flag = false;
    }
    document.body.removeChild(textarea);//删除元素
    currentFocus.focus();
    return flag;
}
//得到当前的时间
function getDate(){
    var now = new Date();
    return now.getTime();
}
//返回编辑区代码，并渲染
function addEdit(kind){
   var type  = kind.attr("class").split(" ")[0];
   $("."+type).show();
    switch (type) {
        case "edit-text":{
            $(".edit-text-eventadd").click(function(){
                var str = "<form class='edit-text-eventlistener'> <select name='event'> <option value='click' selected >点击事件</option>  "+
                    "<option value='hover'>覆盖事件</option></select> "+
                    "<div class='edit-text-event'>  "+
                    "<input type = 'text' class='edit-text-clickhref'  placeholder='输入页面跳转链接'> "+
                    "<input type = 'text' class='edit-text-hover-color' style='display: none' placeholder='输入rgb格式颜色'></div></form>"
                $(".edit-text-eventContainer").append(str);
            })
            //表单内字体修改
            $(".edit-input-fontvalue").change(function(){
                var value = $(".edit-input-fontvalue").val();
                kind.val(value) ;
            })
            //文本值修改
            $(".edit-text-value").change(function(){
                var value = $(".edit-text-value").val();
                kind.text(value) ;
            })
            //文本字体大小
            $(".edit-text-size").change(function(){
                var value = $(".edit-text-size").val();
                kind.css("font-size",value + "px");
            })
            //字体颜色修改
            $(".edit-text-color").change(function(){
                var value = $(".edit-text-color").val();
                kind.css("color",value);
            })
            //字体样式
            $(".edit-text-fontstyle").change(function(){
                var value = $(".edit-text-fontstyle").val();
                kind.css("font-style",value);
            })
            $(".edit-text-fontfamily").change(function(){
                var value = $(".edit-text-fontfamily").val();
                kind.css("font-family",value);
            })
            $(".edit-text-fontweight").click(function(){
                $(this).attr("checked","checked");
                $(".edit-text-fontweight").not($(this)).removeAttr("checked");
                var value = $(this).val();
                     switch (value) {
                         case '更细':
                             kind.css("font-weight","lighter");
                             break;
                         case '正常':
                             kind.css("font-weight","normal");
                             break;
                         case '更粗':
                             kind.css("font-weight","bolder");
                             break;
                     }
                })
            var text_value = "click";
            $(".edit-text-clickhref").show();
            $("select").change(function () {
                text_value  = $(".edit-text-eventlistener option:selected").val();
                if(text_value  == "hover"){
                    $(".edit-text-hover-color").show();
                    $(".edit-text-clickhref").hide();
                }
                else {
                    $(".edit-text-hover-color").hide();
                    $(".edit-text-clickhref").show();
                }
            });
            $(".edit-text-hover-color").change(function(){
                var value = $(".edit-text-hover-color").val();
                kind.hover(function(){
                    kind.css("color",value);
                })
                kind.mouseleave(function(){
                    kind.css("color","");
                });
            })
            $(".edit-text-clickhref ").change(function(){
                var value = $(".edit-text-clickhref").val();
                kind.click(function(){
                    window.location.href = value;
                })
            })

            break;
        }
        case "edit-text":

            break;
    }
}
//传给页面配置表
$(".confirm-keywords").click(function(){
    var title = $(".pagename").val();
    var vital = $(".keywords").val();
    var obj = $(".gain").children();
    var finalcode = "";
    for (var i = 0; i < obj.length; i++) {
        finalcode += obj[i].outerHTML;
    }
    if(title) {
        var keyArr = $(".keywords").val().trim().split(/\s+/);
        var data = {
            web_extIp: "www.dragisall.top/" + userId,
            created_at: getDate(),
            updated_at: getDate(),
            web_interip: "123.0.0.1",
            web_page: "www.dragisall.top/" + userId,
            web_code: finalcode,
            web_vital: vital,
            web_title: title,
            web_lastUpdate: getDate(),
            web_filename: '' + userId + title,
            web_status: 1,
            web_remarks: null,
            user_id: userId
        }
        refreshsave("web-infos", data,function(data){
            alert("您的网页已经重新配置成功，请在弹出框内确认您的域名");
            $(".domain").val(data.web_extIp);
        },function(data){
            //返回的数据
            alert("您的网页已经配置成功");
            $(".domain").val(data.web_extIp);
        });
    }
    else{
        alert("标题必须输入！");
    }
});
$(".lastPage").click(function(){
   location.href="http://localhost:63342/demo/index.html?"+"useId="+encodeURI(userId);
})
$(".nullall").click(function(){
    $(".gain").empty();
    alert("页面即将清空。我们不会将清空结果保存，如果您确定清空页面，请再次点击保存。")
})