<template>
	<view class="content">
		<text class="title">内容: {{cardnumber}}</text>
	</view>
</template>

<script>
	var main, receiver, filter;
	export default {
		name: 'GetCardNumber',
		data() {
			return {
				cardnumber: ''
			}
		},
		created: function(option) {
			this.init();
			setTimeout(() => {
				this.start();
			}, 2000)
		},
		onHide: function() {
			this.stop();
		},
		destroyed: function() {
			this.stop();
		},
		methods: {
			init() {
				let _this = this;
				main = plus.android.runtimeMainActivity(); //获取activity  
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				filter = new IntentFilter();
				filter.addAction("android.intent.action.getcardnumber"); // 换你的广播动作 
				receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
					onReceive: function(context, intent) {
						plus.android.importClass(intent);
						let code = intent.getStringExtra("cardnumber"); // 换你的广播标签  
						console.log('code', code)
						_this.cardnumber = code
					}
				});
			},
			start() {
				main.registerReceiver(receiver, filter);
			},
			stop() {
				main.unregisterReceiver(receiver);
			},
		}
	}
</script>
