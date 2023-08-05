var main = null;
var receiver = null;
//接收广播
export function recive(success, fail) {
    main = plus.android.runtimeMainActivity(); //获取activity
    //创建自定义广播实例  
    receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
        onReceive: function(context, intent) { //实现onReceiver回调函数  
            plus.android.importClass(intent); //通过intent实例引入intent类，方便以后的‘.’操作  
            var action = intent.getAction()
            if (action == 'com.scanner.broadcast') {
                console.log('监听扫码触发....')
                //条码或二维码
                var data = intent.getExtra("data");
                if (data) {
                    console.log('zhanglp',data.replace(/\n/,''))
                    console.log('zhanglp',data.replace(/\n/,'').replace(/\t/,''))
                    success({
                        type: 'barcode',
                        data: data.replace(/\n/,'').replace(/\t/,'').trim() //处理结束符和换行符为空
                    })
                } else {
                    fail('未识别到扫码数据')
                }
            } else if (action == 'android.intent.action.getcardnumber') {
                console.log('监听RFID触发....')
                //RFID码
                var data = intent.getExtra("cardnumber");
                if (data) {
                    console.log('zhanglp',data.replace(/\n/,''))
                    console.log('zhanglp',data.replace(/\n/,'').replace(/\t/,''))
                    success({
                        type: 'rfid',
                        data: data.replace(/\n/,'').replace(/\t/,'').trim()
                    })
                } else {
                    fail('未识别到RFID数据')
                }
            }
        }
    });
    var IntentFilter = plus.android.importClass('android.content.IntentFilter'); //网络
    var Intent = plus.android.importClass('android.content.Intent');
    var filter = new IntentFilter(); //过滤
    filter.addAction(Intent.ACTION_AIRPLANE_MODE_CHANGED); //监听飞行模式 
    // filter.addAction("zeji.shanghai.scanner.RFID"); //监听rfid     
    // filter.addAction("zeji.shanghai.scanner.barcode"); //监听barcode

    filter.addAction("android.intent.action.getcardnumber"); //监听rfid
    filter.addAction("com.scanner.broadcast"); //监听bar

    var BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter"); //蓝牙
    var BAdapter = new BluetoothAdapter.getDefaultAdapter();
    filter.addAction(BAdapter.ACTION_STATE_CHANGED); //监听蓝牙
    main.registerReceiver(receiver, filter); //注册监听
}
//取消监听
export function unregisterReceiver(){
    main.unregisterReceiver(receiver);
}