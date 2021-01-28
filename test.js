
toast("开始")

//定义控件对象
var douyin144 = {
    tabbar: "com.ss.android.ugc.aweme:id/i74", //tabbar
    dq: "com.ss.android.ugc.aweme:id/bav",   //地区
    srk: "com.ss.android.ugc.aweme:id/fy8",  //手机输入框
    hqyzm: "com.ss.android.ugc.aweme:id/bld", //获取验证码 cmn bld
}
var max_times = 60; //统一循环总次数
var proxy_url = "http://list.rola-ip.site:8088/user_get_ip_list?token=27xgWdzYD7gV3Vmu1611657534900&type=4g&qty=1&country=kh&state=&city=&time=10&format=txt&protocol=socks5&filter=1"; //代理获取 接口地址
var phone_api = "http://47.104.78.234/Index/phone/";
var file_path = "/sdcard/phone.txt"; //手机号文件存放路径

//主流程开始
main()


//===========函数定义区=============================================================

//主流程函数
function main() {
    let ip_obj = getIP(proxy_url);
    openVPN(ip_obj.ip,ip_obj.port);
    let conn = checkConn();
    if (conn==200) {
        toast("网络没问题");
        let start_dy = startDY();
        if (start_dy) {
            clearModal(5);
            gotoCountry();
            selectCambodia();
            inputPhone();
        } else {
            toast('打开抖音失败');
        }
    } else {
        toast("无法连通，请换代理。");
    }
};

//打开抖音
function startDY() {
    log('打开抖音')
    home();
    for (let i = 0; i < 5; i++) {
        try {
            log("打开抖音",i);
            if (currentPackage() == 'com.ss.android.ugc.aweme') {
                toast("抖音已打开");
                clearModal(5);
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

//处理弹窗
function clearModal(times) {
    //执行times次清理界面。每次间隔1.5秒。
    for (let i = 0; i < times; i++) {
        log('清理界面',i);
        if (text('确认').exists() && text('取消').exists()) {
            click('确认');
            sleep(1000);
        }
        if (text('允许').exists()) {
            click('允许');
            sleep(1000);
        }
        if (text('上滑查看更多视频').exists()) {
            log('提示上滑',i)
            swipe(345, device.height - 400, 335, 200, random(300, 400))
            sleep(1000);
        }
        if (text('个人信息保护指引').exists()) {
            log('提示个人保护',i)
            click('同意');
            sleep(1000);
        }
        if (text('以后再说').exists()) {
            log('提示以后再说',i)
            click('以后再说');
        }

        sleep(1500);
    }
}

//打开抖音的选择国家地区
function gotoCountry() {
    log('选择国家地区');
    toast("开始选择国家");
    for (let i = 0; i < max_times; i++) {
        try {
            log('选择国家地区',i)
            if (text('选择国家或地区').exists()) {
                return;
            } else if (text('个人信息保护指引').exists()) {
                log('提示个人保护',i)
                click('同意');
            } else if (text('上滑查看更多视频').exists()) {
                log('提示上滑',i)
                swipe(345, device.height - 400, 335, 200, random(300, 400));
            } else if (text('以后再说').exists()) {
                log('提示以后再说',i)
                click('以后再说');
            } else {
                log('开始查找 我 和 dq 控件',i)
                pressObjEx(id(douyin144.tabbar).text('我').findOne(500));
                // clickObjEx(id(douyin144.dq).findOne(100));
                click("+86");
            };
            sleep(1000);
        } catch (error) {
            log(error); sleep(1000);
        };
    };
}

//选取美国地区
function selectUsa() {
    for (let i = 0; i < 30; i++) {
        swipe(345, device.height - 400, 335, 200, random(10, 200));
        if (text('也门').exists()) {
            break;
        }
        sleep(500);
    }
    for (var i = 0; i < max_times; i++) {
        try {
            if (text('也门').exists()) {
                swipe(335, 200, 345, device.height - 400, random(300, 400));
                sleep(1000);
            } else if (text('美国').exists()) {
                return click('美国');
            } else {
                swipe(345, device.height - 400, 335, 200, random(300, 400));
            };
            sleep(3000)
        } catch (error) {
            log(error); sleep(1000);
        };
    };
};

//选取柬埔寨地区
function selectCambodia() {
    for (var i = 0; i < max_times; i++) {
        try {
            if (text('也门').exists()) {
                swipe(335, 200, 345, device.height - 400, random(300, 400));
                sleep(1000);
            } else if (text('柬埔寨').exists()) {
                return click('柬埔寨');
            } else {
                swipe(345, device.height - 400, 335, 200, random(300, 400));
            };
            sleep(3000)
        } catch (error) {
            log(error); sleep(1000);
        };
    };
}

//获取手机号
function getPhone(area) {
    let url = phone_api + "get?area=" + area;
    r = http.get(url);
    r = r.body.json();
    // log(r.data.num);
    // log(r.data.api_url);
    // log(r.data.id);
    return r;
}

//手机号状态修改 (stat值  0:新号,1:已用,2:不可用,3:可用)
function updatePhone(id,stat) {
    let url = phone_api + "update/";
    r = http.post(url,{
        "id":id,
        "stat":stat
    });
    r = r.body.json();
    return r;
}

//输入手机号
function inputPhone() {
    let srk = id(douyin144.srk).findOne(100);
    let p = getPhone('柬埔寨');  //返回的是一个对象p.data.num,p.data.id,p.data.api_url
    if (srk) {
        srk.setText(p.data.num);
        updatePhone(p.data.id,1);  //设置当前手机号的状态为 已用
    }
    sleep(500);
    if (text('获取短信验证码').exists()) {
        click('获取短信验证码');
    };
    sleep(500);
    if (textContains('访问太频繁').findOne()) {
        toast("访问频繁");
        updatePhone(p.data.id,2)  //设置当前手机号的状态为 不可用
        //开始重新开始。
    } else {
        //通过API接口获取验证信息
        //r = http.get(p.data.api_url);
        //r = r.body.string();
        updatePhone(p.data.id,3)  //设置当前手机号的状态为 可用
    }
}

//接码平台对接
function yzm() {
    log("接码平台");
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

//读取手机号列表文件
function getPhoneByTxt(path) {
    if (files.exists(path)) {
        // r = files.read(path);
        file = open(path, "r")
        // log(file.readline());
        file.readlines().forEach(line => {
            // log(line);
            line_a = line.split("----");
            log(line_a[0],line_a[1]);
        });
        file.close();
    } else {
        toast("文件不存在。");
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
    // log('press点击了',obj)
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
    // log('click点击了',obj)
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