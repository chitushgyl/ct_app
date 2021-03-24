// 接口：个人中心-车辆添加
// var carAddURl = request.ServerUrl+request.carAddURl;
// 接口：个人中心-车型列表
// var carModelURl = request.ServerUrl+request.carModelURl;

function pub() {
        lis = document.getElementById('father').getElementsByTagName('li').length;
        var final = document.getElementById("final");
        if (lis == 4) {
            final.style.display = "none";
        } else {
            final.style.display = "inline"
        }
    }
// 用户令牌
var token = null;
// 车型数据
var vm = new Vue({
	el: '#template_img',
	data: {
		car_id:null,
		receipt:[],
		license:[],
		medallion:[],
	},
	mounted:function(){
		var self = this;
		mui.init();
		mui.plusReady(function() {
		    var ws = plus.webview.currentWebview();
			console.log(JSON.stringify(ws));
			self.car_id = ws.data.self_id;
			// console.log(self.car_id)
			});
	},
//车型列表
	methods:{
				submitFun: function(){
					var self = this;
					var type = self.type;
					console.log(self.car_id)
						var submitData = {
							order_id : self.car_id,
							// receipt: self.license,
							receipt: self.medallion,
						};
						request.PostInfo_new(request.api_take_upload,submitData,function(res){
							plus.webview.currentWebview().opener().evalJS("refreshData()");
							mui.back();
						},function(res){
						
						});
				
			},
			//删除上传的图片
					deleteImg(type){
						let self=this;
						self.license=[];
						self.$refs.upImg.setAttribute('src','../images/photo.png');
					},
		},
})
/*
 * @description: 选择
 * @parms self 点击的图片
 * */
function actionSheet(self,up_type){
	plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
        {title:"拍照"},  
        {title:"从相册中选择"}  
    ]}, function(e){//1 是拍照  2 从相册中选择  
        switch(e.index){  
            case 1:getImage(self);break;  
            case 2:getGalleryImage(self,up_type);break;  
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
				set_del(self);
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
 //单张上传
function getGalleryImage(self,up_type) { 
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
			set_del(self);
			toOss(e.target,up_type);
        }, function(err) {  
            console.error("压缩失败：" + err.message);  
        });  
    }, function(err) {});  
};


 
//上传图片到oss服务器
function toOss(src,up_type){
	
	var o_url = request.ServerUrl_new+request.upload_img;
	/**
	 * 这里不懂的可以去hbuild官网查看
	 */
	var task = plus.uploader.createUpload(o_url, {  
	method: 'post',   
	blocksize:204800,  
	timeout: 10  
	},function(data, status){
		if(status == 200){
			var temp_urlInfo=JSON.parse(data.responseText);
			console.log(temp_urlInfo);
			console.log(JSON.stringify(temp_urlInfo.data));
			if(temp_urlInfo.code == 200){
				// mui.toast('图片上传成功！');
				if(up_type == 'car'){
					vm.license=[];
					vm.license.push(temp_urlInfo.data);
				}else{
					vm.medallion=[];
					vm.medallion.push(temp_urlInfo.data);
				}
			}

			
		}else{
			mui.toast('图片上传失败！');
		}
	});
	task.addFile(src, {key: 'inputfile'}); 
	task.addData('type', 'uploadImg'); 
	task.start();
	
	
	
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

	//车型ID
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
	};
/*
 * @description: 点击图片选择选择图片的方式
 * @parms 
 * */
mui('body').on('tap','.uploadImg',function(){
	var self = this;
	var leng = $('.uploadImg').length;
	var up_type=self.getAttribute("data-type");
	if (leng >8) {
		alert('照片不能超过8张！');
		return false;
	}
	if(window.plus){
		actionSheet(self,up_type);
	}else{
		document.addEventListener("plusready",function(){
			actionSheet(self,up_type);
		},false);
	}
}); 
	// 删除图片之后
			function delete_after() {
				var len = $('.uploadImg').length;
				if ($('.uploadImg').eq(len-1).attr('src') != '../images/photo.png') {
					var node = '';
					node += '	<img id="travelimg" class="uploadImg" src="../images/photo.png" style="width: 110px; height: 80px;"/>'
					$('.set_images').append(node);
				}
			}
// 删除图片
			function del_img(that) {
				var src = $(that).parent().find('.uploadImg').attr('src');
				// var img_src = $(that).parent().find('.uploadImg').attr('data_src');
				// if (img_src) {
					$(that).parent().remove();
					delete_after();
				// }	
			}
			$(document).on('click','.upload_del',function(){
				del_img($(this));
			});
		
// 上传图片后
			function set_del(self) {
				var data = $(self).attr('data');
				$(self).parent().find('.upload_del').remove();
				var node_del = '<img src="../images/driver/out.png" style="position:absolute;top:-2px;left:23%;background-color:#fff;width:13px;border-radius:15px;" class="upload_del">';
				$(self).parent().append(node_del);
				if (data == 1) {

				} else {
					// 第一次添加
					$(self).attr('data',1);
					if ($('.uploadImg').length < 8) {
						var node = '';
						node += '	<img id="travelimg" class="uploadImg" src="../images/photo.png" style="width: 110px; height: 80px;"/>'
						$('.set_images').append(node);
					} 
				}
				// alert(data);
			}
			
// //服务端接口路径
//             var server = request.api_take_upload;
//             //获取图片元素
//             var files = document.getElementById('headimg');
//  function upload(){
//                 var wt=plus.nativeUI.showWaiting();
//                 var task=plus.uploader.createUpload(server,
//                     {method:"POST"},
//                     function(t,status){ //上传完成
//                         if(status==200){
//                             alert("上传成功："+t.responseText);
//                             wt.close(); //关闭等待提示按钮
//                         }else{
//                             alert("上传失败："+status);
//                             wt.close();//关闭等待提示按钮
//                         }
//                     }
//                 );
// 				 //添加其他参数
// 				task.addData("name","test");
// 				task.addFile(files.src,{key:"dddd"});
// 				task.start();
// 				}
 /*
 * @description: 上传图片
 * @parms 
 * */
// mui('body').on('tap','#submit',function(){
// 	// console.log(file)
// 	var c_out = click_one();
//     if (!c_out) {
//         console.log('time_in');
//         return false;
//     }
// 	var carid = document.getElementById('travelimg').getAttribute('data-value');
// 	// var carnumber = document.getElementById('carNum').innerText;
//     var flag = request.to_login();
//     if (!flag) {
//         return false;
//     };
// 	// 上传
// 	return uploadImg();
// }); 