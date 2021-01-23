toast("开始脚本");
var device_num = device.getAndroidId();
let ws = web.newWebSocket("ws://119.3.12.149:8080",{eventThread:'this'});
ws.on("open", (res, ws) => {
    log("WebSocket已连接");
}).on("failure", (err, res, ws) => {
    log("WebSocket连接失败");
    console.error(err);
}).on("closing", (code, reason, ws) => {
    log("WebSocket关闭中");
}).on("text", (text, ws) => {
    console.log("收到文本消息: ", text);
    msg = eval("("+text+")");
    if(msg.type==='init'){
        var init_str = '{"type":"bind","fromid":"'+device_num+'","text":"设备绑定"}';
        ws.send(init_str);
        alert('设备初始化');
    }else if(msg.type==='control'){
        console.log('type:',msg.type);
        switch (msg.todo) {
            case "wechat":
                launchApp('微信')
                break;
            default:
                console.log('todo:',msg.todo);
                break;
        }
    }else{
      console.log('其他消息:',msg.text);
    }
}).on("binary", (bytes, ws) => {
    console.info("收到二进制消息:");
    console.info("hex: ", bytes.hex());
    console.info("base64: ", bytes.base64());
    console.info("md5: ", bytes.md5());
    console.info("size: ", bytes.size());
    console.info("bytes: ", bytes.toByteArray());
}).on("closed", (code, reason, ws) => {
    log("WebSocket已关闭: code = %d, reason = %s", code, reason);
});

setTimeout(() => {
    log("退出程序");
}, 30000)
// var thread = threads.start(function(){
//     var ws = web.newWebSocket("ws://119.3.12.149:8080",{eventThread:'this'});
//     ws.on("open",(res,ws)=>{
//         console.log("已连接服务器", res);
//     });
//     ws.on("text", (text, ws) => {
//         console.log("收到文本消息: ", text);
//         msg = eval("("+text+")");
//         if(msg.type==='init'){
//             var init_str = '{"type":"bind","fromid":"'+device_num+'","text":"设备绑定"}';
//             ws.send(init_str);
//             alert('设备初始化');
//         }else if(msg.type==='control'){
//             console.log('type:',msg.type);
//             switch (msg.todo) {
//                 case "wechat":
//                     launchApp('微信')
//                     break;
//                 default:
//                     console.log('todo:',msg.todo);
//                     break;
//             }
//         }else{
//           console.log('其他消息:',msg.text);
//         }
//     });
//     setTimeout(()=>{},1000)
// });
//停止线程执行
// thread.interrupt();

