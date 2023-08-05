<template>
	<view class="content">
		<text class="title">读取到的内容: {{cardnumber}}</text>
	</view>
</template>

<script>
	const serialPort = uni.requireNativePlugin('Fvv-UniSerialPort')


	export default {
		name: 'GetCardNumber',
		data() {
			return {
				cardnumber: '1111111111'
			}
		},
		methods: {
			onMessage(rec) {
				console.log(rec)
				/**
				 * 自己的逻辑
				 * 此处拿到的是读卡器返回的原始数据
				 * 可能涉及到数值的转换,解析
				 * */
				this.cardnumber += rec + "\r\n"
			}
		},

		created: function(option) {
			const self = this
			serialPort.getAllDeviceList(res => {
				console.log('//设备列表', res)
			})
			serialPort.getAllDevicePath(res => {
				console.log('//路径列表', res)
			}),
			setTimeout(() => {
				serialPort.setPath('/dev/ttyS3')
				serialPort.setBaudRate(19200)
				serialPort.open(res => {
					if (!res.status) {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: "none"
						});
						return
					}
					uni.showToast({
						title: "串口监听已打开",
						duration: 2000,
					});

					serialPort.onMessageHex(rec => {
						this.onMessage(rec);
					}, send => {
						console.log(send)
					})
				})
			}, 10000)
		},
	}
</script>