// 接口：个人中心-车型列表
var carModelURl = request.ServerUrl+request.carListURL;
// 接口：返程车主：-单个车辆
var carmesURl = request.ServerUrl+request.carmesURl;
// 修改车辆
var editeURl = request.ServerUrl+request.careditorURl;
// 用户令牌
var token = null;
// 车辆id
var ccid = null;
// 车型数据
// var carModeData = new Array();//carType
var carModeData = carType;

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
  	title: '物品',
  	selectedIndex: [25,0,1],  //四列列数据各自选中的下标
  	data: [temperatureData,character,temperatureSectionData],
});
// 选择器改变的事件
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
// 监听plus加载
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}

function plusReady(){
	token = user.getState('token');
	// 获取窗口对象
	main = plus.webview.currentWebview();
	// postCarMode(token);
}

/*
 * @description: 接口：单个车辆详情
 * @parms url 接口地址
 * @parms token 接口令牌
 * @parms ccid 车辆ID
 * 
 * */
function postCarmes(url,data){
	console.log("send传参,导致的函数开始执行");
	
	
	
	mui.post(url,data,function(response){
			// code
			var code = parseInt(response.code);
			// message
			var message = response.message;
			// data
			var data = response.data;
			console.log(JSON.stringify(response));
			switch (code){
				case 1000:
					mui.toast('参数错误');
					break;
				case 1002:
					mui.toast('暂无数据');
					break;
				case 1001:
					// 输出车辆详情数据
					outCarDetail(data);
					ccid = data.id;
					break;
				case 1007:
					mui.toast('非法请求');
					break;
				case 1008:
					mui.toast('token已过期，请重新登录');
					break;
				default:
					break;
			}
			
		},'json'
	);
}

/*
 * @description: 输出车辆详情
 * @parms data 数据
 * 
 * */
function outCarDetail(data){
	// 车辆ID
	console.log(JSON.stringify(data));
	ccid = data.id;
	// 车牌号
	var carnumber = data.carnumber;
	// 车辆状态（1未审核 2审核通过 3审核失败）
	var status = parseInt(data.status);
	switch (status){
		case 1:
			status = '未审核';
			break;
		case 2:
			status = '审核通过';
			break;
		case 3:
			status = '审核失败';
			break;
		default:
			break;
	}
	// 行驶证
	var travelimg = data.license;
	// 运营证
	var operateimg = data.medallion;
	// 车辆照片：右前方45°侧面照*宽*高
	var carimage = data.carimage;
	// 温控
	var temperature = data.control;
	// 车型参数
	var carparame = data.carparame;
	// 车龄参数
	var car_age = data.board_time;
	// 车型id
	var car_id = data.cartype;
	//车辆id
	id = data.id;
	// 车型图片
	var avatar = data.avatar;
	// 承载重量
	var allweight = data.allweight;
	// 承载体积
	var allvolume = data.allvolume;
	// 车辆长宽高
	var dimensions = data.dimensions;
	// 输出车型
	document.getElementById('caridVal').innerText = carparame;
	
	document.getElementById('caridVal').setAttribute('data-value',car_id);
	// 输出车牌号
	document.getElementById("carNum").innerText = carnumber;
	// 输出车龄
	document.getElementById("carageVal").innerText = car_age;
	// 输出温控
	document.getElementById("tempertureVal").innerText = temperature;
	// 输出行驶证
	document.getElementById("travelimg").setAttribute('src',travelimg);
	// 输出运营证
	document.getElementById("operateimg").setAttribute('src',operateimg);
	// 输出车辆照片：右前方45°侧面照*宽*高
	document.getElementById("carimage").setAttribute('src',carimage);
}

/*
 * @description: 获取认证车辆
 * @parms token 接口令牌
 * */
function postCarMode(token){
	mui.post(carModelURl,{
			token: token
		},function(response){
			// code
			console.log("获取认证车辆信息");
			console.log(JSON.stringify(response));
			var code = parseInt(response.code);
			// message
			var message = response.message;
			// data
			var data = response.data;
			
			switch (code){
				case 1000:
					mui.toast('参数错误');
					break;
				case 1002:
					mui.toast('暂无数据');
					break;
				case 1001:
					console.log("已请求成功");
					outCarDetail(data[0]);
					// for (var i = 0; i<data.length; i++) {
					// 	// 车型ID
					// 	var car_id = data[i].car_id;
					// 	// 车型参数
					// 	var carparame = data[i].carparame;
						
					// 	carModeData.push({value:car_id,text:carparame});
					// }
					
					break;
				case 1007:
					openLogin();
					break;
				case 1008:
					openLogin();
					break;
				default:
					break;
			}

		},'json'
	);
}

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
 * @parms ccid 车辆id
 * @parms carid 车型ID
 * @parms carnumber 车牌号
 * @parms travelimg 行驶证图片
 * @parms operateimg 运营证图片
 * @parms carimage 车辆照片：右前方45°侧面照
 * */
function uploadImg(){
	// 等待中
	var wt = plus.nativeUI.showWaiting();
	// 接口令牌
	var token = user.getState('token');
	// 车型ID
	var carid = document.getElementById('caridVal').getAttribute('data-value');
	// 车牌号
	var carnumber = document.getElementById('carNum').innerText;
	//车龄
	var car_age = document.getElementById('carageVal').innerText;
	// 温控 
	var temperature = document.getElementById('tempertureVal').innerText;
	// 行驶证图片
	var license = document.getElementById('travelimg').getAttribute('src');
	// 运营证图片
	var medallion = document.getElementById('operateimg').getAttribute('src');
	// 车辆照片：右前方45°侧面照
	var carimage = document.getElementById('carimage').getAttribute('src');
	var data = {
		token: token,
		id: String(id),
		carid: carid,
		carnumber: carnumber, 
		driver_time:car_age, 
		temperature: temperature, 
		license: license, 
		medallion: medallion, 
		carimage: carimage 
	}
	console.log(JSON.stringify(data));
	// 创建上传列表
	var task = plus.uploader.createUpload(editeURl, {  
    	method: "post"  
    }, function(t, status) {  
		console.log("========修改认证的返回值========="+status);
        if(status == 200) { 
           	console.log("上传成功："+JSON.stringify(task.UploadFileOptions));
			console.log( "Upload success: " + t.responseText );
			mui.toast("上传成功审核中,1个工作日内以短信形式通知您");
            wt.close(); //关闭等待提示按钮
			main = plus.webview.currentWebview().opener();
            main.reload();
            mui.back();
        }else{
        	console.log(JSON.stringify(t));
            mui.toast("上传失败："+t);
            wt.close();//关闭等待提示按钮
        }
    });  
	// 添加文件
	// 判断图片是不是新地址,如果是服务器存在的,传递一个空地址;
	// 如果是新上传图片,传递本地参数
	if(license.indexOf(request.ServerUrl)!=0){
		// 添加其他参数 
		task.addFile(license, {key:"license"});
	}else{
		// task.addFile(travelimg, {key:"travelimg"});
		task.addData("license",'');
	} 
	if(medallion.indexOf(request.ServerUrl)!=0){
		// 添加其他参数 
    	task.addFile(medallion, {key:"medallion"});
	}else{
		task.addData("medallion",'');
	} 
	if(carimage.indexOf(request.ServerUrl)!=0){
		// 添加其他参数 
    	task.addFile(carimage, {key:"carimage"});
	}else{
		task.addData("carimage",'');
	} 
    // 添加其他参数 接口令牌
    task.addData("token",data.token);
    // 添加其他参数 车辆ID
    task.addData("id",data.id);
    // 添加其他参数 车型ID
    task.addData("carid",data.carid);
    // 添加其他参数 车牌号
    task.addData("carnumber",data.carnumber);
    // 添加其他参数 车龄
    task.addData("driver_time",data.driver_time);
     // 添加其他参数 温控
    task.addData("temperature",data.temperature);
    task.addEventListener( "statechanged", function(upload,status){
    	if ( upload.state == 4 && status == 200 ) {
			// 上传完成
			console.log( "Upload success: " + upload.responseText );
		}
    } , false );
    // 开始上传 
    task.start();
 
};

/*
 * @description: 监听车辆列表发送过来的数据
 * 
 * */
window.addEventListener('send',function(event){

	// 车辆id
	token = user.getState('token');
	// 获取窗口对象
	postCarMode(token);
	
	// postCarmes(carmesURl,data);
	
	return false;
	
	// 20200328 下面什么鬼,不必执行,直接调用列表得到参数即可
	
	
	
	if(window.plus){
		var token = user.getState('token');
		var data = {
			token:token,
			ccid:ccid
		}
		
	}else{
		window.addEventListener('plusready',function(){
			var token = user.getState('token');
			var data = {
				token:token,
				ccid:ccid
			}
			postCarmes(carmesURl,data);
		});
	}
	
	
});

/*
 * @description: 温控区间
 * */
mui('body').on('tap','#temperture',function(){
  	picker1.show();
});

 /*
 * @description: 选择车型
 * */
mui('body').on('tap','#carid',function(){
  	
  	var caridVal = document.getElementById('caridVal');
  	
  	picker(carModeData,1,caridVal);
}); 
//选择车龄
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
	// 上传
	uploadImg();
}); 