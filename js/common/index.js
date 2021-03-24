
/**
 * @description index首次加载页面的js逻辑，现在仅仅统计页面启动以及切换到后台的各种方法
 * @param {type}  Kaderic
 * @return {type} 2019-08-05
 */

/**
 * @description 统计启动次数
 * @param {type} param_name
 * @return {type}
 */
function statistic(){
	// var token = user.getState('token');
	// if(!token) return false;
	// mui.ajax(request.ServerUrl+'/user/base/app_activate',{
	// 	data:{
	// 		token: token
	// 		// token:"McTtUp2hNpD6I9x6O9T6Q92MzgwMDAxOWNvZGVwaHAO0O0O"
	// 	},
	// 	dataType:'json',//服务器返回json格式数据
	// 	type:'post',//HTTP请求类型                    
	// 	timeout:30000,//超时时间设置为10秒；
	// 	success:function(data){
	// 		console.log("====统计成功====");
	// 	},
	// 	error:function(xhr,type,errorThrown){
	// 		console.log("====统计失败====");
	// 	}
	// });
}

// plus加载完毕执行
mui.plusReady(function(){
	
	
	// localStorage.setItem('ftoken','');
		  //  if(!localStorage.ftoken){
			 //   console.log("localStorage"+JSON.stringify(localStorage));
		   	
				// mui.openWindow({             
				// 	id: 'login.html',
				// 	url: 'login/login.html',
				// 	waiting: {
				// 		autoShow: false
				// 	}
				// });
		  //  } 

	// push 推送
 plus.push.addEventListener("receive", function(msg) {
        if (plus.os.name == 'iOS') {
            if (msg.payload) {
                var myAudio= plus.audio.createPlayer('audio/notify.wav');

                myAudio.play(function(){
                 console.log('audio play success');
                },function(err){
                 console.log('audio play'+JSON.stringify(err));
                })
                plus.push.createMessage(msg.content,'',{
                 title: '赤途承运端'
                });
            }
        } else {
            var myAudio= plus.audio.createPlayer('audio/notify.wav');
            myAudio.play(function(){
             console.log('audio play success');
         },function(err){
          console.log('audio play'+JSON.stringify(err));
            })
            plus.push.createMessage(msg.content,'',{
             title: '赤途承运端'
            });
        }
    });
// })


	// 设置应用非全屏显示！
	// plus.navigator.setFullscreen(false);
	// 监听启动界面关闭事件
	document.addEventListener("splashclosed", function(){
		statistic();
		console.log('====我登陆赤途了====');
	}, false);
	// 运行环境从前台切换到后台事件
	document.addEventListener('pause', function(){
		console.log('====我到后台了====');
		// window.clearInterval('intcheck');
		// window.clearInterval(intcheck)
	},false);
	// 运行环境从后台切换到前台事件
	document.addEventListener("resume", function(){
		statistic();
		console.log('====我到前台了====');
	}, false);
	// 应用切换到后台运行事件
	document.addEventListener("background", function(){
		console.log('====多个应用我到后台了====')
	}, false);
	// 应用切换到前台台运行事件
	document.addEventListener("foreground", function(){
		statistic();
		console.log('====多个应用我到前台了====');
	}, false);

	// 页面tab初始化
	var _self = plus.webview.currentWebview();
	
	// 初始化scroll组件
	mui('.mui-scroll-wrapper').scroll({
		deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
	});
	

//         plus.navigator.setStatusBarStyle("UIStatusBarStyleBlackOpaque");
		// plus.navigator.setStatusBarBackground('#FFFFFF');        //设置状态栏的颜色	
		// plus.navigator.setStatusBarBackground('#000000');
		// plus.navigator.setStatusBarBackground(color);

// 直接进入启动页
	// mui.openWindow({
	// 	id: 'guide.html',
	// 	url: 'guide/guide.html',
	// 	styles: {
	// 		popGesture: "none",
	// 		background: "transparent",
	// 	},
	// 	show: {
	// 		aniShow: 'none'
	// 	},
	// 	waiting: {
	// 		autoShow: false
	// 	}
	// });
	// 启动页与引导页,直接放出来就能使用
	if(!plus.storage.getItem("lauchFlag")){
		mui.openWindow({             //新下载引导页
			id: 'guide_new.html',
			url: 'guide/guide_new.html',
			styles: {
				popGesture: "none",
			},
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: false
			}
		});
	}else{                             // app启动页
		// mui.openWindow({
		// 	id: 'guide.html',
		// 	url: 'guide/guide.html',
		// 	styles: {
		// 		popGesture: "none",
		// 		background: "transparent",
		// 	},
		// 	show: {
		// 		aniShow: 'none'
		// 	},
		// 	waiting: {
		// 		autoShow: false
		// 	}
		// });
	}
	//延迟加载tab页面  (现在没有，后面可以继续添加)
	setTimeout(function(){
		// 页面初始化
		mui.init();
		// 初始化tabbar 
		InitTabbar();
		
	},300);
	
	//  验证token过期，先禁止掉，无法使用
//	var intcheck=setInterval("checkToken()",3000);
	
});

window.addEventListener("PageEvent",function(){
	console.log("检查是否首次启动,创建引导视图");
	if(!plus.storage.getItem("guidemask")){
		mui.openWindow({             //新下载引导页
			id: 'mask.html',
			url: 'guide/mask.html',
			styles: {
				popGesture: "none",
			},
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: false
			}
		});
	}
})