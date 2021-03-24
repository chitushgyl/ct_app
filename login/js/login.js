/**
 * @description：预加载订单详情页面
 */
var orderDetail = null;

function preloadOrderDetail() {
	orderDetail = mui.preload({
		url: "login.html",
		id: "login.html", //默认使用当前页面的url作为id
		styles: {}, //窗口参数
		extras: {
			idd: ""
		} //自定义扩展参数
	});
}

// 实例化
var vm = new Vue({
	el: '#dataList',
	data: {
      phone: "",
      sms: "",
      btntxt: "获取验证码",
      disabled: false,
      time: 0,
      show: false,
	},
	mounted: function() {

	},
	methods: {
	// sendcode() {
	//       var reg = 11 && /^1[3-9]\d{9}$/;
	//       if (this.phone == "") {
	//       } else if (!reg.test(this.phone)) {
	//       } else {
	//         this.time = 60;
	//         this.disabled = true;
	//         //验证码的时间设置 可有可无
	//         this.timer();
	//         var data = {
	//           tel:this.phone
	//         };
	//         //手机号争取后调取接口
	//         message_send(data).then((res)=>{
	//           var code = res.code;
	//           var msg = res.msg;
	//           if (code == 200) {
	//             this.$notify({ type: 'success', message: msg });
	//               this.timer();
	//           } else {
	//               this.$notify({ type: 'warning', message: msg });
	//           }
	//         }).catch((err)=>{});
	//       }
	//     },
	    //验证码的倒计时
	    // timer() {
	    //   if (this.time > 0) {
	    //     this.time--;
	    //     this.btntxt = this.time + "s后获取";
	    //     setTimeout(this.timer, 1000);
	    //   } else {
	    //     this.time = 0;
	    //     this.btntxt = "获取验证码";
	    //     this.disabled = false;
	    //   }
	    // },
	    // loginOn(){},
	//     loginOn() {
	//       var reg = 11 && /^1[3-9]\d{9}$/;
	//       if (this.phone == "") {
	//         return false;
	//       } else if (!reg.test(this.phone)) {
	//         return false;
	//       }
	
	//       if (this.sms == "") {
	//         return false;
	//       }      
	
	//       if (this.sms.length < 4) {
	//         return false;
	//       }
	//       var data = {
	//           tel:this.phone,
	//           code:this.sms
	//       }
	//       login_tel_login(data).then((res)=>{
	//           console.log(res)
	//           var code = res.code;
	//           var msg = res.msg;
	
	//           if (code == 200) {
	//             this.$toast(msg);

	                         
	//           } else {

	//           }
	//       }).catch((err)=>{});
	      
	//     },	
	},

});
