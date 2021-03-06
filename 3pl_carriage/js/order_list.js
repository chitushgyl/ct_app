
function refresh(){
	vm.$data.mescroll.resetUpScroll();
}
function refresh_show(){
	location.reload();
}
// 专车跨区订单详情页面
var orderDetail = null;
var orderDetail_bulk = null;
/*
 * @description: 选择
 * @parms self 点击的图片
 * */
function actionSheet(self){
	plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
        {title:"拍照"},  
        {title:"从相册中选择"}  
    ]}, function(e){//1 是拍照  2 从相册中选择  
        switch(e.index){  
            case 1:getImage(self);break;  
            case 2:getGalleryImage(self);break;  
        }  
    });  
}
/*
 * @description: 拍照
 * @parms self 点击的图片
 * */
function getImage(self){
	// 获取照相机对象
	var cmr = plus.camera.getCamera();
	// 图片的分辨率 320*240
    var res = cmr.supportedImageResolutions[0];
	// 图片的格式jpg
    var fmt = cmr.supportedImageFormats[0];
	// 进行拍照操作
    cmr.captureImage(function(path) {  
        // 读取文件
        plus.io.resolveLocalFileSystemURL(path, function(entry) {  
        	// 转化路径
            var localUrl = entry.toLocalURL();
            // 压缩上传
            plus.zip.compressImage({  
                src: localUrl,  
                dst: "_doc/chat/camera/" + localUrl,  
                quality: 20,  
                overwrite: true  
            }, function(e) {  
            	console.log("压缩成功" + e.target);
            	// 显示图片
            	self.setAttribute('src',e.target);
            }, function(err) {  
                console.log("压缩失败：  " + err.message);  
            });  
        });  
    }, function(err) {  
        console.error("拍照失败：" + err.message);  
    }, {  
        index: 1  
    });  
}

/*
 * @description: 从相册中选择文件
 * @parms self 点击的图片
 * */
function getGalleryImage(self) { 
	// 从系统相册选择文件
    plus.gallery.pick(function(path) {
    	// 压缩文件
        plus.zip.compressImage({  
            src: path,  
            dst: "_doc/chat/gallery/" + path,  
            quality: 20,  
            overwrite: true  
        }, function(e) {  
        	console.log("压缩成功" + e.target);
        	// 显示图片
        	self.setAttribute('src',e.target);
        }, function(err) {  
            console.error("压缩失败：" + err.message);  
        });  
    }, function(err) {});  
};

function listenBack_dis(data){
	$('#dataList').hide();
	vm.upCallback({num:1,size:10});
	if (data == 1) {
		vm.share_()
	}
}

/**
 * @description 此处采用vue.js 循环数据
 */
var vm = new Vue({
	el: '#carOrderList',
    data: {
		sliderNum: 0,// 类型; 进行中1; 已完成2; 已取消3
		current:1,
		nav_list:[
			{name:'待接单',type:'status1'},
			{name:'运输中',type:'status2'},
			{name:'已完成',type:'status3'},
		],
		status_name:'',
    	isShow:true,
        mescroll: null,
		list: [],
		clods: [],
		thButtonInfo: [],
		clod: "",
		listwo:[{a:1,b:2,c:3,d:9}],
		status:null,
    },
    mounted: function() {
    	var self = this;
    	// 初始化页面
    	mui.init();
    	//创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
		//解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
		mui.plusReady(function(){
			self.mescroll = new MeScroll("mescroll", {
				up: {
					callback: self.upCallback, //上拉回调
					page:{size:10}, //可配置每页8条数据,默认10
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						warpId:"dataList",
						icon: "../images/empty/order.png", //图标,默认null
						tip: '<p style="font-size: 16px;color: #999999;">暂无相关订单<p>', //提示
					}
				}
			});	
			
			var page = plus.webview.currentWebview();
			console.log(JSON.stringify(page));
			self.status_name=page.type;
			console.log('self.status_name是：'+self.status_name);
			self.nav_list.forEach((item,index)=>{
				if(item.type == self.status_name){
					self.sliderNum=index;
					return self.current=index;
				}
			})
			
			var shares = new share();
			shares.updateSerivces();
			self.share_ = function(){
				var href = request.url_share + '?a=carriage';
				var url_img = request.ServerUrl + '/image/logo.png';
				var msg={
					type:"web",
					title:"新订单",
					content:"来新订单了，注意查看！", // 分享内容
					href:href, // 分享图片
					thumbs:[url_img] // 缩略图
				};
				shares.openShare(msg);
			}

			mui('.nav').on('tap', '.nav-list', function() {
				var i = this.getAttribute("i");
				if (self.sliderNum != i) {
					//更改列表条件
					self.sliderNum = i;
					var leng = mui(".nav .nav-list").length;
					for (var n = 0; n < leng; n++) {
						mui(".nav .nav-list")[n].classList.remove("active");
					}
					this.classList.add("active");
					//重置列表数据
					self.mescroll.resetUpScroll();
				}
			});
		})
		
    },
	methods:{
		//上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
		upCallback: function(page) {
			console.log("page.num=="+page.num+", page.size=="+page.size);
			//联网加载数据
			var self = this;
			if(self.sliderNum==0){
				self.getListDataFromNet(page.num,1); // 调用接口
			}
			if(self.sliderNum==1){
				self.getListDataFromNet(page.num,2);
			}
			if(self.sliderNum==2){
				self.getListDataFromNet(page.num,3); // 调用接口
			}
			if(self.sliderNum==3){
				self.getListDataFromNet(page.num,4); // 调用接口
			}
			if(self.sliderNum==4){
				self.getListDataFromNet(page.num,2); // 调用接口
			}
		},
		to_detail:function(index){
			var self = this;
			var conid = self.list[index].self_id;
			console.log(conid)
			// plus.webview.getWebviewById('3pl_carriage/orderDetail.html').evalJS('refreshData()');
			mui.openWindow({
			    url:"orderDetail.html",
			    id:"3pl_carriage/orderDetail.html",
			    extras:{
			      	self_id: conid,
			      	type:1
			    },
			    waiting:{
			      autoShow:true,
			      title:'正在加载...',
			      options:{}
			    }
			});
		},
		getListDataFromNet:function(pageNum,status){
			var self = this;
			self.status = status;
			if(pageNum == 1) self.list = [];
			 
			var data = {
				page: pageNum,
				// status: 1
			}

			data.status = status;
			// console.log(data.status)
			request.PostInfo_new(request.api_carriage_OrderPage,data,function(res){
				// console.log(JSON.stringify(res.data))
				var data = res.data.items;
			// 	self.clod = "";
			// 	for (var i = 0; i < data.length; i++) {
			// 		self.clods = data[i].clod;
			// 		self.clod += self.clods;
			// 		self.thButtonInfo = data[i].button_info;
			// console.log(self.clod)
			// }
			// console.log(JSON.stringify(self.thButtonInfo));
				//更新列表数据
				self.list = self.list.concat(data);
				//传参:数据的总数; mescroll会自动判断列表是否有无下一页数据,如果数据不满一页则提示无更多数据;
				self.mescroll.endSuccess(data.length);
				$('#dataList').show();
			},function(res){
				//联网失败的回调,隐藏下拉刷新和上拉加载的状态;
				self.mescroll.endSuccess(0);
				$('#dataList').show();
				// self.mescroll.endErr();
				// mui.toast("连接服务器出错...");
			});
		},
		carrygoods: function(index){  //确认提货
			var list = this.list;
			var uoid = list[index].id;
			
			var btnArray = ['确认', '取消'];
			mui.confirm('确认该订单已送达？', '确定送达', btnArray, function(e) {
				if (e.index == 1) {

				} else {
					var data = {
						id: uoid,                       //订单id
					}

					request.PostInfo_new(request.driver_arriver_done,data,function(res){
						mui.toast(res.msg);
						vm.mescroll.resetUpScroll();
					},function(res){});

				}
			},"div");
		},		
		uploadImg:function(index){
			var self = this;
			var data = self.list[index];
			mui.openWindow({
			    url:'order_3pl/form.html',
			    id:'order_3pl/form.html',
			    styles:{},
			    extras:{
			      data:data
			    },
			    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			    show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			    },
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{
			        
			      }
			    }
			})
		},
		dis_order: function(index){  //调度
			var list = this.list;
			var uoid = list[index].id;
			var order_type = list[index].order_type;
			var startstr = list[index].startstr;
			var endstr = list[index].endstr;
			var btnArray = ['专车','零担', '取消'];
			mui.confirm('调度该订单为专车、零担运输？', '调度订单', btnArray, function(e) {
				if (e.index == 0) {
					mui.openWindow({
					    url:'../dis/driver.html',
					    id:'../dis/driver.html',
					    styles:{
					      
					    },
					    extras:{
					      oid:uoid,
					      startstr:startstr,
					      endstr:endstr,
					      order_type:order_type,
					      list:list[index],
					      from_url:'../driver/inner/order.html',
					      post_url:request.app_driver_dispatch,
					    },
					    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
					    show:{
					      autoShow:true,//页面loaded事件发生后自动显示，默认为true
					    },
					    waiting:{
					      autoShow:true,//自动显示等待框，默认为true
					      title:'正在加载...',//等待对话框上显示的提示内容
					      options:{
					        
					      }
					    }
					})
				} else if(e.index == 1)  {
					mui.openWindow({
					    url:'../../dis/driver_bulk.html',
					    id:'../../dis/driver_bulk.html',
					    styles:{
					      
					    },
					    extras:{
					      oid:uoid,
					      startstr:startstr,
					      endstr:endstr,
					      order_type:order_type,
					      list:list[index],
					      from_url:'../driver/inner/order.html',
					      post_url:request.app_driver_dispatch,
					    },
					    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
					    show:{
					      autoShow:true,//页面loaded事件发生后自动显示，默认为true
					    },
					    waiting:{
					      autoShow:true,//自动显示等待框，默认为true
					      title:'正在加载...',//等待对话框上显示的提示内容
					      options:{
					        
					      }
					    }
					})
				} else {

				}
			},"div");
		},

		cancel: function(index){//取消订单
			var self = this;
			var uoid = self.list[index].id;
			
			var btnArray = ['确认', '取消'];
			mui.confirm('订单取消后将无法恢复', '确定取消订单？', btnArray, function(e) {
				if (e.index == 1) {
					// console.log("成功");
				} else {
					console.log("确定取消订单");
					var data = {
						id: uoid,                       //订单id
					}
					request.PostInfo(request.app_driver_cancel_vehical,data,function(res){
						mui.toast(res.msg);
						vm.mescroll.resetUpScroll();
						localStorage.is_now_action = 1;
						plus.webview.getWebviewById('person/index-menu.html').reload();
					},function(res){});
				}
			},"div");
		},
		order_online: function(index){//上线订单
			var self = this;
			var uoid = self.list[index].id;
			
			var btnArray = ['确定上线','取消' ];
				mui.prompt('请输入上线价格(元)', '', '上线', btnArray, function(e) {
					if (e.index == 0) {
						if (!e.value && e.value <= 0) {
							mui.toast('请输入上线价格！');
							return false;
						} else {
							if (e.value < 20) {
								mui.toast('上线价格偏低！');
								return false;
							}
							var data = {
								id:uoid,
								line_price:e.value
							};
							mui.openWindow({
								url:'../payment/paymentVehical.html',
								id:'../payment/paymentVehical.html',
								createNew:true,
								extras:{
									line_price: e.value,
									order_id:uoid,
									from_:"../driver/inner/order.html",
									type_from:"../driver/inner/order.html",
								}
							});
						}	
					} else {}
				})
		},		
		uploadImg:function(index){
			var self = this;
			var data = self.list[index];
			mui.openWindow({
			    url:'../car/order_upload_img.html',
			    id:'../car/order_upload_img.html',
			    styles:{},
			    extras:{
			      data:data,
			    },
			    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
			    show:{
			      autoShow:true,//页面loaded事件发生后自动显示，默认为true
			    },
			    waiting:{
			      autoShow:true,//自动显示等待框，默认为true
			      title:'正在加载...',//等待对话框上显示的提示内容
			      options:{
			        
			      }
			    }
			})
		},
		order_unline: function(index){//下线订单
			var self = this;
			var uoid = self.list[index].id;
			
			var btnArray = ['确认', '取消'];
			mui.confirm('确认下线该订单吗？', '下线订单？', btnArray, function(e) {
				if (e.index == 1) {
					// console.log("成功");
				} else {
					var data = {
						id: uoid,                       //订单id
					}
					request.PostInfo_new(request.app_driver_unline,data,function(res){
						mui.toast(res.msg);
						vm.mescroll.resetUpScroll();
					},function(res){});
				}
			},"div");
		},		
		cancel_dispatch: function(index){//取消调度
			var self = this;
			var uoid = self.list[index].id;
			
			var btnArray = ['确认', '取消'];
			mui.confirm('确认该订单取消调度吗？', '取消调度？', btnArray, function(e) {
				if (e.index == 1) {
					// console.log("成功");
				} else {
					var data = {
						id: uoid,                       //订单id
					}
					request.PostInfo_new(request.app_driver_cancel_dispatch,data,function(res){
						mui.toast(res.msg);
						vm.mescroll.resetUpScroll();
						localStorage.is_now_action = 1;
						plus.webview.getWebviewById('person/index-menu.html').reload();
					},function(res){});
				}
			},"div");
		},		
		done_vehical: function(index){//上线订单 完成
			var self = this;
			var uoid = self.list[index].id;
			
			var btnArray = ['确认', '取消'];
			mui.confirm('确认该订单已经完成吗？', '完成订单', btnArray, function(e) {
				if (e.index == 1) {
					// console.log("成功");
				} else {
					var data = {
						id: uoid,                       //订单id
					}
					request.PostInfo_new(request.app_driver_done_vehical,data,function(res){
						mui.toast(res.msg);
						vm.mescroll.resetUpScroll();
					},function(res){});
				}
			},"div");
		},		
		vehical_done: function(index,id){//内部订单 完成
			var self = this;
			var data=self.list[index];
			var uoid = self.list[index].self_id;
			var btnArray = ['确认', '取消'];
			if(id == 130){
				mui.confirm('确认该订单已经送达吗？', '订单送达', btnArray, function(e) {
					if (e.index == 1) {
						// console.log("成功");
					} else {
						var data = {
							order_id: uoid,                       //订单id
						}
						request.PostInfo_new(request.api_carriage_dispatch,data,function(res){
							mui.toast(res.msg);
							vm.mescroll.resetUpScroll();
							
						},function(res){});
					}
				},"div");
			}
			//上传回单
			if(id==131){
				mui.openWindow({
				    url:'../3pl_carriage/uploadImg.html',
				    id:'../3pl_carriage/uploadImg.html',
				    styles:{},
				    extras:{
				      data:data
				    },
				    createNew:true,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
				    show:{
				      autoShow:true,//页面loaded事件发生后自动显示，默认为true
				    },
				    waiting:{
				      autoShow:true,//自动显示等待框，默认为true
				      title:'正在加载...',//等待对话框上显示的提示内容
				      options:{
				        
				      }
				    }
				})
			}
		},
		toDis: function(index){
			var self = this;
			openPage('dis_order.html',{type: 4,orderid:self.list[index].uoid});
			window.addEventListener('refresh',function(e){
				refresh();
			});
		},
		order_edit:function(index){
			var self = this;
			var order_id = self.list[index].id;
			mui.openWindow({
				url:'form.html',
				id:'driver/inner/form.html',
				createNew:true,
				extras:{
					order_id: order_id,
				}
			});
		}
	},
	filters:{
	order_weight:function(value,order_type){
		var self = this;
	         if (order_type == 'vehicle') {
				 var self = this;
	             return value/1000 + ' 吨  '
	         } else {
	             return value + ' kg  '
	         }
	     },
	},	
	
});

$(document).on('click','.create_order',function(){
	mui.openWindow({
		url:'form.html',
		id:'driver/inner/form.html',
		createNew:true,
		extras:{
			order_id: '',
		}
	});
});
//监听专车取消订单传过来的refres
window.addEventListener('cancel', function(event) {
	refresh();
});