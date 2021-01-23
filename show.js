"ui";
var appName = "阿狗";
const appId="01";
var isInTime=false;
var file_path = "/sdcard/1.log";
const UI_version="1.0.0";

var apiURL = "http://119.3.12.149/api/";
var device_num = device.getAndroidId();
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var nowTime = new Date().Format("yyyy-MM-dd HH:mm:ss");

let isLogin=false;
let OutTimeTip="阿狗登录失效(点击更新)"
let workThread=null; 
let STORAGE=storages.create("阿狗控制")
let backTag=false;


ui.statusBarColor("#FF4FB3FF")
ui.layout(
    <drawer id="drawer">
        <vertical>
        <appbar>
            <toolbar id="toolbar" bg="#ff4fb3ff" title="{{appName}}"/>
        </appbar>
        <vertical gravity="center" layout_weight="1">
            <card w="*" h="68" margin="10 8" cardCornerRadius="6dp" cardElevation="2dp" gravity="center">
                <linear>
                    <vertical margin="10" layout_gravity="center_vertical" layout_weight="1">
                        <text id="name" size="18" color="#444444" text="未登录"/>
                        <text id="integral"  padding="1" size="16" text="{{nowTime}}" foreground="?selectableItemBackground"/>
                    </vertical>
                    <button id="login" w="90" text="登录账号" color="#ff5d85ff" style="Widget.AppCompat.Button.Borderless.Colored"/>
                </linear>
            </card>

            <vertical padding="10 6 0 6" bg="#ffffff" w="*" h="auto" margin="0 5" elevation="1dp">
                <Switch id="autoService" w="*" checked="{{auto.service != null}}" textColor="#666666" text="无障碍服务"/>
                <View h="5"/>
                <Switch w="*" textColor="#666666" text="免费福袋" id="runFD"/>
            </vertical>

            <vertical margin="0 5" bg="#ffffff" elevation="1dp" padding="5 5 10 5" w="*" h="auto">
                <linear>
                    <checkbox id="runYH" text="抖音养号" layout_weight="1"/>
                    <text text="单次运行时间(分钟)↓"/>
                </linear>
                <linear>
                    <seekbar id="YHseekbar" max="50" layout_weight="1"/>
                    <text gravity="center" id="YHlimit"/>
                </linear>
                <View h="5"/>
                <linear gravity="center">
                    <checkbox id="KScheck" text="抖音福袋" layout_weight="1"/>
                    <text text="单次运行时间(分钟)↓"/>
                </linear>
                <linear>
                    <seekbar id="FDseekbar" max="50" layout_weight="1"/> 
                    <text gravity="center" id="FDlimit"/>
                </linear>
            </vertical>
            
            <linear>
                <text layout_weight="1" size="19" color="#222222" text="日志"/>
                <button id="tolog" h="40" text="全部日志" style="Widget.AppCompat.Button.Borderless.Colored"/> 
            </linear>
            <text paddingLeft="5" size="16" id="oneLog"/>
            
            <list bg="#ffffff" elevation="1dp" h="*" id="logList">
                <linear>
                <text size="13" textColor="#555555" text="{{time}} "/>
                <text size="13" text="{{message}}"/>
                </linear>
            </list>
        </vertical>
        <button id="start" text="开始运行" tag="ScriptTag" color="#ffffff" bg="#FF4FB3FF" foreground="?selectableItemBackground"/>
        </vertical>
   </drawer>
);

//设置滑动模式
ui.logList.setOverScrollMode(2);

ui.login.click((view)=>{ 
    var dialog = new android.app.AlertDialog.Builder(activity).create()
    dialog.setView(new android.widget.EditText(context))
    dialog.show();
    dialog.setCancelable(false)
    var window = dialog.getWindow(); 
    window.setDimAmount(0.6);
    var vv=ui.inflate( 
             <vertical>
               <text text="用户登录" size="19" color="#000000" padding="12 12"/> 
               <vertical margin="25 0 25 10">
                  <linear>
                    <text gravity="center" color="#555555" size="17" text="账号 "/>
                    <input textColor="#000000" inputType="text" id="username" w="*"/>
                  </linear>
                  <linear>
                    <text gravity="center" color="#555555" size="17" text="密码 "/>
                    <input textColor="#000000" id="password" inputType="textPassword" w="*"/>
                  </linear>

               </vertical>
                 <relative>
                   <button id="cancle" layout_alignParentLeft="true" text="取消" style="Widget.AppCompat.Button.Borderless.Colored" w="auto"/>
                   <button id="login" layout_alignParentRight="true" text="登录" style="Widget.AppCompat.Button.Borderless.Colored" w="auto"/>
                 </relative>
             </vertical>)
   window.setContentView(vv);
   vv.cancle.click(()=>{dialog.dismiss();});
   
   vv.login.click(() =>{
        if (!vv.username.text()){toast("账号不能为空!");return;}
        if (!vv.password.text()){toast("密码不能为空");return;}
        // console.log(vv.username.text(), vv.password.text());
        threads.start(function() {
            var chk= login(vv.username.text(),vv.password.text());
            console.log(chk);
            pL = JSON.parse(chk);
            if(pL.msg!=="登录成功"){toast("登录失败!");return;}
            toast("登陆成功!");
            var usrpwd = '{"username":'+vv.username.text()+',"password":'+vv.password.text()+'}';
            files.write(file_path, usrpwd);
            ui.name.setText("当前用户:"+vv.username.text());
            STORAGE.put("username",vv.username.text())
            STORAGE.put("password",vv.password.text())
            isLogin = true;
            ui.run(function(){
                // refreshZZ();
            });
            dialog.dismiss();
        });
    });
   
});
//无障碍开关监控
ui.autoService.setOnCheckedChangeListener(function(widget,checked) {
    if(checked&&!auto.service) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if(!checked&&auto.service)auto.service.disableSelf()
    ui.autoService.setChecked(auto.service!=null) 
});
//存储
ui.YHseekbar.setOnSeekBarChangeListener({
    onProgressChanged:function(v,i,fromUser){
        ui.run(()=>{ui.YHlimit.setText(""+i*10)})
        storages.create(appName).put("YHlimit",i*10)
    }
})

//存储器
ui.YHseekbar.setProgress(storages.create(appName).get("YHlimit",200)/10)
//回到本界面时，resume事件会被触发
ui.emitter.on("resume",()=>{
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.autoService.checked = auto.service != null;
});
//禁止返回退出脚本
ui.emitter.on("back_pressed",function(event){
    if(workThread&&workThread.isAlive()){
        backTag=true;
        toast("脚本运行时不建议退出。");
        event.consumed=true;
    }
})
ui.tolog.click(()=>{
   app.startActivity("console") 
})

ui.integral.click((v)=>{
    if(v.text()==OutTimeTip){
        if (!STORAGE.get("username", null)){toast("未保存账号");return;}
        if (!STORAGE.get("password", null)){toast("未保存密码");return;}
        threads.start(function() {
            var pL= login(STORAGE.get("username", null),STORAGE.get("password", null));
            
            if(!pL.data||!pL.data.token){toastLog("自动登录失败!"+pL.msg);return;}
            
            toast("自动登陆成功!");
            
            STORAGE.put("token",pL.data.token);
            ui.run(function(){
                // refreshZZ();
            });
        });
    }
})

ui.start.click(()=>{
   workThread=threads.start(function(){
      try{
         clearLog()
         if(!auto.service) {
             toast("请先打开无障碍服务");
         } else {
             //主函数在这里加载。先判断登录状态
            if (isLogin==false) {
                toast("请先登录")
                return;
            } else {
                mainScript();
            }
        }
      }catch(e){
         if(!e.javaException instanceof java.lang.InterruptedException)  
            console.error("运行出错:"+e.toString())
      }finally{
         ui.run(function(){
            ui.start.setText("开始运行")
         });
      }
   });
});

function autoLogin() {
    if (files.exists(file_path)) {
        var json_str = JSON.parse(files.read(file_path));
        var auto_login = login(json_str.username,json_str.password);
        auto_l = JSON.parse(auto_login);
        if(auto_l.msg!=="登录成功"){toast("自动登录失败!");return;}
        toast("自动登陆成功!");
        ui.name.setText("当前用户:"+json_str.username);
        STORAGE.put("username",json_str.username)
        STORAGE.put("password",json_str.password)
        isLogin = true;
        ui.run(function(){
            // refreshZZ();
        });
        // dialog.dismiss();  //这里的登录窗口未创建。所以不需要dismiss
    } else {
        toast("自动登录失败");
    }
}

function login(username,password) {
    var res = http.post(apiURL+"get/loginInfo", {
        "username": username,
        "password": password
    });
    var html = res.body.string();
    return html;
}
function checkDevice() {
    var res = http.post(apiURL+"get/info",{
        "device_num":device_num,
    });
    var html = res.body.string();
    return html;
}
function devInit() {
    var chkdev = checkDevice();
    var ret = JSON.parse(chkdev);
    if (ret.data=="无此设备号记录") {
        var init_ret = http.post(
            apiURL+"update/init",
            {"device_num":device_num,"username":STORAGE.get("username")}
        );
        return init_ret.body.string();
    } else {
        var info_ret=http.post(
            apiURL+"update/info",
            {"device_num":device_num,"username":STORAGE.get("username")}
        );
        return info_ret.body.string();
    }
}

function mainScript() {
    ui.start.setText("停止运行");
    devInit();
    while (1) {
        toast("开始主程序");
        sleep(50000);
    }
}

threads.start(function() {
    autoLogin(); 
});