
//实例化vue
var vm = new Vue({
	el: '#dataList',
	data : {
        title:'支付成功',
        txt:'支付成功！',
        pay_type:'',
        froms:'',
        self_id:'',
        order_id:'',
        price:'',
		set_pay_type:''
	},
	mounted: function(){
		var self = this;
		// 初始化页面
		mui.init();
		
		
		// 初始化页面 
		mui.plusReady(function(){
			var page = plus.webview.currentWebview();
			self.forms=page.data.forms;
			self.order_id=page.data.order_id;
			self.price=page.data.price;
			self.pay_type=page.data.pay_type;
			self.set_pay_type=page.data.set_pay_type;
			console.log("page"+JSON.stringify(page));
			if (self.pay_type == 3) {
				  self.pay_type = '货到付款'
				  self.txt = '下单成功'
				  self.title = '下单成功'
			} else if (self.pay_type == 1) {
				  self.pay_type = '支付宝支付'
				  self.txt = '支付成功'
				  self.title = '支付成功'
			} else if (self.pay_type == 2) {
				  self.pay_type = '微信支付'
				  self.txt = '支付成功'
				  self.title = '支付成功'
			}
			
		})

		// mui(".good_number").numbox().setValue(this.weight)

	},
	methods:{
      detail(){
		  var self = this;
		  // switch (self.from){
		   // case 1: //用户找车页面
		      
		   // plusCommon.popToTarget('../order_user/myOrderDetail.html',true);
		   // var index=plus.webview.getLaunchWebview();//获得初始窗口
		   // plus.webview.show(index);//打开初始窗口

		   // break;
		   // case 2: //用户零担列表
		   // console.log(2);
			// plusCommon.popToTarget('../order_user/myOrderDetail.html',true);
			// break;
		   // case 'owm': // 信用额度支付
		   // console.log(3);
		   // break;
		   
		  // } 	
		  console.log("order_id:"+self.order_id);
		  mui.openWindow({
		      url:"../order_user/orderDetail.html",
		      id:"order_user/orderDetail.html",
		      extras:{
		        	self_id:self.order_id,
		        	type:1
		      },
		      waiting:{
		        autoShow:true,
		        title:'正在加载...',
		        options:{}
		      }
		  });
		  plus.webview.getWebviewById('3pl_user/form.html').evalJS('refreshData()');
		  plus.webview.getWebviewById('user_line/line_details.html').evalJS('refreshData()');
		  
// clicked("../payment/pay_success.html",{data:datt});
      },

	onClickLeft() {
		  var self=this;
		  switch (self.forms){
		   case '1': //用户找车页面
		   console.log(1);
		   // var index=plus.webview.getLaunchWebview();//获得初始窗口
		   // plus.webview.show(index);//打开初始窗口
		   // plusCommon.popToTarget('3pl_user/form.html',true);
		   var index=plus.webview.getLaunchWebview();//获得初始窗口
		   plus.webview.show(index);//打开初始窗口
		   // plusCommon.popToTarget('user_line/line.html',true);
		   index.evalJS("changSub(0)"); //改变选项卡点击位置
		   plus.webview.getWebviewById('3pl_user/form.html').evalJS('refreshData()');

		   // var index=plus.webview.getLaunchWebview();//获得初始窗口
		   // plus.webview.show(index);//打开初始窗口
		   // plusCommon.popToTarget('user_line/line.html',true);
		   // index.evalJS("changSub(0)"); //改变选项卡点击位置
		   /**
			* changSub参数的数字是tab项数组的下标
			* 以用户身份为例 0是找车，1是零担，2是接单、3是我的
			*/
		   // index.evalJS("changSub(0)"); //改变选项卡点击位置
		   break;
		   case '2': //用户零担列表
		   console.log(2);   
		    var index=plus.webview.getLaunchWebview();//获得初始窗口
		    plus.webview.show(index);//打开初始窗口
			// plusCommon.popToTarget('user_line/line.html',true);
			index.evalJS("changSub(1)"); //改变选项卡点击位置
			plus.webview.getWebviewById('user_line/line_details.html').evalJS('refreshData()');
			break;
		   case 'owm': // 信用额度支付
		   console.log(3);
		   break;
		  }  
      }
	},
	filters:{
		fliterTimeStr: function(value){
			return value.substring(0,10);
		},
	},
	
})

mui.init({
	swipeBack: false
});

$('.mui-scroll-wrapper').scroll({
	indicators: true //是否显示滚动条
});



// });
// 去除遮罩
function no_marker(){
	init_mask4();
	init_mask2();
	$('.search_marker').hide();
	$('.search_marker').removeClass('data-active');
	var i = $('.nav .activecolor').attr('id');
	if (i == 'type0') {
		var obj_data= $('#search_data .mui-s-data');
	} else if (i == 'type2') {
		var obj_data= $('#search_data_bulk .mui-s-data');
	}
	if (i == 'type0' || i == 'type2') {
		obj_data.removeClass('mui-s-data-active').find('img').attr('src','../images/driver/line_down.png').css({"margin-bottom":"0px"});
	}
}

var mask = mui.createMask(function(){
	no_marker();
	return true;
});//callback为用户点击蒙版时自动执行的回调；
