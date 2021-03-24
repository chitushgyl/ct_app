// 接口：个人中心-车辆添加
// var carAddURl = request.ServerUrl+request.carAddURl;
// 接口：个人中心-车型列表
// var carModelURl = request.ServerUrl+request.carModelURl;

// 用户令牌
var token = null;
// 车型数据
var vm = new Vue({
	el: '#template_car',
	data: {
		car_id: null,
		datePicker:null,
		carTypePicker: null,
		carPossessPicker:null,
		controlTypePicker:null,
		type : 1,
		car_number : null,
		car_possess: "",
		car_possess_show : null,
		car_type_name : null,
		parame_name:null,
		contacts : null,
		tms_control_type_show : null,
		control : "",
		tel : null,
		board_time : null,
		car_brand : null,
		license : [],
		medallion : [],
		volam : null,
		weight : null,
		car_type_id:null,
		tms_car_type:[],
		carCreList:[],
		tms_control_type:[],
		tms_car_possess_type:[],
		
	},
	mounted:function(){
		var self = this;
		mui.init();
		var btn = document.querySelector('#carage');
		// var result = document.querySelector('#result');
		var dtPicker = new mui.DtPicker({ type: 'date' });
		
		var self=this;
		btn.addEventListener('tap', function() {
						dtPicker.show(function (selectItems) { 
							var y = selectItems.y.text;  //获取选择的年
							var m = selectItems.m.text;  //获取选择的月
							var d = selectItems.d.text;  //获取选择的日
							var date = y + "-" + m + "-" + d ; 
							$("#result").val(date);
							self.board_time=date;
							// result.innerHTML=selectItems.value;
						})
					}, false);
		mui.plusReady(function() {
		    var ws = plus.webview.currentWebview();
			console.log(JSON.stringify(ws));
			self.car_id = ws.self_id;
			console.log(self.car_id)
		    // self.type = selfPage.type ? selfPage.type : 1;
			console.log(self.type)
			// var data = {
			// 	self_id : self_id,
			// }
			// var self = this;
			var data = {
					self_id:self.car_id,
				}
				// if (pageNum == 1) {
				// 	self.carList = [];
				// }
			request.PostInfo_new(request.api_car_creatCar,data,function(res){
				console.log(JSON.stringify(res));
				// self.showlist = res.data.info;
				var data = res.data.info;
				self.carCreList = data;
				// console.log(JSON.stringify(self.carCreList));
					if (self.car_id) {
					        $('.mui-title').html('编辑车辆');
							self.car_number = self.carCreList.car_number,
							self.car_possess_show = self.carCreList.car_possess_show;
							self.car_possess=self.carCreList.car_possess;
							self.car_type_name = self.carCreList.car_type_name;
							self.car_type_name = self.carCreList.car_type_name;
							self.car_type_id = self.carCreList.car_type_id;
							console.log(self.car_number);
							self.contacts = self.carCreList.contacts;
							self.tel = self.carCreList.tel;
							self.tms_control_type_show = self.carCreList.tms_control_type_show;
							self.control = self.carCreList.control;
							self.board_time = self.carCreList.board_time;
							self.car_brand = self.carCreList.car_brand;
							self.license = self.carCreList.license;
							self.medallion = self.carCreList.medallion;
							self.volam = self.carCreList.volam;
							self.weight = self.carCreList.weight;	
					    } 
						else {
					       $('.mui-title').html('添加车辆'); 
					    }
			},function(res){});
		    
		});
	},
//车型列表
	methods:{
		selectCarType: function(){ // 筛选结算方式
		var self = this;
		    var data = {
		    	token:user.getState('token'),
		    	// self_id:self.car_id
		    };
		    request.PostInfo_new(request.api_car_getType,data,function(res){
		    		console.log(JSON.stringify(res))
		    		self.tms_car_type = res.data.info;
		    		var carTypeData = [];
		    		var index = i;
		    		for(var i=0;i< self.tms_car_type.length;i++){
		    			carTypeData.push({
		    				 value: self.tms_car_type[i].self_id,
		    				 text:  self.tms_car_type[i].parame_name, 
		    			})
		    		}
		    		self.carTypePicker = new mui.PopPicker();
		    		self.carTypePicker.setData(carTypeData);
		    		  self.carTypePicker.show(function(items){
		    			  console.log(JSON.stringify(items))
		    			  self.car_type_name=(items[0] || {}).text;
		    			  self.car_type_id=(items[0] || {}).value;
		    		  })
		    		});
		},
		//温控
		selectControlType: function(){ // 筛选结算方式
		    // alert('选择地址')
			var self = this;
			// self.visibilityPicker();
			var data = {
				token:user.getState('token'),
				self_id:self.car_id
			};
			request.PostInfo_new(request.api_car_creatCar,data,function(res){
					console.log(JSON.stringify(res.data))
					// self.info = res.data;
					// self.paystate = res.data.paystate;
					self.tms_control_type = res.data.tms_control_type;
					console.log(JSON.stringify(self.list))
					var controlData = [];
					var index = i;
					for(var i=0;i< self.tms_control_type.length;i++){
						controlData.push({
							 value: self.tms_control_type[i].key,
							 text:  self.tms_control_type[i].name, 
						})
					}
					self.controlTypePicker = new mui.PopPicker();
					self.controlTypePicker.setData(controlData);
					  self.controlTypePicker.show(function(items){
						  console.log(JSON.stringify(items))
						  self.tms_control_type_show=(items[0] || {}).text;
						  self.control=(items[0] || {}).value;
						  console.log(self.control)
					  })
					
				});
			// } else {
			// }
			// 页面input失去焦点
			// document.getElementById("name").blur();
			// document.getElementById("phone").blur();
			// document.getElementById("address").blur();
			
			// self.costTypePicker.show(function(items) {
			// 	self.cost_type_show = (items[0] || {}).text;
			// });
		},
		//车辆属性
		select_carPossessType: function(){ // 筛选结算方式
		    // alert('选择地址')
			var self = this;
			// self.visibilityPicker();
			var data = {
				token:user.getState('token'),
				self_id:self.car_id
			};
			request.PostInfo_new(request.api_car_creatCar,data,function(res){
					console.log(JSON.stringify(res.data.tms_car_possess_type))
					// self.info = res.data;
					// self.paystate = res.data.paystate;
					self.tms_car_possess_type = res.data.tms_car_possess_type;
					// console.log(JSON.stringify(self.list))
					var carPossessData = [];
					var index = i;
					for(var i=0;i< self.tms_car_possess_type.length;i++){
						carPossessData.push({
							 value: self.tms_car_possess_type[i].key,
							 text:  self.tms_car_possess_type[i].name, 
						})
					}
					self.carPossessPicker = new mui.PopPicker();
					self.carPossessPicker.setData(carPossessData);
					  self.carPossessPicker.show(function(items){
						  console.log(JSON.stringify(items))
						  self.car_possess_show=(items[0] || {}).text;
						  self.car_possess=(items[0] || {}).value;
						})
					});
				},
				submitFun: function(){
					var self = this;
					var type = self.type;
					if(type == 1){ // 执行添加动作
						var submitData = {
							token : user.getState('token'),
							self_id : self.car_id,
							control : self.control,
							board_time : self.board_time,
							car_number : self.car_number,
							car_possess : self.car_possess,
							car_type_id : self.car_type_id,
							contacts : self.contacts,
							tel : self.tel,
							license: self.license,
							medallion: self.medallion,
						};
						if(self.car_id){
						request.PostInfo_new(request.api_car_addCar,submitData,function(res){
							plus.webview.currentWebview().opener().evalJS("refreshData()");
							mui.back();
						},function(res){
						
						});
						}
						else{
							request.PostInfo_new(request.api_car_addCar,submitData,function(res){
								plus.webview.currentWebview().opener().evalJS("refreshData()");
								mui.back();
							},function(res){
							});
						}
					}
				}
			},
		})
/*
 * @description: 选择器
 * @param: data 选择器的数据
 * @param: col 选择器的列
 * @param: ele 选择器数据输出的位置
 * */
function picker(data,col,ele){
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
		ele.innerText = selectItems[0].text;
		console.log(ele.innerText);
		// 设置选中的value 
		ele.setAttribute("data-value",selectItems[0].value);
		// 销毁选择器
		picker.dispose();
	});	
}

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
			console.log(JSON.stringify(e))
        	console.log("压缩成功" + e.target);
        	// 显示图片
        	self.setAttribute('src',e.target);
        }, function(err) {  
            console.error("压缩失败：" + err.message);  
        });  
    }, function(err) {});  
};
    
 /*
 * @description: 上传图片
 * @parms token 接口令牌
 * @parms carid 车型ID
 * @parms carnumber 车牌号
 * @parms carnumber 车龄
 * @parms travelimg 行驶证图片
 * @parms operateimg 运营证图片
 * @parms carimage 车辆照片：右前方45°侧面照
 * */
// function uploadImg(){
// 	// 等待中
// 	// 接口令牌
// 	var token = user.getState('token');

	// 车型ID
	// var carid = document.getElementById('caridVal').getAttribute('data-value');
 //    if (cid) {
 //        if (!carid) {
 //           carid = cartype; 
 //        }
 //    } else {
 //        if (!carid) {
 //            mui.toast('请选择车型');
 //            return false;
 //        } 
 //    }
	// 温控 
	// var temperature = document.getElementById('control').innerText;
 //    if (temperature == '请选择温控类型') {
 //        mui.toast('请选择温控类型');
 //        return false;
 //    }
    // var carageVal = document.getElementById('carageVal').innerText;
	//车龄
	// var driver_time = document.getElementById('carageVal').getAttribute('data-value');
	// 车牌号
	// var car_number = document.getElementById('carNum').innerText;
 //    if (car_number == '请输入') {
 //        mui.toast('请输入车牌号');
 //        return false;
 //    }

    // var c_carnumber = request.checkCarNumber(carnumber);
    // if (c_carnumber) {
    //     mui.toast(c_carnumber);
    //     return false;
    // }
    // var driver_name = $('.driver_name').val();
    // if (!contacts) {
    //     mui.toast('请输入车辆联系人');
    //     return false;
    // }    
    // var mobile = $('.mobile').val();
    // if (!tel) {
    //     mui.toast('请输入车辆联系人电话');
    //     return false;
    // }
    // mobile = request.clear_str_null(mobile);

    // var c_mobile = request.checkMobile(mobile);
    // if (c_mobile) {
    //     mui.toast('联系电话请输入手机号！');
    //     return false;
    // }
    // if (carageVal == '请选择') {
    //     carageVal = '';
    // }
    // var start_city_val = $('#start_city_val').text() == '请选择' ? '' : $('#start_city_val').text();
    // var end_city_val = $('#end_city_val').text() == '请选择' ? '' : $('#end_city_val').text();
    // var carageVal_start = $('#carageVal_start').text() == '请选择' ? '' : $('#carageVal_start').text();
    // var carageVal_end = $('#carageVal_end').text() == '请选择' ? '' : $('#carageVal_end').text();  
    // var kilo_price = $('.kilo_price').text();
    // var low_temperture = $('.low_temperture').text();
    // var weight = request.clear_str_null($('#weight').val());
    // var start_price = request.clear_str_null($('#start_price').val());
    // var remark = $('#remark').val();
    // var area_val = request.clear_str_null($('#area_val').val());
    // var line_state = $('#line_state').hasClass('mui-active');
    // if (line_state == 2) {
    //     if (!start_city_val) {
    //         mui.toast('接单城市不能为空');
    //         return false;
    //     }        

    //     if (!end_city_val) {
    //         mui.toast('目的城市不能为空');
    //         return false;
    //     }        
    // }

 //    var data = {
 //        car_type_id:car_type_id,
 //        token : token,
 //        weight : weight ? weight*1000 : '',
 //        volam : volam,
 //        car_number : car_number,
 //        control : temperature,
 //        board_time : board_time,
 //        contacts : contacts,
 //        tel : tel,
	// 	car_brand : car_brand,
	// 	license : license,
	// 	medallion : medallion,
	// 	car_possess : car_possess
 //    };
 //    if (cid) {
 //        var url = request.car_edit;
 //    } else {
 //        var url = request.car_add;

 //    }
	// var wt = plus.nativeUI.showWaiting();
 //    request.PostInfo_new(url,data,function(res){
 //        mui.toast(res.msg);
 //        // plus.webview.getWebviewById('driver/car/car_list_index.html').reload();
 //        plus.webview.currentWebview().opener().evalJS('listenBack001()');
 //        mui.back();
 //        wt.close();
 //    },function(res){
 //        wt.close();
 //    });

// };
 


mui('body').on('tap','#carid',function(){
    close_cartype()
    var flag = request.to_login();
    if (!flag) {
        return false;
    }
}); 

$('body').on('click','#driver_name',function(){
    $(this).find('input').focus();
    layer.close(window.cartype);
    var flag = request.to_login();
    if (!flag) {
        return false;
    }
}); 

$('body').on('click','#mobile',function(){
    $(this).find('input').focus();
    layer.close(window.cartype);
    var flag = request.to_login();
    if (!flag) {
        return false;
    }
});

$('body').on('click','#area',function(){
    $(this).find('input').focus();
    layer.close(window.cartype);
    var flag = request.to_login();
    if (!flag) {
        return false;
    }
}); 

$('body').on('click','#weight_',function(){
    $(this).find('input').focus();
    layer.close(window.cartype);
    var flag = request.to_login();
    if (!flag) {
        return false;
    }
}); 

$('body').on('click','#start_price_',function(){
    $(this).find('input').focus();
    layer.close(window.cartype);
    var flag = request.to_login();
    if (!flag) {
        return false;
    }
}); 

$('body').on('click','#remark_',function(){

    $(this).find('input').focus();
    layer.close(window.cartype);
    var flag = request.to_login();
    if (!flag) {
        return false;
    }
}); 
/*
 * @description: 点击图片选择选择图片的方式
 * @parms 
 * */
mui('body').on('tap','.uploadImg',function(){
	var self = this;
	if(window.plus){
		actionSheet(self);
	}else{
		document.addEventListener("plusready",function(){
			actionSheet(self);
		},false);
	}
}); 

function getSelectedCity(data){
    var info = JSON.parse(data);
    var city = info.city;
    var type = info.type;
    $('#'+type).text(city);
}   

 /*
 * @description: 上传图片
 * @parms 
 * */
mui('body').on('tap','#submit',function(){
	var c_out = click_one();
    if (!c_out) {
        console.log('time_in');
        return false;
    }
	var carid = document.getElementById('caridVal').getAttribute('data-value');
	var carnumber = document.getElementById('carNum').innerText;
    var flag = request.to_login();
    if (!flag) {
        return false;
    };
	// 上传
	return uploadImg();
}); 