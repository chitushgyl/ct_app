// 接口：个人中心-车辆添加
var carAddURl = request.ServerUrl+request.carAddURl;
// 接口：个人中心-车型列表
var carModelURl = request.ServerUrl+request.carModelURl;

// 用户令牌
var token = null;
// 车型数据
// var carModeData = carType;
var set_type = ['不限','4.2米冷藏车','5.2米冷藏车','6.8米冷藏车','7.6米冷藏车','9.6米冷藏车','12.5米冷藏车','15米冷藏车'];
var cid = '';
var cartype = 2;
var data_obj = {};
mui.plusReady(function() {
    var selfPage = plus.webview.currentWebview();
    data_obj = selfPage.data;
    console.log('data:'+JSON.stringify(data_obj));
});

// 物品温度范围数组
var temperatureData = new Array();
for(var i = 25; i > -26; i-- ){
	var Text = i+'℃';
	var Value = i;
	temperatureData.push({text:Text,value:Value});
}
// 物品数据  正负号
var character = [{text:"~",value:0}];
// 物品温度区间数据
var temperatureSectionData = temperatureData;
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
    beginDate: new Date(1993,1,1),//设置开始日期 
    endDate:new Date(),//设置结束日期 
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
                $(self).attr('src',e.target);
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
            $(self).attr('src',e.target);
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
	// 接口令牌
	var token = user.getState('token');
    var url = request.ServerUrl + request.driver_upload_bulk;

	var wt = plus.nativeUI.showWaiting();
	// 行驶证图片
	var travelimg = document.getElementById('travelimg').getAttribute('src');
	// 运营证图片
	// var operateimg = document.getElementById('operateimg').getAttribute('src');
	// 车辆照片：右前方45°侧面照
	// var carimage = document.getElementById('carimage').getAttribute('src');
	// 创建上传列表
	var task = plus.uploader.createUpload(url, {  
    	method: "post"  
   }, function(t, status) {  
	    console.log(JSON.stringify(t));
	    console.log(status);
        if(status == 200) { 
           	mui.toast("上传成功！");
            wt.close(); //关闭等待提示按钮
            // plus.webview.currentWebview().opener().evalJS('reload()');
            mui.back();
        }else{
            mui.toast("上传失败："+t);
            wt.close();//关闭等待提示按钮
        }
    });
	// 添加文件
    task.addFile(travelimg, {key:"file"});
    // 添加其他参数  接口令牌
    task.addData("token",token);
    // 添加其他参数 车型ID
    task.addData("id",data_obj.id);
    console.log('task:'+JSON.stringify(task));
	
	console.log("=========添加车辆信息=========="+JSON.stringify(task));
	
    task.addEventListener( "statechanged", function(upload,status){
    	if ( upload.state == 4 && status == 200 ) {
			// 上传完成
			console.log( "Upload success: " + upload.responseText );
		}
    } , false );
    // 开始上传 
    task.start();
 
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
/**
 * @description: 选择温控
 * */
mui('body').on('tap','#control_id',function(){
    
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
  	// 显示注册日期dom
  	var carageVal = document.getElementById('carageVal');
  	// 选择器
  	dtpicker.show(function(e) { 
		carageVal.innerText = e.text;
		carageVal.setAttribute('data-value',e.text);
	})
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

 /*
 * @description: 上传图片
 * @parms 
 * */
mui('body').on('tap','#submit',function(){
	uploadImg();
}); 
