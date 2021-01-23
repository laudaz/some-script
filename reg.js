
function Writetext(wb, lj) {
    try {
        var path = lj;
        var file = open(path, "w");
        file.write(wb);
        file.close();
    } catch (e) {
        return null;
    };
};
function Readtext(lj) {
    try {
        var path = lj;
        var file = open(path, "r");
        var wb = file.read();
        file.close();
        return wb;
    } catch (e) {
        return null;
    };
};


var ugc = {
    // sy: "com.ss.android.ugc.aweme:id/h1u", //首页
    sy: "com.ss.android.ugc.aweme:id/i74", //首页
    // dq: "com.ss.android.ugc.aweme:id/auh",   //地区
    dq: "com.ss.android.ugc.aweme:id/bav",   //地区
    // srk: "com.ss.android.ugc.aweme:id/f1b",  //手机输入框
    srk: "com.ss.android.ugc.aweme:id/fy8",  //手机输入框
    hqdx: "com.ss.android.ugc.aweme:id/b3o", //获取验证码
    zcjm: "com.ss.android.ugc.aweme.account.business.phone.countrycode.a",
    fwpf: "com.ss.android.ugc.aweme:id/c31",  //访问频繁
}
var i_max = 60;



function clickcontrolex(obj) {
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
        };
    };
};
function clickcontroleo(obj) {
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
        };
    };
};
function clickcontrol(obj) {
    if (obj != null) {
        try {
            return obj.click();
        } catch (error) {
            log(error);
            return false;
        };
    };
};


// log(currentPackage())
// log(currentActivity())



function reg_ym() {

    for (var i = 0; i < i_max; i++) {
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
                clickcontrolex(id(ugc.sy).text('我').findOne(500));
                clickcontrol(id(ugc.dq).findOne(100))
            };
            sleep(1000);
        } catch (error) {
            log(error); sleep(1000);
        };
    };

};

function choiceus() {
    for (var i = 0; i < i_max; i++) {
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
function starugc() {
    for (var i = 0; i < 5; i++) {
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
};

function main() {
    home();
    sleep(500);
    home();
    sleep(500);
    launchApp("抖音");
    
    starugc()
    log(111)
    starugc()
    log(222)
    reg_ym()
    log(333)
    choiceus()
    log(444)
    var srk = id(ugc.srk).findOne(100)
    if (srk) {
        srk.setText('7025147889')
    }
    if (text('获取短信验证码').exists()) {
        click('获取短信验证码');
    };
    if (textContains('访问太频繁').findOne()) {
        toast("访问频繁");
    }
}

// main()

var changeDid = {
    // shouquan: "",
    gaiji: "com.qq.test:id/test",
    qingchu: "com.qq.test:id/test2",
    huanyuan: "com.qq.test:id/test1",
    info: "com.qq.test:id/current_model" //获取省份成功
}

