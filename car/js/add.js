// 接口：个人中心-车辆添加
var carAddURl = request.ServerUrl+request.carAddURl;
// 接口：个人中心-车型列表
var carModelURl = request.ServerUrl+request.carModelURl;



// 用户令牌
var token = null;
// 车型数据
var carModeData = carType;
var set_type_arr = ['不限','4.2米冷藏车','5.2米冷藏车','6.8米冷藏车','7.6米冷藏车','9.6米冷藏车','12.5米冷藏车','15米冷藏车'];
var cid = '';
var cartype = 2;
var from = '';
mui.plusReady(function() {
    var selfPage = plus.webview.currentWebview();
    cid = selfPage.cid;
    from = selfPage.from;
    if (cid) {
        $('.mui-title').html('编辑车辆');

        request.PostInfo(request.car_view,{id:cid,token:user.getState('token')},function(res){
            console.log('res:'+JSON.stringify(res));
            var data = res.data;
            var cartype = data.cartype;
            var line_state = data.line_state;
            var low_temperture = data.low_temperture;
            if (line_state == 2) {
                $('#line_state').addClass('mui-active');
            }
            $('#caridVal').html(set_type_arr[data.cartype-1]).attr('data-value',data.cartype);
            $('#control').html(data.control);
            $('#carNum').html(data.carnumber);
            $('#start_city_val').html(data.startcity);
            $('#end_city_val').html(data.endcity);
            $('#carageVal_start').html(data.starttime);
            $('#carageVal_end').html(data.endtime);
            $('.kilo_price').html(data.kilo_price ? data.kilo_price :'1');
            $('#block-range').val(data.kilo_price ? data.kilo_price :'1');            

            $('.low_temperture').html(low_temperture ? low_temperture :'0');
            $('#low_temperture-range').val(low_temperture ? low_temperture :'0');
            $('#area_val').val(data.area);
            $('#weight').val(data.weight ? data.weight/1000 : '');
            $('#remark').val(data.remark);
            $('#start_price').val(data.start_price);
            if (data.board_time) {
                $('#carageVal').html(data.board_time);
            }
            $('.driver_name').val(data.driver_name);
            $('.mobile').val(data.mobile);
        },function(res){});
    } else {
       $('.mui-title').html('添加车辆'); 
    }
    console.log('cid:'+cid);
});

// 物品温度范围数组
// var temperatureData = new Array();
// for(var i = 25; i > -26; i-- ){
// 	var Text = i+'℃';
// 	var Value = i;
// 	temperatureData.push({text:Text,value:Value});
// }
// 物品数据  正负号
// var character = [{text:"~",value:0}];
// 物品温度区间数据
// var temperatureSectionData = temperatureData;
//	 选择器初始化 
var picker1 = new Picker({
  	title: '温控',
  	selectedIndex: [25,0,1],  //四列列数据各自选中的下标
  	data: [temperatureData,character,temperatureSectionData],
});
// 温控选择器改变的事件
picker1.on('picker.valuechange', function (selectedVal, selectedIndex) {
	// 温度区间
	var a = selectedIndex[0];
	// 正负号
	var b = selectedIndex[1];
	// 递增区间
	var c = selectedIndex[2];
  	// 温度区间
  	document.getElementById("tempertureVal").innerText = temperatureData[a].text+' '+character[b].text+' '+temperatureSectionData[c].text;
});


// 初始化车辆注册日期选择器
var dtpicker = new mui.DtPicker({
    type: "date",//设置日历初始视图模式 
    beginDate: new Date('2000-01-01'),//设置开始日期 
    endDate:new Date(),//设置结束日期 
    labels: ['年', '月', '日'],//设置默认标签区域提示语 
}); 

var dtpicker_date = new mui.DtPicker({
    type: "date",//设置日历初始视图模式 
    beginDate: new Date(),//设置开始日期 
    endDate:'',//设置结束日期 
    labels: ['年', '月', '日'],//设置默认标签区域提示语 
}); 

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
function uploadImg(){
	// 等待中
	// 接口令牌
	// 车型ID
	var carid = document.getElementById('caridVal').getAttribute('data-value');
    if (cid) {
        if (!carid) {
           carid = cartype; 
        }
    } else {
        if (!carid) {
            mui.toast('请选择车型');
            return false;
        } 
    }
	// 温控 
	var temperature = document.getElementById('control').innerText;
    if (temperature == '请选择温控类型') {
        mui.toast('请选择温控类型');
        return false;
    }
    var carageVal = document.getElementById('carageVal').innerText;
	//车龄
	// var driver_time = document.getElementById('carageVal').getAttribute('data-value');
	// 车牌号
	var carnumber = document.getElementById('carNum').innerText;
    if (carnumber == '请输入车牌号') {
        mui.toast('请输入车牌号');
        return false;
    }
    var c_carnumber = request.checkCarNumber(carnumber);
    if (c_carnumber) {
        mui.toast(c_carnumber);
        return false;
    }

    var driver_name = $('.driver_name').val();
    if (!driver_name) {
        mui.toast('请输入车辆联系人');
        return false;
    }    
    var mobile = $('.mobile').val();
    if (!mobile) {
        mui.toast('请输入车辆联系人电话');
        return false;
    }
    mobile = request.clear_str_null(mobile);
    var c_mobile = request.checkMobile(mobile);
    if (c_mobile) {
        mui.toast('联系电话请输入手机号！');
        return false;
    }
    if (carageVal == '请选择') {
        carageVal = '';
    }
    var start_city_val = $('#start_city_val').text() == '请选择' ? '' : $('#start_city_val').text();
    var end_city_val = $('#end_city_val').text() == '请选择' ? '' : $('#end_city_val').text();
    var carageVal_start = $('#carageVal_start').text() == '请选择' ? '' : $('#carageVal_start').text();
    var carageVal_end = $('#carageVal_end').text() == '请选择' ? '' : $('#carageVal_end').text();
    var kilo_price = $('.kilo_price').text();
    var low_temperture = $('.low_temperture').text();
    var weight = request.clear_str_null($('#weight').val());
    var start_price = request.clear_str_null($('#start_price').val());
    var remark = $('#remark').val();
    var area_val = request.clear_str_null($('#area_val').val());
    var line_state = $('#line_state').hasClass('mui-active');
    // if (line_state) {
    //     if (!start_city_val || start_city_val == '请选择') {
    //         mui.toast('接单城市不能为空');
    //         return false;
    //     }        

    //     if (!end_city_val || end_city_val == '请选择') {
    //         mui.toast('目的城市不能为空');
    //         return false;
    //     }           

    //     if (!carageVal_start || carageVal_start == '请选择') {
    //         mui.toast('接单时间不能为空');
    //         return false;
    //     }          
     
    // }


    var data = {
        id:cid,
        token : token,
        weight : weight ? weight*1000 : '',
        remark : remark,
        line_state:line_state ? 2 : 1,
        carnumber : carnumber,
        cartype : carid,
        control : temperature,
        board_time : carageVal,
        driver_name : driver_name,
        mobile : mobile,
        start_price : start_price,
        startcity : start_city_val,
        endcity : end_city_val,
        starttime : carageVal_start,
        endtime : carageVal_end,
        kilo_price : kilo_price,
        low_temperture : low_temperture,
        area : area_val,
    };
    if (cid) {
        var url = request.car_edit;
    } else {
        var url = request.car_add;

    }
	var wt = plus.nativeUI.showWaiting();
    request.PostInfo(url,data,function(res){
        mui.toast(res.msg);
        if (from) {
            plus.webview.getWebviewById(from).reload();
        } else {
            plus.webview.getWebviewById('../driver/car/car_list.html').reload();
        }
        wt.close();
        mui.back();
    },function(res){
        wt.close();
    });
 
};

/**
 * @description: 选择车型
 * */
mui('body').on('tap','#carid',function(){
  	
  	var caridVal = document.getElementById('caridVal');
  	
  	picker(carModeData,1,caridVal);
}); 
var control_data = [
    {
        value: '冷冻',
        text: '冷冻'
    },    {
        value: '冷藏',
        text: '冷藏'
    },    {
        value: '常温',
        text: '常温'
    },    {
        value: '恒温',
        text: '恒温'
    },    {
        value: '冷冻/冷藏',
        text: '冷冻/冷藏'
    }
   
];
function close_cartype(){
    layer.close(window.cartype);
}
/**
 * @description: 选择温控
 * */
mui('body').on('tap','#control_id',function(){
    close_cartype()
    var control = document.getElementById('control');
    
    picker(control_data,1,control);
}); 

/*
 * @description: 温控区间
 * */
mui('body').on('tap','#temperture',function(){

  	picker1.show();
});

 
/**
 * @description: 选择车辆注册日期
 * @parms 
 * */
mui('body').on('tap','#carage',function(){
    close_cartype()
  	// 显示注册日期dom
  	var carageVal = document.getElementById('carageVal');
  	// 选择器
  	dtpicker.show(function(e) { 
		carageVal.innerText = e.text;
		carageVal.setAttribute('data-value',e.text);
	})
}); 

// 接单开始时间
mui('body').on('tap','#carage_start',function(){
    close_cartype()
    // 显示注册日期dom
    var carageVal = document.getElementById('carageVal_start');
    // 选择器
    dtpicker_date.show(function(e) { 
        carageVal.innerText = e.text;
        carageVal.setAttribute('data-value',e.text);
    })
}); 
// 接单截止时间
mui('body').on('tap','#carage_end',function(){
    close_cartype()
    // 显示注册日期dom
    var carageVal = document.getElementById('carageVal_end');
    // 选择器
    dtpicker_date.show(function(e) { 
        carageVal.innerText = e.text;
        carageVal.setAttribute('data-value',e.text);
    })
}); 

var set_type = 'start_city_val';

function preloadStart(){
    orderDetail = mui.preload({
        url: "car_address.html",
        id: "car_address.html", //默认使用当前页面的url作为id
        styles: {}, //窗口参数
        extras: {
            
        } //自定义扩展参数
    });
}

mui.plusReady(function(){
    setTimeout(function(){
        preloadStart();
    },500)
    
});



//点击选择城市
mui('body').on('tap', '#start_city', function() {
    // set_type = 'start_city_val';
    // var page = plus.webview.getWebviewById('car_address.html');
    // mui.fire(page, 'send', {
    //     type:set_type
    // });
    // page.show('slide-in-right', 300);
    mui.openWindow({
        url: "car_address.html",
        id: "driver/car/car_address.html",
        extras: {
            type: 'start_city_val'
        },
        waiting: {
            autoShow: true, 
            title: '正在加载...',
            options: {}
        }
    })
})
//点击选择城市
mui('body').on('tap', '#end_city', function() {
    // set_type = 'end_city_val';
    // var page = plus.webview.getWebviewById('car_address.html');
    // mui.fire(page, 'send', {
    //     type:set_type
    // });
    // page.show('slide-in-right', 300);
    mui.openWindow({
        url: "car_address.html",
        id: "driver/car/car_address.html",
        extras: {
            type: 'end_city_val'
        },
        waiting: {
            autoShow: true,
            title: '正在加载...',
            options: {}
        }
    })
})

$('body').on('click','#carid',function(){
    close_cartype()
}); 

$('body').on('click','#driver_name',function(){
    $(this).find('input').focus();
    layer.close(window.cartype);
}); 

$('body').on('click','#mobile',function(){
    $(this).find('input').focus();
    layer.close(window.cartype);
});

$('body').on('click','#area',function(){
    console.log('area');
    $(this).find('input').focus();
    layer.close(window.cartype);
}); 

$('body').on('click','#weight_',function(){
    console.log('weight_');
    $(this).find('input').focus();
    layer.close(window.cartype);
}); 

$('body').on('click','#start_price_',function(){
    $(this).find('input').focus();
    layer.close(window.cartype);
}); 

$('body').on('click','#remark_',function(){
    $(this).find('input').focus();
    layer.close(window.cartype);
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
	
	// if(!carid || carid == '' || carnumber == ''){
	// 	mui.toast('资料未填完');
	// 	return false;
	// }
	// 上传
	return uploadImg();
}); 
