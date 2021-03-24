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
		group_list:[],
		control_data:[],
		cost_type_list:[]
	},
	created:function(){
		var self = this;

		mui.plusReady(function() {
			var ws = plus.webview.currentWebview();
		  	self.get_id = ws.get_id;
		  	self.from = ws.from ? ws.from : '';
		  	console.log(self.from);
		  	console.log(self.get_id);
		 //  	self.url = request.url_share+'?a=customer';
		 //  	$('#share_url').html(self.url);
		 //  	$('#target').val(self.url);
		 //  	self.shares = new share();
			// self.shares.updateSerivces();
		  	if (self.get_id) {
		  		$('.mui-title').text('编辑客户');
		  	}

		  	var data = {
		  		self_id:self.get_id
		  	};

		  	var promise = new Promise(function(res,rej){
		  		request.PostInfo_new(request.tms_group_createGroup,data,function(resturn){
			 		var list_cost = resturn.data.tms_cost_type;
			 		console.log(JSON.stringify(list_cost));
			 		console.log(111111111111111);
			  		self.cost_type_list = [];
			  		for(var i in list_cost){
			  			var name = list_cost[i].name
			  			console.log(list_cost[i].name);
			  			if (list_cost[i].key && name) {
				  			var one = {};
				  			one.value = list_cost[i].key;
				  			one.text = name;
				  			self.cost_type_list.push(one);
			  			}
			  		}
			  		console.log(self.cost_type_list);
			  		self.info = resturn.data.info ? resturn.data.info :{};
			  		self.address = self.info.address;
			  		self.group_id = self.info.group_code;
			  		self.paystate = self.info.cost_type_show;
			  		self.paystate_id = self.info.cost_type;
			  		res();
			  	},function(){});
		  	});

		  	promise.then(function(){	  	
			  	request.PostInfo_new(request.company_companyPage,{},function(res){
				  	var list = res.data.items;
				  	self.control_data = [];
				  	console.log(2222222222222222222);
				  	for(var i in list){
				  		console.log(list[i].group_name);
				  		if (list[i].self_id && list[i].group_name) {
				  			var one = {};
				  			one.value = list[i].self_id;
				  			one.text = list[i].group_name;
				  			self.control_data.push(one);
				  		}
				  	}
				  	console.log(self.control_data);
				},function(){});
			});



		});
	},
	mounted: function() {
		var self = this;
		
	},
	methods: {
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

		click_group:function (){
			console.log('456');
			var control = document.getElementById('group_name');
		   	this.picker(this.control_data,1,control,'group');
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
			var group_id = user.getState('group_id');
			var name = request.clear_str_null($('#name').val());
			var contact_name = request.clear_str_null($('#contact_name').val());
			var contact_tel = request.clear_str_null($('#contact_tel').val());
			if (!self.group_id) {
				mui.toast('请选择公司!');
				return false;
			}			

			if (!name) {
				mui.toast('客户名称不能为空!');
				return false;
			}

			if (!self.paystate_id) {
				mui.toast('请选择结算方式!');
				return false;
			}
			if (!contact_name) {
				mui.toast('联系人不能为空!');
				return false;
			}
			var c_m = request.checkMobile(contact_tel);
			if (c_m) {
				mui.toast('联系电话(手机号)格式错误！');
				return false;
			}
	
			var data = {
				group_code:self.group_id,
				company_name:name,
				cost_type:self.paystate_id,
				tel:contact_tel,
				contacts:contact_name,
				address:self.address ? self.address : '',
				self_id:self.get_id,
				type:'customer'
			};
			
			var url = request.tms_group_addgroup;

			request.PostInfo_new(url,data,function(res){
		  		if (self.from){
		  			plus.webview.getWebviewById(self.from).evalJS("set_customer()");
		  			// plus.webview.currentWebview().opener().evalJS("set_customer()");
		  		} else {
		  			plus.webview.getWebviewById('../customer/list.html').reload();
		  		}

		  		mui.back();
		  	},function(res){

		  	});
		}
	}
});

$(document).on('click','#button',function(){
	vm.submitFun();
});