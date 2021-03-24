
function objSort(prop){  // 排序函数
	return function(obj1,obj2){
		var val1 = obj1[prop];
		var val2 = obj2[prop];
		if(!isNaN(Number(val1)) && !isNaN(Number(val2))){
			val1 = Number(val1);
			val2 = Number(val2);
		}
		if(val1 < val2){
			return -1;
		}
		if(val1 > val2){
			return 1;
		}else{
			return 0;
		}
	}
}

var now_is_search = 1;
var now_is_search_city_start = 1;
var now_is_search_city_end = 1;
var now_is_search_tem = 1;
var vm2_bulk = new Vue({
	el:'#startDate',
	data:{
		starttime:'',
		select_date:'',
		week:'',
		switch:1
	},
	mounted:function(){
		var self = this;
		mui.plusReady(function(){
			var date = new Date();
			var seperator1 = "-";
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var currentdate = year + seperator1 + month + seperator1 + strDate;
			
			self.select_date = currentdate;
			self.set_date(new Date(currentdate));
			$('#startDate').val(currentdate);
		});
	},
	methods:{
		set_date:function(date){
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var we_ek = date.getDay();  
			var week_day = ['周日','周一','周二','周三','周四','周五','周六'];
			this.week = week_day[we_ek];
			if (month < 10) {
				month = "0" + month;
			}
			if (day < 10) {
				day = "0" + day;
			}
			this.select_date = year + "-" + month + "-" + day;
			var nowDate = month + "月" + day + '日';
			this.starttime = nowDate;
		},
	}
});

//实例化vue
var vm = new Vue({
	el: '#dataList',
	data : {
		start_id : '',   // 发货id
		end_id : '',     // 收货id
		start_name:'',   // 发货name
		end_name:'',     // 收货name
		start_eare:'',
		end_eare:'',
		pro_id: '',
		mescroll : null,
		lineList:[],  //零担线路数据
		vehicalList:[],  //整车线路数据
		cityList:[],  //城配线路数据
		vehicalCheapList:[], //特价整车线路数据,
		line: '',
		vehicle: '',
		cheap: '',
		selecttime:'',
		pros:proAllData,
		citys:cityAllData,
		starttime:'',
		select_date:'',
		week:'',
		self_id:''
	},
	
	mounted: function(){
		var self = this;
		//获取起终点城市id
		mui.plusReady(function(){
			var page = plus.webview.currentWebview();
			self.start_id = page.startcity_id;
			self.end_id = page.endcity_id;
			self.start_name = page.startcity_name;
			self.end_name = page.endcity_name;
			self.start_eare = page.start_eare;
			self.end_eare = page.end_eare;
			self.pro_id = page.pro_id;
			self.selecttime = page.selecttime;
			self.line = page.line || false;
			self.vehicle = page.vehicle || false;
			self.cheap = page.cheap || false;
		   	self.mescroll = new MeScroll('mescroll',{
				up: {
					callback: self.upCallback,
					page:{size:10,num:1},
					noMoreSize:1,
					empty: {
						warpId:"dataList",
						icon: "../images/empty/car.png", //图标,默认null
						tip: "暂无相关线路", //提示
					},
				}
			})			
		});
	},
	methods:{
		upCallback:function(page){
			var self = this;
			self.getTransportData(page.num);
		},
		getTransportData:function(pageNum){
			var self = this;
			var data = {
				startcity:'',
				endcity:'',
				page : pageNum,
				template:'',
				state:'',
				status:'1',
				time:vm2_bulk.select_date,
				// time:'2021-02-22'
			}
			if(pageNum == 1){ //数据请求接口未分页，每次加载均清空列表
				self.lineList = [];
				self.vehicalList = [];
				self.cityList = [];
				self.vehicalCheapList = [];
			}
			var obj = $('#search_data');
			if (now_is_search_tem == 0){
				var car_4 = '';
				var car_obj = obj.find('.title_mask4 .temperture_group .select_active');
				if (car_obj.length > 0) {
					data.template = car_obj.text();
				}
			}
			if (now_is_search_city_start == 0){
					var sear_2 = '';
					var sear_2_pro = obj.find('.title_mask2 .select_pro').text();
					var sear_2_city = obj.find('.title_mask2 .select_city').attr('data');
					var sear_2_city_id = obj.find('.title_mask2 .select_city').attr('data_id');
					if (sear_2_pro != '全国') {
						if (!sear_2_city_id) {
							sear_2 = sear_2_pro;
						}else {
							sear_2 = sear_2_city;
						}
					}
					data.startcity = sear_2;
			}
			if (now_is_search_city_end == 0){		
					var sear_3 = '';
					var sear_3_pro = obj.find('.title_mask3 .select_pro').text();
					var sear_3_city = obj.find('.title_mask3 .select_city').attr('data');
					var sear_3_city_id = obj.find('.title_mask3 .select_city').attr('data_id');
					if (sear_3_pro != '全国') {
						if (!sear_3_city_id) {
							sear_3 = sear_3_pro;
						} else {
							sear_3 = sear_3_city;
						}
					}
					data.endcity = sear_3;
			}
			if (now_is_search == 0){
				data.state = $('#search_data .mui-s-data-v1').attr('data');
			}
			console.log(JSON.stringify(data));
			request.PostInfo_new(request.onlinePage,data,function(response){
				console.log("刷新");
				// console.log("response"+JSON.stringify(response));
				var code = parseInt(response.code);
				var data = response.data.items;
				if(data){    // 如果有数据，就要隐藏为空下的提示
					document.getElementById("nulltips").style.display = "none";
				}
				if(data.vehical) {
					self.vehicalList = self.vehicalList.concat(data.vehical);
				}
				if(data){
					self.lineList = self.lineList.concat(data);
					self.mescroll.endSuccess(data.length);
				} else {
					self.mescroll.endSuccess(0);//数据请求接口未分页，暂只展示第一次请求的数据
				}
				
			},function(response){
				self.mescroll.endSuccess(0);
			})
		},
		
		toBulkOrderDetail: function(index,lineList){    //前往零担 下单详情页面
			var self = this;
			var token = localStorage.ftoken;
			// var owm_info =JSON.parse(localStorage.owm_info);
			
			// console.log("owm_info:"+owm_info.total_user_id);	
			// console.log(lineList[index].total_user_id);
			if(!token){
				openLogin();
				return false;
			}
			
			
			// if(lineList[index].total_user_id == owm_info.total_user_id ){
			// 	mui.toast("不可以及接自己下的订单");
			// 	return false;
			// }
			
			mui.openWindow({
			    url:"on_line_details.html",
			    id:"user_line/on_line_details.html",
			    extras:{
					self_id:lineList[index].self_id,
			  //     	slid: self.lineList[index].slid,
					// start_id: self.lineList[index].startcity,
					// end_id: self.lineList[index].endcity,
					// shiftstate:self.lineList[index].shiftstate,
					// //下面是传递的6个新参数
					// lethpickaddress:self.lineList[index].picksite,
					// lethstime:self.lineList[index].stime,
					// lethphone:self.lineList[index].sphone,
					// lethsendadress:self.lineList[index].sendsite,
					// lethdtime:self.lineList[index].dtime,
					// lethtphone:self.lineList[index].tphone,
					// smoney:self.lineList[index].pickprice,
					// pmoney:self.lineList[index].sendprice,
					// sid:self.lineList[index].sid,
					// eprice:self.lineList[index].eprice,
			    },
			    waiting:{
			      	autoShow:false,//自动显示等待框，默认为true
			      	title:'正在加载...',//等待对话框上显示的提示内容
			    }
			})
		},
		
		// toSourceOrderDetail:function(){
		// 	var self = this;	
		// },
		// toBulkCommentList:function(index){
		// 	var self = this;
		// 	console.log(index);
		// 	var data = self.lineList[index];
		// 	console.log(JSON.stringify(data));
		// 	mui.openWindow({
		// 	    url:"../comment/commentline.html",
		// 	    id:"commentline.html",
		// 	    extras:{
		// 	    	shiftid : data.sid,
		// 	    },
		// 	    waiting:{
		// 	      	autoShow:true,//自动显示等待框，默认为true
		// 	      	title:'正在加载...',//等待对话框上显示的提示内容
		// 	      	options:{}
		// 	    }
		// 	});
		// }
	},
	filters:{
		fliterTimeStr: function(value){
			return value.substring(0,10);
		},
	}
})

mui.init({
	swipeBack: false
});
var search_data = new Vue({
	el: '#search_data',
	data: {
		pros:proAllData,
		citys:cityAllData
	}
});
function get_city(pid){
	var arr = [];
	var node = '';
	for (var i in search_data.citys) {
		if (search_data.citys[i].provval == pid) {
			arr.push(search_data.citys[i]);
		}
	}
	for (var i in arr) {
		node += '<div class="temperture_one">'
		var city = arr[i].city;
		var parval = arr[i].parval;
		var city_4 = city.substr(0,4);
			if (i == 0) {
				node += '<button class="citys_btn select_active" data_id="'+parval+'" data="'+city+'" data_4="'+city_4+'">'+city_4+'</button>'
				var i = $('.nav .activecolor').attr('id');
				if (i == 'type0') {
					var data = $('#type0_add').val();
					if (data == 2) {
						var obj_select_city = $('#search_data .title_mask2 .select_city');
					} else if (data == 3) {
						var obj_select_city = $('#search_data .title_mask3 .select_city');
					}
				} else if (i == 'type2') {
					var data = $('#type2_add').val();
					if (data == 2) {
						var obj_select_city = $('#search_data_bulk .title_mask2 .select_city');
					} else if (data == 3) {
						var obj_select_city = $('#search_data_bulk .title_mask3 .select_city');
					}
				}
				obj_select_city.attr('data',city).attr('data_id',parval).attr('data_4',city_4).text(city);
			} else {
				node += '<button class="citys_btn" data_id="'+parval+'" data="'+city+'" data_4="'+city_4+'">'+city_4+'</button>'
			}
			node += '</div>'
	}
	return node;
}

$('.mui-scroll-wrapper').scroll({
	indicators: true //是否显示滚动条
});
				
function lister_slider(e){
	var i = $('.nav .activecolor').attr('id');
	console.log('i:'+i);
	if (i == 'type0') {
		var data = $('#type0_add').val();
		if (data == 2) {
			var item2 = document.getElementById('item2mobile');
			var obj_select_pro = $('#search_data .title_mask2 .select_pro');
			var obj_select_city = $('#search_data .title_mask2');
		} else if (data == 3) {
			var obj_select_pro = $('#search_data .title_mask3 .select_pro');
			var obj_select_city = $('#search_data .title_mask3');
			var item2 = document.getElementById('item2mobile_end');
		}
	} else if (i == 'type2') {
		var data = $('#type2_add').val();
		if (data == 2) {
			var item2 = document.getElementById('item2mobile_bulk');
			var obj_select_pro = $('#search_data_bulk .title_mask2 .select_pro');
			var obj_select_city = $('#search_data_bulk .title_mask2');
		} else if (data == 3) {
			var obj_select_pro = $('#search_data_bulk .title_mask3 .select_pro');
			var obj_select_city = $('#search_data_bulk .title_mask3');
			var item2 = document.getElementById('item2mobile_end_bulk');
		}
	}
	var city = obj_select_city.find('.select_city').attr('data_4');
	var now_city = obj_select_city.find('.citys_btn.select_active').text();

	var flag = false;
	if (!city && !now_city) {
		flag = true;
	}

	if (city != now_city || flag) {
		if (e.detail.slideNumber === 1) {
			item2.querySelector('.mui-scroll-new').innerHTML = '';
		}
		var select_pro_id = obj_select_pro.attr('data_id');
		var html2 = get_city(select_pro_id);
		if (e.detail.slideNumber === 1) {
			if (item2.querySelector('.mui-loading')) {
				setTimeout(function() {
					item2.querySelector('.mui-scroll-new').innerHTML = html2;
				}, 500);
			} else {
				setTimeout(function() {
					item2.querySelector('.mui-scroll-new').innerHTML = html2;
				}, 500);
			}
		}
	}
}

// 始发地
document.getElementById('slider').addEventListener('slide', function(e) {
	lister_slider(e)
});				
// 目的地
document.getElementById('slider_end').addEventListener('slide', function(e) {
	lister_slider(e)
});				

function click_pro(that) {
	var val = that.text();
	var id = that.attr('data');
	var i = $('.nav .activecolor').attr('id');
	if (i == 'type0') {
		var data = $('#type0_add').val();
		if (data == 2) {
			var old_val = $('#search_data .title_mask2 .select_pro').attr('data'); 
			var obj_select_city = $('#search_data .title_mask2 .select_city');
			var obj_select_pro = $('#search_data .title_mask2 .select_pro');
			var obj_pros_btn = $('#search_data .title_mask2 .pros_btn');
		} else if (data == 3) {
			var old_val = $('#search_data .title_mask3 .select_pro').attr('data');
			var obj_select_city = $('#search_data .title_mask3 .select_city');
			var obj_select_pro = $('#search_data .title_mask3 .select_pro');
			var obj_pros_btn = $('#search_data .title_mask3 .pros_btn');
		}
	} else if (i == 'type2') {
		var data = $('#type2_add').val();
		if (data == 2) {
			var old_val = $('#search_data_bulk .title_mask2 .select_pro').attr('data'); 
			var obj_select_city = $('#search_data_bulk .title_mask2 .select_city');
			var obj_select_pro = $('#search_data_bulk .title_mask2 .select_pro');
			var obj_pros_btn = $('#search_data_bulk .title_mask2 .pros_btn');
		} else if (data == 3) {
			var old_val = $('#search_data_bulk .title_mask3 .select_pro').attr('data');
			var obj_select_city = $('#search_data_bulk .title_mask3 .select_city');
			var obj_select_pro = $('#search_data_bulk .title_mask3 .select_pro');
			var obj_pros_btn = $('#search_data_bulk .title_mask3 .pros_btn');
		}
	}
	if (val != old_val) {
		obj_select_city.attr('data','城市').attr('data_id','').attr('data_4','').text('城市');
	}
	obj_select_pro.attr('data',val).attr('data_id',id).text(val);
	obj_pros_btn.removeClass('select_active');
	that.addClass('select_active');
}

// 点击省份
$(document).on('tap','#search_data .pros_btn',function(){
	click_pro($(this));
});				
$(document).on('tap','#search_data_bulk .pros_btn',function(){
	click_pro($(this));
});	

function click_city(that) {
	var val = that.text();
	var data_city = that.attr('data');
	var id = that.attr('data_id');
	var i = $('.nav .activecolor').attr('id');
	if (i == 'type0') {
		var data = $('#type0_add').val();
		if (data == 2) {
			var obj_select_city = $('#search_data .title_mask2 .select_city');
			var obj_city_btn = $('#search_data .title_mask2 .citys_btn');
		} else if (data == 3) {
			var obj_select_city = $('#search_data .title_mask3 .select_city');
			var obj_city_btn = $('#search_data .title_mask3 .citys_btn');
		}
	} else if (i == 'type2') {
		var data = $('#type2_add').val();
		if (data == 2) {
			var obj_select_city = $('#search_data_bulk .title_mask2 .select_city');
			var obj_city_btn = $('#search_data_bulk .title_mask2 .citys_btn');
		} else if (data == 3) {
			var obj_select_city = $('#search_data_bulk .title_mask3 .select_city');
			var obj_city_btn = $('#search_data_bulk .title_mask3 .citys_btn');
		}
	}
	obj_select_city.attr('data_4',data_city).attr('data',val).attr('data_id',id).text(data_city);
	obj_city_btn.removeClass('select_active');
	that.addClass('select_active');
}		

// 点击城市
$(document).on('tap','#search_data .citys_btn',function(){
	click_city($(this))
});			
$(document).on('tap','#search_data_bulk .citys_btn',function(){
	click_city($(this))
});

function indexMaskClose() {}

$('.title_mask').css({"height":$('html').height()*0.6+'px'});
function click_s_data(that,id) {
	var data = that.attr('data');
	var i = $('.nav .activecolor').attr('id');
	if (i == 'type0') {
		$('#type0_add').val(data);
	} else if (i == 'type2') {
		$('#type2_add').val(data);
	}
	var active = $('#'+id+' .data-active') ? $('#'+id+' .data-active').attr('data') : 1;
	if (data != active) {
		$('#'+id+' .data-active').slideToggle("fast");
		$('#'+id+' .search_marker').removeClass('data-active');
		$('#'+id+' .mui-s-data').removeClass('mui-s-data-active').find('img').attr('src','../images/driver/line_down.png').css({"margin-bottom":"0px"});
		$('#'+id+' .mui-s-data[data="'+data+'"]').addClass('mui-s-data-active').find('img').attr('src','../images/driver/line_up.png').css({"margin-bottom":"3px"});
		$('#'+id+' .search_marker[data="'+data+'"]').addClass('data-active').slideToggle("fast");
		mask.show();//显示遮罩
	}
}
// 切换 排序
$(document).on('tap','#search_data .mui-s-data',function(){
	click_s_data($(this),'search_data')
});			
$(document).on('tap','#search_data_bulk .mui-s-data',function(){
	click_s_data($(this),'search_data_bulk')
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

/*search_data*/
			// init title_mask4
			function init_mask4(){
				var i = $('.nav .activecolor').attr('id');
				if (i == 'type0') {
					var obj_select_active = $('#search_data .title_mask4 .select_active');
					var obj_data = $('#search_data .mui-s-data-v4');
				} else if (i == 'type2') {
					var obj_select_active = $('#search_data_bulk .title_mask4 .select_active');
					var obj_data = $('#search_data_bulk .mui-s-data-v4');
				}
				if (i == 'type0' || i == 'type2') {
					var len = obj_select_active.length;
					var node = '';
					if (len > 0) {
						node += '更多<span class="mui-badge" style="">'+len+'</span>';
					} else {
						node += '更多';
					}
					obj_data.empty().append(node);
				}
			}			

			// init title_mask2
			function init_mask2(){
				var i = $('.nav .activecolor').attr('id');
				var node = '';
				if (i == 'type0') {
					var data = $('#type0_add').val();
					if (data == 2) {
						var obj_select_active = $('#search_data .title_mask2 .select_active');
						var obj_select_pro = $('#search_data .title_mask2 .select_pro');
						var obj_data_s = $('#search_data .mui-s-data-v2');
						var len = obj_select_active.length;
						var search_data = obj_select_pro.attr('data_id');
						if (len > 0 && search_data > 0) {
							node += '始发地<span class="mui-badge" style="">1</span>';
						} else {
							node += '始发地';
						}
					} else if (data == 3) {
						var obj_select_active = $('#search_data .title_mask3 .select_active');
						var obj_select_pro = $('#search_data .title_mask3 .select_pro');
						var obj_data_s = $('#search_data .mui-s-data-v3');
						var len = obj_select_active.length;
						var search_data = obj_select_pro.attr('data_id');
						if (len > 0 && search_data > 0) {
							node += '目的地<span class="mui-badge" style="">1</span>';
						} else {
							node += '目的地';
						}
					}
				} else if (i == 'type2') {
					var data = $('#type2_add').val();
					if (data == 2) {
						var obj_select_active = $('#search_data_bulk .title_mask2 .select_active');
						var obj_select_pro = $('#search_data_bulk .title_mask2 .select_pro');
						var obj_data_s = $('#search_data_bulk .mui-s-data-v2');
						var len = obj_select_active.length;
						var search_data = obj_select_pro.attr('data_id');
						if (len > 0 && search_data > 0) {
							node += '始发地<span class="mui-badge" style="">1</span>';
						} else {
							node += '始发地';
						}
					} else if (data == 3) {
						var obj_select_active = $('#search_data_bulk .title_mask3 .select_active');
						var obj_select_pro = $('#search_data_bulk .title_mask3 .select_pro');
						var obj_data_s = $('#search_data_bulk .mui-s-data-v3');
						var len = obj_select_active.length;
						var search_data = obj_select_pro.attr('data_id');
						if (len > 0 && search_data > 0) {
							node += '目的地<span class="mui-badge" style="">1</span>';
						} else {
							node += '目的地';
						}
					}
				}
				if (data == 2 || data == 3) {
					obj_data_s.empty().append(node);
				}
			}

			function select_btn(that){
				var c = that.hasClass('select_active');
				if (c) {
					that.removeClass('select_active');
				} else {
					that.addClass('select_active');
				}
			}			

			function select_btn_tem(that){
				var c = that.hasClass('select_active');
				$('.temperture_btn').removeClass('select_active')
				if (c) {
					that.removeClass('select_active');
				} else {
					that.addClass('select_active');
				}
			}

			// 点击温度
			$(document).on('tap','.temperture_btn',function(){
				select_btn_tem($(this));
			});
			// 点击车型
			$(document).on('tap','.cartype_btn',function(){
				select_btn($(this));
			});

			// 重置4
			$(document).on('tap','#search_data .reset_btn4',function(){
				$('#search_data .title_mask4 button').removeClass('select_active');
				init_mask4();
			});
			$(document).on('tap','#search_data_bulk .reset_btn4',function(){
				$('#search_data_bulk .title_mask4 button').removeClass('select_active');
				init_mask4();
			});

			// 更多 确认
			$(document).on('tap','#search_data .confirm_btn4',function(){
				init_mask4();
				now_is_search_tem = 0;
				vm.upCallback({num:1,size:10})
				no_marker();
				mask.close();
			});	

			// 更多 确认
			$(document).on('tap','#search_data_bulk .confirm_btn4',function(){
				init_mask4();
				now_is_search_tem = 0;
				vm.upCallback({num:1,size:10})
				no_marker();
				mask.close();
			});	

			// 地址确认	
			function confirm_23(){
				var arr = ['全国','北京市','上海市','天津市','重庆市'];

				var i = $('.nav .activecolor').attr('id');
				if (i == 'type0') {
					var data = $('#type0_add').val();
					if (data == 2) {
						var obj_select_pro = $('#search_data .title_mask2 .select_pro');
						var obj_select_city = $('#search_data .title_mask2 .select_city');
					} else if (data == 3) {
						var obj_select_pro = $('#search_data .title_mask3 .select_pro');
						var obj_select_city = $('#search_data .title_mask3 .select_city');
					}
				} else if (i == 'type2') {
					var data = $('#type2_add').val();
					if (data == 2) {
						var obj_select_pro = $('#search_data_bulk .title_mask2 .select_pro');
						var obj_select_city = $('#search_data_bulk .title_mask2 .select_city');
					} else if (data == 3) {
						var obj_select_pro = $('#search_data_bulk .title_mask3 .select_pro');
						var obj_select_city = $('#search_data_bulk .title_mask3 .select_city');
					}
				}
				var pro = obj_select_pro.attr('data');
				var city_id = obj_select_city.attr('data_id');
				if (arr.indexOf(pro) == -1) {
					if (city_id == '') {
						mui.toast('请左滑动或者点击“请选择市”选择城市！');
						return false;
					}
				}
				init_mask2();
				no_marker();
				mask.close();
				return true;
			}	

			function reset_23() {
				var i = $('.nav .activecolor').attr('id');
				if (i == 'type0') {
					var data = $('#type0_add').val();
					if (data == 2) {
						var obj_select_pro = $('#search_data .title_mask2 .select_pro');
						var obj_select_city = $('#search_data .title_mask2 .select_city');
						var obj_pros_btn = $('#search_data .title_mask2 .pros_btn');
						var obj_pros_btn_one = $('#search_data .title_mask2 .pros_btn[data="0"]');
						var obj_citys_btn = $('#search_data .title_mask2 .citys_btn');
						var obj_group = $('#search_data .title_mask2 .mui-slider-group');
						var obj_item = $('#search_data .title_mask2 .mui-control-item');
						var obj_scroll2 = $('#search_data #scroll2');
					} else if (data == 3) {
						var obj_select_pro = $('#search_data .title_mask3 .select_pro');
						var obj_select_city = $('#search_data .title_mask3 .select_city');
						var obj_pros_btn = $('#search_data .title_mask3 .pros_btn');
						var obj_pros_btn_one = $('#search_data .title_mask3 .pros_btn[data="0"]');
						var obj_citys_btn = $('#search_data .title_mask3 .citys_btn');
						var obj_group = $('#search_data .title_mask3 .mui-slider-group');
						var obj_scroll2 = $('#search_data #scroll2_end');
						var obj_item = $('#search_data .title_mask3 .mui-control-item');
					}

				} else if (i == 'type2') {
					var data = $('#type2_add').val();
					if (data == 2) {
						var obj_select_pro = $('#search_data_bulk .title_mask2 .select_pro');
						var obj_select_city = $('#search_data_bulk .title_mask2 .select_city');
						var obj_pros_btn = $('#search_data_bulk .title_mask2 .pros_btn');
						var obj_pros_btn_one = $('#search_data_bulk .title_mask2 .pros_btn[data="0"]');
						var obj_citys_btn = $('#search_data_bulk .title_mask2 .citys_btn');
						var obj_group = $('#search_data_bulk .title_mask2 .mui-slider-group');
						var obj_item = $('#search_data_bulk .title_mask2 .mui-control-item');
						var obj_scroll2 = $('#search_data_bulk #scroll2');
					} else if (data == 3) {
						var obj_select_pro = $('#search_data_bulk .title_mask3 .select_pro');
						var obj_select_city = $('#search_data_bulk .title_mask3 .select_city');
						var obj_pros_btn = $('#search_data_bulk .title_mask3 .pros_btn');
						var obj_pros_btn_one = $('#search_data_bulk .title_mask3 .pros_btn[data="0"]');
						var obj_citys_btn = $('#search_data_bulk .title_mask3 .citys_btn');
						var obj_group = $('#search_data_bulk .title_mask3 .mui-slider-group');
						var obj_scroll2 = $('#search_data_bulk #scroll2_end');
						var obj_item = $('#search_data_bulk .title_mask3 .mui-control-item');
					}
				}
				obj_pros_btn.removeClass('select_active');
				obj_pros_btn_one.addClass('select_active');
				obj_citys_btn.removeClass('select_active');
				obj_select_pro.text('全国').attr('data','全国').attr('data_id','0');
				obj_select_city.text('城市').attr('data','').attr('data_id','').attr('data_4','');
				obj_scroll2.find('.mui-scroll-new').empty();
				// obj_group.css({"transform":"translate3d(0px, 0px, 0px) translateZ(0px)"});
				obj_item.removeClass('mui-active');
				obj_item.eq(0).addClass('mui-active');
				$('.slider_end').toggle('slide');
			}

			// 2 重置
			$(document).on('tap','#search_data .reset_btn2',function(){
				reset_23()
			});			

			// 3 重置
			$(document).on('tap','#search_data .reset_btn3',function(){
				reset_23()
			});				

			// 2 确认
			$(document).on('tap','#search_data .confirm_btn2',function(){
				var flag = confirm_23();
				if (!flag) {
					return false;
				}
				now_is_search_city_start = 0;
				vm.upCallback({num:1,size:10})
			});					

			// 3 确认
			$(document).on('tap','#search_data .confirm_btn3',function(){
				var flag = confirm_23();
				if (!flag) {
					return false;
				}
				now_is_search_city_end = 0;
				vm.upCallback({num:1,size:10})
			});	

			// 2 重置
			$(document).on('tap','#search_data_bulk .reset_btn2',function(){
				reset_23()
			});			

			// 3 重置
			$(document).on('tap','#search_data_bulk .reset_btn3',function(){
				reset_23()
			});				

			// 2 确认
			$(document).on('tap','#search_data_bulk .confirm_btn2',function(){
				confirm_23()
				now_is_search_city = 0;
				vm.upCallback({num:1,size:10})
			});					

			// 3 确认
			$(document).on('tap','#search_data_bulk .confirm_btn3',function(){
				confirm_23()
				now_is_search_city = 0;
				vm.upCallback({num:1,size:10})
			});		

			// 排序1
			$(document).on('tap','#search_data .title_mask1 ul li',function(){
				var data = $(this).attr('data');
				var data_v = $(this).attr('data_v');
				$('#search_data .mui-s-data-v1').text(data_v);
				$('#search_data .mui-s-data-v1').attr('data',data);
				now_is_search = 0;
				vm.upCallback({num:1,size:10})
				no_marker();
				mask.close();
			});

			// 排序1
			$(document).on('tap','#search_data_bulk .title_mask1 ul li',function(){
				var data = $(this).attr('data');
				var data_v = $(this).attr('data_v');
				$('#search_data_bulk .mui-s-data-v1').text(data_v);
				now_is_search = 0;
				vm.upCallback({num:1,size:10})
				no_marker();
				mask.close();
			});
			/*search_data*/