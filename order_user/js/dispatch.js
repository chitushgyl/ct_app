function refresh(){
	vm.$data.mescroll.resetUpScroll();
}
function refresh_show(){
	location.reload();
}
var vm = new Vue({
	el: '#template',
	data: {
		type: 1, // 操作类型 1 添加 2 编辑
		token: null,
		get_id: null,
		name: '',
		phone: '',
		info: '',
		from:'',
		shares:{},
		url:'',
		group_name:'',
		group_id:'',
		paystate:'',
		paystate_id:'',
		address:'',
		contacts:'',
		car_number:'',
		tel:'',
		self_id:'',
		group_list:[],
		control_data:[],
		cost_type_list:[]
	},
	created:function(){
		var self = this;

		mui.plusReady(function() {
			var ws = plus.webview.currentWebview();
		  	self.get_id = ws.self_id;
		  	self.from = ws.from ? ws.from : '';
		  	console.log(self.from);
		  	console.log(self.get_id);
		});
	},
	mounted:function() {
		
	},
	methods: {
		testFun:function(data){
				var self =this;
				console.log(JSON.stringify(data));
				// vm2.backbulk(data);
				self.self_id=data.self_id;
				self.car_number=data.carnumber;
				self.contacts=data.contant;
				self.tel=data.tel;
				// this.car_num(data.carnumber);// 页面传参和显示的值
				console.log(self.car_number)
				// indexData.outAdd(data);   // 参与计算使用的参数
		},
		picker:function (data,col,ele,type){//选择公司
			var self = this;
			// 如果没有说明选择器是几列，就默认1列
			if(!col){
				col = 1;
			}
			// 初始化选择器
			var picker = new mui.PopPicker({layer: col},{buttons:['取消','ok','确定']});
			// 设置选择器的数据
			picker.setData(data);
			// 显示选择器
			picker.show(function (selectItems) {
				// 输出选择器选中的值
				console.log(type);
				console.log(JSON.stringify(selectItems));
				if (type == 'group') {
					self.group_name = selectItems[0].text;
					// 设置选中的value 
					self.group_id = selectItems[0].value;
				} else if (type == 'cost') {
					self.paystate = selectItems[0].text;
					// 设置选中的value 
					self.paystate_id = selectItems[0].value;
				}
				// 销毁选择器
				picker.dispose();
			});	
		},
		//调度
		click_group:function (){
		 mui.openWindow({
		 	url:'../car/list.html',
		 	id:'../car/list.html',
		 	createNew:true,
		 	extras:{
		 	}
		 });
		},

		click_cost:function (){
			console.log('456');
			var control = document.getElementById('paystate');
		   	this.picker(this.cost_type_list,1,control,'cost');
		},
		copy_:function(){
			alert(123);
			window.clipboardData.setData("Text",self.url);
			alert(self.url);
		},
		submitFun: function(){ // 提交
			var self = this;
			// var token = user.getState('token');
			// var group_id = user.getState('group_id');
			// var name = request.clear_str_null($('#name').val());
			// var contact_name = request.clear_str_null($('#contact_name').val());
			// var contact_tel = request.clear_str_null($('#contact_tel').val());
			// if (!self.group_id) {
			// 	mui.toast('请选择公司!');
			// 	return false;
			// }			

			// if (!name) {
			// 	mui.toast('客户名称不能为空!');
			// 	return false;
			// }

			// if (!self.paystate_id) {
			// 	mui.toast('请选择结算方式!');
			// 	return false;
			// }
			// if (!contact_name) {
			// 	mui.toast('联系人不能为空!');
			// 	return false;
			// }
			// var c_m = request.checkMobile(contact_tel);
			// if (c_m) {
			// 	mui.toast('联系电话(手机号)格式错误！');
			// 	return false;
			// }
	
			var data = {
				dispatch_id:self.get_id,
				// car_number:self.car_number,
				contacts:self.contacts,
				tel:self.tel,
				car_id:self.self_id,
			};

			request.PostInfo_new(request.api_take_dispatch_order,data,function(res){
				console.log(res);
				mui.toast(res.msg);
				mui.back();
				plus.webview.currentWebview().opener().evalJS("refresh_show()");
				// plus.webview.getWebviewById('../order_user/take_list.html').reload();	
		  	},function(res){

		  	});
		}
	},
	
});

$(document).on('click','#button',function(){
	vm.submitFun();
});

function listenBack(data) {//常用地址获得选中的返回值
			vm.testFun(data);
};

