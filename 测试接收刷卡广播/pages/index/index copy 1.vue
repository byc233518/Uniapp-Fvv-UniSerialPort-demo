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
		created: function(option) {
			serialPort.getAllDeviceList(res => {
			    console.log('//设备列表', res) 
			})
			serialPort.getAllDevicePath(res => {
			    console.log('//路径列表', res) 
			}),
			setTimeout(() =>{
				serialPort.setPath('/dev/ttyS3')
				serialPort.setBaudRate(9600) 
				serialPort.open(res => { 
					if(!res.status){
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon:"none"
						}); 
						return
					}  
					uni.showToast({
						title: "已打开",
						duration: 2000, 
					});
					
					serialPort.onMessageHex(rec => {
					    console.log(rec)
						this.cardnumber = rec
					},send => {
					    console.log(send)
					})
				})
			}, 10000)
		},
	}
</script>