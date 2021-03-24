/**
 * 判断应用升级模块，从url地址下载升级描述文件到本地local路径
 * yanyilin@dcloud.io
 * 
 * 升级文件为JSON格式数据，如下：
{
	"appid":"HelloH5",
	"wgtURL": "差量包文件下载地址"
	"version": "新版本号，如：1.0.0",
    "iOS":"ios是否需要升级 1 需要升级从appstore中下载 2 不需要升级",
    "Android": "android是否需要升级  1 需要升级从服务器下载新的apk 2 不需要升级"
}
 *
 */
(function(w,request){
	var checkUrl = request.ServerUrl+"/app/personal/get_pt"; // 检测更新
	var downloadWgtUrl = request.ServerUrl+"/update/driver.wgt"; // 升级包目录
	var downloadApkUrl = request.ServerUrl+"/update/driver.apk"; // 升级包目录
	var iosURL = "https://itunes.apple.com/cn/app/%E8%B5%A4%E9%80%94%E6%89%BF%E8%BF%90%E7%AB%AF/id1249214373?mt=8"; // 苹果地址
	var ios_state = null; // ios升级状态 1 需要升级从appstore中下载 2 差量升级 3 不升级
    var android_state = null; // android是否需要升级 1 需要升级从服务器下载新的apk 2 差量升级 3 不升级
    var app_version = null; // 当前应用版本号
	var ios_version = null; // 服务器上苹果的版本号
	var android_version = null; // 服务器上安卓的版本号
	// plusReady 加载完毕执行
	function plusReady(){
		console.log("==============检查更新=======================");		
	    // 获取本地应用资源版本号
	    plus.runtime.getProperty(plus.runtime.appid,function(inf){
	        app_version = inf.version; 
	        checkUpdate();
	    });
	}
	
	/**
	 * 检测更新
	 * @Auther: 李渊
	 * @Date: 2018.8.10
	 * @param {type} param_name
	 * @return {type}
	 */
	function checkUpdate(){
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange=function(){
	        switch(xhr.readyState){
	            case 4:
		            if(xhr.status==200){
		                var res = JSON.parse(BASE64.decode(xhr.responseText));
					    res = res.data;
					    console.log('res:'+JSON.stringify(res));
				        ios_version = res.ios_version; // 苹果版本号
				        android_version = res.android_version; // 安卓版本号
				        ios_state = res.ios; // 苹果升级状态 1 整包升级 2 差量升级 3 不升级
				        android_state = res.android; // 安卓需要升级状态 1 整包升级 2 差量升级 3不升级
		                // 监听应用启动界面关闭事件
						if(plus.navigator.hasSplashscreen()){ // 启动页未关闭
							document.addEventListener("splashclosed", checkOs, false);
						}else{ //启动界面已关闭
							checkOs();
						}
		            }else{
		                console.log("检测更新失败！");
		            }
	            	break;
	            default:
	            	break;
	        }
	    }
	    xhr.open('GET',checkUrl);
	    xhr.send();
	}
	
	/**
	 * 判断手机系统检测升级
	 * @Auther: 李渊
	 * @Date: 2018.8.10
	 * @param {Object} data 从服务器上获取的升级文件
	 * @return {type}
	 */
	function checkOs(){ 
        if(plus.os.name == 'Android'){	// 	Android 用户
        	// 判断版本号
        	var isupdate = compareVersion(app_version,android_version); // 是否需要升级
        	// 
        	if(!isupdate) return false;
        	//
        	switch (android_state){
        		case '1':
        			plus.nativeUI.alert( "温馨提示:请升级、新版本APP为您带来更好的服务体验！", function(){
						createDownload();
					}, "升级新版本" );
        			break;
        		case '2':
        			downWgt();
        			break;
        		case '3':
        			break;
        		default:
        			break;
        	}
		}else{ // 苹果用户
			// 判断版本号
        	var isupdate = compareVersion(app_version,ios_version); // 是否需要升级
        	// 
        	if(!isupdate) return false;
        	
			switch (ios_state){
        		case '1':
        			plus.nativeUI.alert( "温馨提示:请升级、新版本APP为您带来更好的服务体验！", function(){
						plus.runtime.openURL( iosURL );
					}, "升级新版本");
        			break;
        		case '2':
        			downWgt();
        			break;
        		case '3':
        			break;
        		default:
        			break;
        	}
		}
	}
	
	/**
	 * 比较版本大小，如果新版本nv大于旧版本ov则返回true，否则返回false
	 * @param {String} ov
	 * @param {String} nv
	 * @return {Boolean} 
	 */
	function compareVersion( ov, nv ){
		if ( !ov || !nv || ov=="" || nv=="" ){
			return false;
		}
		var b=false,
		ova = ov.split(".",4),
		nva = nv.split(".",4);
		for ( var i=0; i<ova.length&&i<nva.length; i++ ) {
			var so=ova[i],no=parseInt(so),sn=nva[i],nn=parseInt(sn);
			if ( nn>no || sn.length>so.length  ) {
				return true;
			} else if ( nn<no ) {
				return false;
			}
		}
		if ( nva.length>ova.length && 0==nv.indexOf(ov) ) {
			return true;
		}
	}
	
	// 下载wgt文件
	function downWgt(){
	    plus.nativeUI.showWaiting("更新文件...");
	    plus.downloader.createDownload( downloadWgtUrl, {filename:"_doc/update/"}, function(d,status){
	        if ( status == 200 ) { 
	            console.log("下载wgt成功："+d.filename);
	            installWgt(d.filename); // 安装wgt包
	        } else {
	            console.log("下载wgt失败！");
	        }
	        plus.nativeUI.closeWaiting();
	    }).start();
	}
	// 更新应用资源升级包
	function installWgt(path){
	    plus.nativeUI.showWaiting("安装文件...");
	    plus.runtime.install(path,{},function(){
	        plus.nativeUI.closeWaiting();
	        plus.nativeUI.alert("应用资源更新完成！",function(){
	            plus.runtime.restart();
	        });
	    },function(e){
	        plus.nativeUI.closeWaiting();
	        plus.nativeUI.alert(JSON.stringify(e));
	    });
	}
	/**
	 * 创建下载任务 安卓
	 */
	function createDownload() {
		var dtask = plus.downloader.createDownload( downloadApkUrl, { filename:'_doc/download/'}, function ( d, status ) {
			// 下载完成
			if ( status == 200 ) { 
				plus.runtime.install(d.filename, {}, function(){
					console.log('安装成功');
				}, function(DOMException ){
					alert(JSON.stringify(DOMException));
				});
			} else {
				alert( "Download failed: " + status ); 
			}  
		});
		dtask.start(); 
	}
	if(window.plus){
	    plusReady();
	}else{
	    document.addEventListener('plusready',plusReady,false);
	}
})(window,request);