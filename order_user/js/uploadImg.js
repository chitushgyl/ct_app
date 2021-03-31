// 接口：个人中心-车辆添加
// var carAddURl = request.ServerUrl+request.carAddURl;
// 接口：个人中心-车型列表
// var carModelURl = request.ServerUrl+request.carModelURl;

function refresh(){
	vm.$data.mescroll.resetUpScroll();
}
function refresh_show(){
	location.reload();
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
	methods:{
			submitFun: function(){
					var self = this;
					var type = self.type;
					if(self.medallion.length===0){
						mui.toast('图片不能为空！');
						return false;
					}
					console.log(self.car_id)
						var submitData = {
							order_id : self.car_id,
							receipt: self.medallion,
						};
						console.log(JSON.stringify(submitData));
						request.PostInfo_new(request.api_take_upload,submitData,function(res){
							mui.toast(res.msg);
							console.log(JSON.stringify(res))
							// plus.webview.getWebviewById('../car/list.html').reload();
							plus.webview.currentWebview().opener().evalJS("refresh_show()");
							// mui.back();
						},function(res){
							
						});
				
			},
			// deleteImg(){
			// 	var self=this;
			// 		self.medallion=[];
			// 		self.$refs.rep.setAttribute('src','../images/photo.png');
			// },

		},
})
var uuid=null;
/*
 * @description: 选择
 * @parms self 点击的图片
 * */
function actionSheet(self,up_type){
	plus.nativeUI.actionSheet({cancel:"取消",buttons:[  
        // {title:"拍照"},  
        {title:"从相册中选择"}  
    ]}, function(e){//1 是拍照  2 从相册中选择  
        switch(e.index){  
            // case 1:getImage(self);break;  
            case 1:getGalleryImage(self,up_type);break;  
        }  
    });  
}
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
			 setHtml(localUrl);
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
    },{  
        index: 1  
    });  
}

/*
 * @description: 从相册中选择文件
 * @parms self 点击的图片
 * */
function getGalleryImage(self,up_type) {
		// 从相册中选择图片 
		
		let fileSrc=[]; //定义一个空的图片地址数组
		let zipActions=[]; //定义一个空的方法数组
		plus.gallery.pick(function(e) {
			for (var i in e.files) {
				var fs=e.files[i];
				setHtml(fs);
				var zipAction=()=>{ //将每一次循环方法定义成一个方法变量
					return new Promise(resolve=>{
						//每一个方法返回一个 promise对象，第一个参数是resolve方法
						((index)=>{
							plus.zip.compressImage({
							    src: e.files[index],  
							    dst: "_doc/chat/gallery/" + e.files[index],  
							    quality: 20,  
							    overwrite: true  ,
							}, function(e) {  
								console.log(JSON.stringify(e))
								console.log("压缩成功" + e.target);
								// fileSrc.push(e.target);
								fileSrc.push(e.target);
								resolve();
								// 显示图片
								// self.setAttribute('src',e.target);
							}, function(err) {  
							    console.error("压缩失败：" + err.message);  
							}); 
							 
						})(i)
					})
				}
				zipActions.push(zipAction());//将每次循环调用的方法添加到方法数组中去
			}	
			Promise.all(zipActions).then((e)=>{
				//调用Promise.all方法，传入方法数组,异步的图片压缩全部成功执行后，开始图片上传
				console.log('Promise.all的值是：'+JSON.stringify(e))
				toOss(fileSrc,up_type);
			}).catch((e)=>{
				console.log('catch的值是：'+JSON.stringify(e))
			});
			
		}, function(e) {
			console.log("取消选择图片");
		}, {
			filter: "image",
			multiple: true,
			maximum:1,
			system: false,
			onmaxed: function() {
				// plus.nativeUI.alert('最好不要一次上传太多张');
			}
		});
	}
 
  function setHtml(path) {
 	 var str = '';
 	 str = '<li class="img-box" style="padding-left: 10px;padding-top:5px" onclick="delImg(this)">'+
 	 '<img id="travelimg" class="uploadImg" src="'+path+'" ref="rep" style="width: 110px; height: 80px;" data-preview-src="" data-preview-group="4">'+
	 '<div style="margin-top:-90px;position:absolute;margin-left:104px"  >'+
	 '<div class="deleteImg" style="padding-left:2px;width:12px;height:12px;line-height: 12px;border-radius:50%;background-color:red;color:#FFF;font-size:14px;">'+'x'+'</div>'+
 	 '</div>'+'</li>';
 	 jQuery(".set_images").append(str);
 	 }


//上传图片到oss服务器
function toOss(fileSrc,up_type){
	// var files=vm.medallion;
	plus.nativeUI.showWaiting( "上传中..." );
	var o_url = request.ServerUrl_new+request.upload_img;
	/**
	 * 这里不懂的可以去hbuild官网查看
	 */
	var task = plus.uploader.createUpload(o_url, {  
	method: 'post',   
	blocksize:204800,  
	timeout: 10  
	},function(data, status){
		console.log(JSON.stringify(data))
		if(status == 200){
			var temp_urlInfo=JSON.parse(data.responseText);
			console.log(JSON.stringify(temp_urlInfo));
			if(temp_urlInfo.code == 200){
				plus.nativeUI.closeWaiting();//关闭旋转菊花
				// mui.toast('图片上传成功！');
					// vm.medallion=[];
					vm.medallion.push(temp_urlInfo.data);
					console.log(JSON.stringify(vm.medallion))
			}	
		}else{
			mui.toast('图片上传失败！');
		}
	});
	console.log(fileSrc.length);
	for (var i = 0; i < fileSrc.length; i++) {
	                    var f = fileSrc[i];
	                    task.addFile(f, {
	                        key: 'inputfile'                      //相同的key在后端只能拿到一张，所以要设置不同的key
	                    });
	                };
	// task.addFile(src, {key: 'inputfile'}); 
	task.addData('type', 'uploadImg'); 
	task.start();
};

function delImg(obj)  
     {  
		 // alert(obj)
        var list =document.getElementsByTagName('li');  
        for(var i=0;i<list.length;i++){  
            list[i].index=i;  
			console.log( list[i].index)
        }  
		console.log(obj.index)
        var idx=obj.index-1;  
        var ul=obj.parentNode;  
		console.log(idx)
        var btnArray=['是','否'];  
        plus.nativeUI.confirm("确定要删除此图?",function(e){  
            if(e.index==0){  
                ul.removeChild(obj);  
                vm.medallion.splice(idx,1); 
            }   
        },{"buttons":btnArray})  
		} 
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
	if (leng >5) {
		alert('照片不能超过5张！');
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