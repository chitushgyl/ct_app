/**
 * 页面刷新
 */
function refreshData(){
	vm.getAdsList();		
}
// 初始化vue
var vm = new Vue({
	el: '#template',
	data: {
		cityID: null,   //记录正在查询的城市ID
		proID : null,     //记录正在查询的城市所在的省份ID
		addressList:[{a:1111}],   //常用地址列表
		showlist:[],     //显示地址列表
		selectaddress:null,   //输入的地址
		addressType:null,
		mescroll: null,
	},
	mounted: function(){
		var self = this;
		mui.init();
		mui.plusReady(function(){
			var selfPage = plus.webview.currentWebview();
			self.cityID = selfPage.cityID;    //记录城配下单页面传来的城市id
			self.proID = selfPage.proID;     //记录正在查询的城市所在的省份ID
			// self.getAdsList();
			self.mescroll = new MeScroll("mescroll", {
				up: {
					callback: self.upCallback, //上拉回调
					page: {
						size: 10
					}, //可配置每页8条数据,默认10
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: { //配置列表无任何数据的提示
						warpId: "dataList",
						icon: "../images/empty/noAddress.png",
						tip: '<p style="font-size: 16px;color: #8590a6;">暂无可用地址<p>',
					}
				}
			});
			
		}
	)},
	watch:{
		selectaddress:function(newval,oldval){
			var self = this;
			var arr = new Array();
			for(var i = 0 ; i< self.addressList.length ;i++ ){
				var str = self.addressList[i].sheng_name
						+ self.addressList[i].shi_name
						+ self.addressList[i].qu_name
						+ self.addressList[i].address
						+ self.addressList[i].contacts
						+ self.addressList[i].tel;
				if(str.indexOf(newval) != -1){
					arr.push(self.addressList[i]);
				}
			}
			self.showlist = arr;
		},
	},
	methods: {
		upCallback: function(page) { //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
			//联网加载数据
			var self = this;
			self.getAdsList(page.num,1);
		},
		getAdsList: function(pageNum,cityId){ // 获取地址列表
			var self = this;
			if(pageNum == 1) self.showlist = [];
			if(!self.cityID){
				self.cityID = '';
			}
			var data = {
				page:1
			};
			var project_type = request.project_type;
			console.log(project_type);
			if (project_type == 'TMS3PL') {
				request.PostInfo_new(request.tms_address_addressPage,data,function(res){
					console.log(JSON.stringify(res.data.items));
					self.addressList = res.data.total;
					console.log(self.addressList)
					var data = res.data.items;
					console.log(JSON.stringify(self.addressList));
					defauldata = res.data.items.filter(item => item.default===2)
					console.log("设置默认state地址address更新"+defauldata);
					user.setState('address',{
						address: defauldata.sheng_name + defauldata.shi_name + defauldata.qu_name + defauldata.address,
						addressName: defauldata.contacts,
						addressPhone: defauldata.tel},function(){});
						setTimeout(function() {
							self.showlist = self.showlist.concat(data);
							console.log(JSON.stringify(self.carList));
							self.mescroll.endSuccess(data.length);
						},500);
				},function(){})	
				
			} else {
				var data = {
					page:1
				}
				request.PostInfo_new(request.api_address_addressPage,data,function(res){
					console.log(JSON.stringify(res));
					self.addressList = res.data.total;
					var data = res.data.info;
					defauldata = res.data.info.filter(item => item.default===2)
					console.log("设置默认state地址address更新"+defauldata);
					user.setState('address',{
						address: defauldata.sheng_name + defauldata.shi_name + defauldata.qu_name + defauldata.address,
						addressName: defauldata.contacts,
						addressPhone: defauldata.tel},function(){});
						setTimeout(function() {
							self.showlist = self.showlist.concat(data);
							console.log(JSON.stringify(self.carList));
							self.mescroll.endSuccess(data.length);
						},500);
				},function(){})	
			}
		},
		delAddress: function(index){ // 删除地址
			var self  = this;
			mui.confirm('删除后数据将无法恢复','确定删除信息？',["确认","取消"],function(e){
				if(e.index == 0){
					var address_id = self.showlist[index].self_id;
					console.log(address_id);
					var data = {
						// token : user.getState('token'),
						self_id : address_id
					}
					console.log(JSON.stringify(data));
					// request.PostInfo_new(request.tms_address_addressDelFlag,data,function(res){
					// 	console.log(JSON.stringify(res));
					// });
					var project_type = request.project_type;
					if(project_type=='TMS3PL'){
						request.PostInfo_new(request.tms_address_addressDelFlag,data,function(res){
							self.showlist.splice(index, 1);
							mui.toast(res.msg);
							location.reload();
						},function(res){});	
					}
					else{
						request.PostInfo_new(request.api_address_addressDelFlag,data,function(res){
							self.showlist.splice(index, 1);
							mui.toast(res.msg);
							location.reload();
						},function(res){});	
						}
									
				}
			},'div');
		},
		editorAddress: function(index) { // 编辑地址
			var self  = this;
			var address_id = self.showlist[index].self_id;
			var sheng = self.showlist[index].sheng;
			var sheng_name= self.showlist[index].sheng_name;
			var shi = self.showlist[index].shi;
			var shi_name = self.showlist[index].shi_name;
			var qu = self.showlist[index].qu;
			var qu_name = self.showlist[index].qu_name;
			var address = self.showlist[index].address; 
			var contacts = self.showlist[index].contacts;
			var tel = self.showlist[index].tel;
			// console.log(tel);
			mui.openWindow({
			    url:"add_address.html",
			    id:"add_address",
			    extras:{
			    	type: 2,
			      	address_id:address_id,
			        sheng: sheng,
			        sheng_name: sheng_name,
			        shi: shi,
			        shi_name: shi_name,
			        qu: qu,
			        qu_name: qu_name,
			        address: address,
			        contacts: contacts,
			        tel: tel
			    },
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{}
			    }
			});
		},
		addAddress:function(){   //添加地址、传入城市ID，以便返回时刷新地址列表
			var self = this;
			mui.openWindow({
			    url:"add_address.html",
			    id:"add_address",
			    extras:{
			      	city_id:self.cityID,
			        pro_id: self.proID,
			    },
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{}
			    }
			});
		},
		returan: function(index) { // 返回数据
			var self  = this;
			// 本页面
			var wp = plus.webview.currentWebview().opener();
			// console.log(wp.id);
			// 如果是从个人中心跳转则不返回
			if(wp.id == "user/user.html") return false;
			var getaddress = JSON.stringify(self.showlist[index].pro_name+self.showlist[index].city_name+self.showlist[index].area_name+self.showlist[index].address);
			var address = JSON.stringify(self.showlist[index]);
			// 显示信息
			// wp.evalJS('listenBack('+address+','+phone+','+name+','+getaddress+')');
			wp.evalJS('listenBack('+address+')');
			// wp.evalJS('send_info('+address+')');
			
			mui.back();
		},
		reload:function(){
			var self = this;
			self.mescroll.resetUpScroll();
		}
	},
	filters: {
		isChecked: function(value){
			var checked = false;
			if(value == 2){
				checked = 'checked';
			}
			return checked;
		}
	}
});
