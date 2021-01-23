// log(currentPackage());
// log(currentActivity());
toast("开始")
var douyin144 = {
    sy: "com.ss.android.ugc.aweme:id/i74", //首页
    dq: "com.ss.android.ugc.aweme:id/bav",   //地区
    srk: "com.ss.android.ugc.aweme:id/fy8",  //手机输入框
    hqyzm: "com.ss.android.ugc.aweme:id/b3o", //获取验证码
}
var max_times = 60;
var url = "http://list.rola-ip.site:8088/user_get_ip_list?token=Tq1EDt0H6GXCYABG1571542946664&qty=1&country=us&time=5&format=txt&protocol=socks5&filter=1";
let ip_obj = getIP(url);
let widget_obj = {};


openVPN(ip_obj.ip,ip_obj.port)
let conn = checkConn();
if (conn==200) {
    toast("网络没问题");

} else {
    toast("无法连通，请换代理。");
}


//函数定义区

//重置设备：还原、清理、改机
function resetDevice()
{
    home()
    launch("com.qq.test");
    textContains('还原本机').waitFor();
    click("还原本机")
    sleep(3000)
    if (textContains('还原成功').findOne()) {
        click("清除数据");
        sleep(3000)
        if (textContains("清除完成").findOne()) {
            click("改机");
            sleep(3000)
            if (textContains("生成联系人").findOne()) {
                sleep(3000);
                home();
                toast("改机完成")
            } else {
                toast("改机失败...");
            }
        } else {
            toast("清除数据失败...");
        }
    } else {
        toast("还原失败...");
    }
}

//打开抖音
function startDY() {
    home();
    for (let i = 0; i < 5; i++) {
        try {
            if (currentPackage() == 'com.ss.android.ugc.aweme') {
                return true;
            } else {
                app.startActivity({
                    action: "android.intent.action.VIEW", //此处可为其他值
                    packageName: "com.ss.android.ugc.aweme",
                    className: "com.ss.android.ugc.aweme.main.MainActivity"
                });
                sleep(3000);
                if (text('确认').exists() && text('取消').exists()) {
                    click('确认'); sleep(3000);
                };
                if (text('允许').exists()) {
                    click('允许'); sleep(1000);
                }
            };
        } catch (error) {
            log(error); sleep(1000);
        };
    };
    return false;
}

//打开抖音的选择国家地区
function gotoCountry() {
    for (let i = 0; i < max_times; i++) {
        try {
            if (text('选择国家或地区').exists()) {
                return;
            } else if (text('个人信息保护指引').exists()) {
                click('同意');
            } else if (text('上滑查看更多视频').exists()) {
                swipe(345, device.height - 400, 335, 200, random(300, 400));
            } else if (text('以后再说').exists()) {
                click('以后再说');
            } else {
                click("")
                // clickcontrolex(id(ugc.sy).text('我').findOne(500));
                // clickcontrol(id(ugc.dq).findOne(100))
            };
            sleep(1000);
        } catch (error) {
            log(error); sleep(1000);
        };
    };
}

//关闭VPN
function closeVPN() {
    home();
    sleep(1000);
    launch("org.proxydroid");
    sleep(1000);
    let stat = className("android.widget.Switch").findOne().text() //代理切换开关的状态
    if (stat=="关闭") {
        toast("连接已关闭");
    } else {
        toast("关闭中...");
        sleep(1000);
        click("Proxy Switch");
        sleep(1000);
    }
}

//打开VPN
function openVPN(ip,port) {
    log("进入设置VPN函数");
    home();
    sleep(1000);
    launch("org.proxydroid");
    let curr = currentPackage();
    if (curr !== 'org.proxydroid') {
        toast("当前应用错误。");
        exit;
    }
    toast("开始设置VPN");
    sleep(1000);
    textContains("Host").waitFor();
    let stat = className("android.widget.Switch").findOne().text() //代理切换开关的状态
    if (stat=="开启") {
        toast("当前开启中，正在关闭重开。")
        click("Proxy Switch");
        sleep(1000);
    }
    //填写IP
    click("Host");
    sleep(500);
    setText(ip);
    // sleep(500);
    click("确定");
    sleep(1000);
    //填写端口号
    click("Port");
    sleep(500);
    setText(port);
    click("确定");
    sleep(1500);
    //设置代理类型
    click("Proxy Type");
    sleep(500);
    click("SOCKS5");
    sleep(500);
    click("Proxy Switch");
    sleep(3000);
    let sss = className("android.widget.Switch").findOne().text() //代理切换开关的状态
    if (sss=="开启") {
        toast("VPN开启成功")
        home();
    }
}

//检测当前网络连通性
function checkConn() {
    toast("检测连通性");
    let r = http.get("http://www.baidu.com");
    r = r.statusCode;
    return r;
}

//获取代理IP
function getIP(url) {
    try {
        let obj = {};
        result = http.get(url);
        result = result.body.string();
        log(result);
        let not_allow = result.indexOf("未加入白名单"); // 不等于-1，则表示存在
        if (not_allow==-1) {  //不能用这个来判断，因为还有其它异常情况，现在这个条件只是表示正常访问返回值中是否含有"未加入白名单"
            obj.ip = result.split(':')[0];
            obj.port = result.split(':')[1];
            return obj;
        } else {
            exit();
        } 
    } catch (error) {
        return error;
    }   
}

//重写get函数
function http_get(url) {
    try {
        result = http.get(url);
        result = result.body.string();
        return result;
    } catch (error) {
        return error;
    }
}

//重写post函数
function http_post() {
    var url = "https://login.taobao.com/member/login.jhtml";
    var username = "你的用户名";
    var password = "你的密码";
    var res = http.post(url, {
        "TPL_username": username,
        "TPL_password": password
    });
    var html = res.body.string();
    if(html.contains("页面跳转中")){
        toast("登录成功");
    }else{
        toast("登录失败");
    }
}

//重写点击函数(按控件bounds范围随机press)
function pressObjEx(obj) {
    if (obj != null) {
        try {
            obj = obj.bounds();
            if (obj.left > 0 && obj.right > 0 && obj.top > 0 && obj.bottom > 0) {
                return press(random(obj.left, obj.right), random(obj.top, obj.bottom), random(50, 150));
            } else {
                return false;
            }
        } catch (error) {
            log(error);
            return false;
        }
    }
}

//重写点击函数(按控件bounds范围随机click)
function clickObjEx(obj) {
    if (obj != null) {
        try {
            obj = obj.bounds();
            if (obj.left > 0 && obj.right > 0 && obj.top > 0 && obj.bottom > 0) {
                return click(random(obj.left, obj.right), random(obj.top, obj.bottom), random(50, 150));
            } else {
                return false;
            }
        } catch (error) {
            log(error);
            return false;
        }
    }
}

//重写点击函数(直接点击)
function clickObj(obj) {
    if (obj != null) {
        try {
            return obj.click();
        } catch (error) {
            log(error);
            return false;
        };
    };
};