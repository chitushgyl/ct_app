//实例化vue
var indexData = new Vue({
	el: '#dataList',
	data : {
		mescroll : null,
		lineList:{
		
		},  //零担线路数据
		yugu:'',
		self_id:'',
		good_name:'',
		good_number:'',
		good_weight:'',
		good_volume:'',
	    clod:'',
	    clod_name:'',
		control_type:[],
		checkedPick:'oneself',
		checkedSend:'oneself',
		pick_type_arr:[],		
		send_type_arr:[],
		send_arr:{
			send_sheng_name:'添加发车地址',
			send_shi_name:'',
			send_qu_name:'',
			send_address:'',
			tel:'',
			contacts:'装车联系人',
			self_id:''
		},
		gather_arr:{
			gather_sheng_name:'添加目的地址',
			gather_shi_name:'',
			gather_qu_name:'',
			gather_address:'',
			tel:'',
			contacts:'目的地联系人',
			self_id:''
		},
		// on_line_money:'',
		goods_info:'请填写货物信息',
	},
	mounted: function(){	
		var self = this;
		// 初始化页面
		mui.init();
		// self.good_number = mui.(".good_number").numbox().getValue();
		// self.get_control();
		mui.plusReady(function(){
			var page = plus.webview.currentWebview();
			console.log(JSON.stringify(page));
			// self.self_id = page.self_id;	
			var data = {
				self_id : page.self_id,
			}
			
			console.log(JSON.stringify(data));
			request.PostInfo_new(request.on_line_details,data,function(response){			

				var data = response.data.info;
				self.lineList = data;
				self.self_id=data.self_id
				console.log("data："+JSON.stringify(data));
				console.log("self.lineList"+JSON.stringify(self.lineList));
				
			},function(response){
				
			})
		});	
		// mui(".good_number").numbox().setValue(this.weight)
	},
	methods:{
		geTel:function(tel){
		    var reg = /^(\d{3})\d{4}(\d{4})$/;  
		    return tel.replace(reg, "$1****$2");
		},
		upCallback:function(page){
			var self = this;
			// self.getTransportData(page.num);
			toBulkOrderDetail(page.self_id);
		},
		
		back(){
			
			let old_back = mui.back;
			try{
				mui.back=function(){
					console.log(1233214);
					let wobj = plus.webview.getWebviewById("user_line/on_line.html");//注意 HBuilder 是  1.html 的 ID 你如果1.html 有ID  要替换掉HBuilder，
					wobj.reload(true);
					old_back()
				}  
			}catch(e){
				console.log('异常是：'+JSON.stringify(e))
			}
		},
		
		
		receive:function(){
			var self = this;
			var project_type = localStorage.project_type;
			var datelist = {
				dispatch_id: self.lineList.self_id,
			}
			
			var flag = false;
			if (localStorage.ftoken == null) {
				mui.toast('请先登录');
				openLogin();
				flag = true;
			}
			if (flag) {
				return false;
			}
			

			if (project_type == 'user'|| project_type=='carriage') {
				//用户

					// let old_back = mui.back;
					// let old_back =self.back();
					
					// return;

				var btnArray = ['确认','取消'];
				mui.confirm('确认承接该订单吗？', '接单', btnArray, function(e) {
					if (e.index == 0) {
						request.PostInfo_new(request.addTake,datelist,function(res){
							mui.toast(res.msg);
							// plus.webview.currentWebview().opener().evalJS("refresh_show()");
							// plus.webview.getWebviewById('../user_line/on_line.html').reload();
				
				// console.log(JSON.stringify(webview.opener()));
				// console.log(JSON.stringify(plus.webview.getLaunchWebview()));
				
				// console.log(JSON.stringify(plus.webview.getWebviewById(plus.runtime.appid)));
							// plusCommon.popToTarget(plus.webview.getWebviewById(plus.runtime.appid).id,true);
					 //   var index=plus.webview.getLaunchWebview();//获得初始窗口
					 //   plus.webview.show(index);//打开初始窗口
						// index.evalJS("changSub(2)"); //改变选项卡点击位置
						// plus.webview.getWebviewById('user_line/on_line.html').evalJS('refresh_show()');
						// mui.back();
						// plus.webview.currentWebview().opener().evalJS("refresh_show()");
						// mui.back();
						
						switch (project_type){
							case 'user':
								// var index=plus.webview.getLaunchWebview();//获得初始窗口
								// plus.webview.show(index);//打开初始窗口
								// // plusCommon.popToTarget('user_line/line.html',true);
								// index.evalJS("changSub(0)"); //改变选项卡点击位置
								break;
								
							case 'carriage':
								var index=plus.webview.getLaunchWebview();//获得初始窗口
								plus.webview.show(index);//打开初始窗口
								// plusCommon.popToTarget('user_line/line.html',true);
								index.evalJS("changSub(0)"); //改变选项卡点击位置
								break;
						}
						
						
						},function(res){

						});
					} else {
						mui.toast("取消订单");
					}
				},"div");				
				
			}else{
				//'TMS3PL'
				var btnArray = ['确认','取消'];
				mui.confirm('确认承接该订单吗？', '接单', btnArray, function(e) {
					if (e.index == 0) {
						request.PostInfo_new(request.online_addOrder,datelist,function(res){

								mui.toast(res.msg);
								var index=plus.webview.getLaunchWebview();//获得初始窗口
								plus.webview.show(index);//打开初始窗口
								// plusCommon.popToTarget('user_line/line.html',true);
								index.evalJS("changSub(0)"); //改变选项卡点击位置
								// plus.webview.currentWebview().opener().evalJS("refresh_show()");
								// mui.back();
								// plusCommon.popToTarget('../userline/on_line.html',true);
								// plus.webview.currentWebview().opener().evalJS("refresh_show()");
								// plus.webview.getWebviewById('../user_line/on_line.html').reload();
								// plus.webview.getWebviewById('../user_line/on_line.html');
								// if(wobj!=null){							   
								// 	wobj.reload(true);
								// }
								// mui.back();
								 // var list = plus.webview.currentWebview().opener();
								 //触发父页面的自定义事件(refresh),从而进行刷新
								  // mui.fire(list, 'refresh');
								  //返回true,继续页面关闭逻辑
								// return true;
						},function(res){
				
						});
					} else {
				// 		mui.toast("取消订单");
					}
				},"div");	
			}
		},

		
	},
	filters:{
		fliterTimeStr: function(value){
			return value.substring(0,10);
		},
	},
	
})

function geTel(tel){
    var reg = /^(\d{3})\d{4}(\d{4})$/;  
    return tel.replace(reg, "$1****$2");
}

$('.mui-scroll-wrapper').scroll({
	indicators: true //是否显示滚动条
});



			/*search_data*/