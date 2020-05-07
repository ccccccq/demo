//登陆时格式验证
var useId = 123; //假装是后段返回的用户编号
function loginTest(){
    var account = $("input.form-control")[0].value;
    var pwd = $("input.form-control")[1].value;
    if(emailCheck(account) || phoneCheck(account)) {
        //把邮箱手机号传给后端，后段返回用户编号
    this.location.href="http://localhost:63342/demo/drag-left.html?"+"useId="+encodeURI(useId);
    }
    else{
        alert("请输入正确格式的邮箱/手机号");
        return false;
    }
}
function emailCheck(email){
     var reg = /^([\w\.\-]+)\@(\w+)(\.([\w^\_]+)){1,2}$/;
     return reg.test(email);

}

function phoneCheck(phone){
    var reg = /^1\d{10}$/;
    return reg.test(phone);
}
//用户名格式校验
function usernameCheck(username){
    var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
    return   uPattern.test(username);
}

//得到用户的id
function getUserId(){
    var loc = location.href;
    var n1 = loc.length;//地址的总长度
    var n2 = loc.indexOf("=");//取得=号的位置
    return decodeURI(loc.substr(n2+1, n1-n2));//用户id
}
//跳转到注册表单
function register(){
    $(".modal-body.p-4.p-lg-5").hide();
    $(".modal-body.p-4.p-lg-5.register").show();
}
//注册后直接登录
function loginAfterRegister(){
    var pwd1 = $("input.form-control.pwdFir")[0].value;
    var pwd2 = $("input.form-control.pwdSec")[0].value;
    var userName = $("input.form-control.userName")[0].value;
    if(usernameCheck(userName)){
        if(pwd1 != pwd2){
            alert("两次填写的密码不一致");
        }
        else {
            //传给后端  如果邮箱或者用户名已经有了，就提示直接登录,返回用户编号
            // alert("您已经注册，请直接登陆")；
            location.href="create.html?"+"useId="+encodeURI(useId);
        }
    }
    else alert("4到16位（字母，数字，下划线，减号）");
}
function sendMail(){
    var account = $("input.form-control")[0].value;


}
