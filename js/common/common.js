/*!
 * ======================================================
 * common js For 赤途APP
 * ======================================================
 * @version:1.0.0
 * @author:李渊
 */
(function(w,$){  
	
	/**
	 * @description: 取消浏览器的所有事件
	 * @return {Boolean} 
	 */
	function shield(){ 
		return false;
	}
	/**
	 * @description: 取消浏览器的所有事件，使得active的样式在手机上正常生效
	 * @param {Function}  shield
	 *          touchstart 手指触摸屏幕时触发，即使已经有手指在屏幕上也会触发。
	 *          下面就取消掉了touchstart的默认事件，直接return false，这个方法就不会执行
	 */
	document.addEventListener('touchstart',shield,false);
	
	/**
	 * @description: 自定义按钮抬起样式
	 *     touchend: 手指从屏幕时移开时触发。
	 * 
	 *   点击了按钮，通常按钮会主动添加一个active类，这是不需要添加的css类样式，取消掉
	 */
	$('body').on('touchend','.mui-btn-main',function(){  	
	  	this.classList.remove("mui-btn-mainActive");
	}); 
	
	
	/**
	 * @description: 屏蔽选择函数
	 * @param {Function}  shield 
	 * 
	 * 禁用右键的浏览器默认弹起菜单事件（调用到网页，右键无法唤起默认菜单就是这里在控制）
	 */
	document.oncontextmenu = shield;
	
	
	
	/**
	 * @description: 自定义按钮按下样式
	 * 前面取消掉了这个touchstart的事件为return false  并且取缔了按钮在touchend时按钮的active类
	 * 现在重新在touchstart上定义按钮的touchstart事件，还会起效吗？？
	 */
	$('body').on('touchstart','.mui-btn-main',function(){
	  	this.classList.add("mui-btn-mainActive");
	}); 
	
	/**
	 * @description: DOMContentLoaded事件处理  (DOM树构建完成)
	 * @param {Function}  
	 */
	var domready=false;
	document.addEventListener('DOMContentLoaded',function(){
		domready=true;
		document.body.onselectstart=shield;
	},false);
	
	/**
	 * @description: 页面兼容性调整键盘弹出导致的header上移
	 * @param {Function}  
	 */
	$.plusReady(function(){
		plus.webview.currentWebview().setStyle({
		    softinputMode: "adjustResize"  // 弹出软键盘时自动改变webview的高度
		});	
	
		
	})
})(window,mui);

function click_one(){
	var timestamp=new Date().getTime();
	var time_out_time = localStorage.click_out_time ? localStorage.click_out_time : 0;
	var get_time = timestamp - time_out_time;
	if (get_time < 1000) {
		return false;
	} else {
		localStorage.click_out_time = timestamp;
		return true;
	}
}
/**
 * ================================================== 
 * 页面跳转
 * ==================================================
 **/
(function(w,$){
	var openw=null,waiting=null,as='slide-in-right';
	/**
	 * @description 关闭等待框
	 * @type {Object}
	 */
	w.closeWaiting=function(){
		waiting&&waiting.close();
		waiting=null;
	}
	/**
	 * 打开新窗口
	 * @param {URIString} 	url : 要打开页面url
	 * @param {Object} 		data : 页面额外扩展参数
	 * @param {boolean} 	wa : 是否显示等待框
	 * @param {JSON} 		ws : 创建Webview窗口的样式（如窗口宽、高、位置等信息）
	 * @return {type}
	 */
	w.clicked=function(url,data,wa,ws){
		// var token = user.getState('ftoken');
		
		// var phone = user.getState('tel');
		// var login = user.getState('login');
		var ftoken = localStorage.ftoken;
		var dtoken = localStorage.dtoken;
		// console.log("token"+token);
		// !login && 
		if(!ftoken){
			openLogin();
			console.log("登录失败");
			return false;
		}
		// 避免多次打开同一个页面
		// console.log(openw);
		if(openw){ 
			console.log('opened');
			// openw.show();
			return null;
		}
		// plusReady 对象加载完毕 
		if(w.plus){ 
			wa&&(waiting=plus.nativeUI.showWaiting());
			ws=ws||{};
			ws.scrollIndicator||(ws.scrollIndicator='none');
			ws.scalable||(ws.scalable=false);
			// 判断是否有页面额外扩展参数没有则为空对象
			data=data||{};
			// 定义id为页面链接 
			id = url;
			// 创建webview视图
			openw=plus.webview.create(url,id,ws,data);
			// 页面加载完成后才显示
			openw.addEventListener('loaded',function(){
				// 延后显示可避免低端机上动画时白屏
				setTimeout(function(){
					// 页面显示方式右侧滑入
					openw.show(as);
					// 关闭等待框
					closeWaiting();
				},50);
			},false);
			// 页面监听关闭事件关闭后要清空webview关闭后可再次打开
			openw.addEventListener('close',function(){
				openw=null;
			},false);
			return openw;
		}else{
			w.open(url);
		}
		return null;
	};
	/**
	 * 判断是否登陆未登陆跳转登陆页面
	 * @param {Object} v
	 * @param {Number} l
	 * @return {String} 
	 */
	var loginPage = null;
	w.openLogin = function(){
		console.log("00000000000000000000000000000000000000000000000000000000000000000000000")
		localStorage.removeItem("userInfo");
		mui.plusReady(function(){
		     plus.webview.getWebviewById('user/user.html').evalJS('refreshData_index_menu()');
		});
		
		
		var c_out = click_one();
		if (!c_out) {
			console.log('time_in');
			return false;
		}

		if(loginPage){
			return null;
		}
		console.log('to_login');
		localStorage.removeItem("userInfo");
		if(w.plus){ // plusReady 对象加载完毕 

			var loginPage = plus.webview.getWebviewById('login');
			if (loginPage && loginPage.id == 'login') {
				loginPage = null;
			}
			loginPage=plus.webview.create('/login/login.html','login',{});
			loginPage.addEventListener('loaded',function(){//页面加载完成后才显示
				setTimeout(function(){//延后显示可避免低端机上动画时白屏
					loginPage.show('fade-in');
				},300);
			},false);
			loginPage.addEventListener('close',function(){//页面关闭后可再次打开
				loginPage=null;
			},false);
			return loginPage;
		}else{
			w.open('login');
		}
		return null;
	}
	/**
	 * 页面刷新
	 */
	w.refreshData = function(){
		if(plus.webview.currentWebview().opener()){	
			console.log("跳之前页面");
			plus.webview.currentWebview().opener().evalJS('refreshData()');
		}
		if(plus.webview.getWebviewById('user/user.html')){	
			console.log("跳个人中心页面");
			localStorage.is_now_action = 1;
			plus.webview.getWebviewById('user/user.html').evalJS('refreshData_index_menu()');
		};
		if(plus.webview.getWebviewById('driver/driver.html')){
			console.log("跳接单tab页面");
			plus.webview.getWebviewById('driver/driver.html').evalJS('getDriverData()');
		}

	}
})(window,mui);

/**
 * ================================================== 
 * 时间戳转化
 * ==================================================
 **/
(function(w,$){
	/**
	 * @description  格式化日期时间字符串，格式为"YYYY-MM-DD"
	 * @param {Number} d 时间戳
	 */
	w.yearToStr=function(d){
		return (d.getFullYear()+"-"+ultZeroize(d.getMonth()+1)+"-"+ultZeroize(d.getDate()));
	};
	/**
	 * @description  格式化日期时间字符串，格式为"MM-DD"
	 * @param {Number} d 时间戳
	 */
	w.monthToStr=function(d){
		return (ultZeroize(d.getMonth()+1)+"月"+ultZeroize(d.getDate()))+'日';
	};
	/**
	 * @description  格式化时长字符串，格式为"HH:MM:SS"
	 * @param {Number} ts 时间戳
	 */
	w.timeToStr=function(ts){
		if(isNaN(ts)){
			return "--:--:--";
		}
		var h=parseInt(ts/3600);
		var m=parseInt((ts%3600)/60);
		var s=parseInt(ts%60);
		return (ultZeroize(h)+":"+ultZeroize(m)+":"+ultZeroize(s));
	};
	/**
	 * @description  格式化日期时间字符串，格式为"YYYY-MM-DD HH:MM"
	 * @param {Number} d 时间戳
	 */
	w.minuteToStr=function(d){
		return (d.getFullYear()+"-"+ultZeroize(d.getMonth()+1)+"-"+ultZeroize(d.getDate())+" "+ultZeroize(d.getHours())+":"+ultZeroize(d.getMinutes()));
	};
	/**
	 * @description  格式化日期时间字符串，格式为"YYYY-MM-DD HH:MM:SS"
	 * @param {Number} d 时间戳
	 */
	w.dateToStr=function(d){
		return (d.getFullYear()+"-"+ultZeroize(d.getMonth()+1)+"-"+ultZeroize(d.getDate())+" "+ultZeroize(d.getHours())+":"+ultZeroize(d.getMinutes())+":"+ultZeroize(d.getSeconds()));
	};
	/**
	  * @description  格式化日期时间字符串，格式为"HH:MM"
	  * @param {Number} d 时间戳
	  */
	 w.hourToStr=function(d){
	  return (ultZeroize(d.getHours())+":"+ultZeroize(d.getMinutes()));
	 };
	/**
	 * zeroize value with length(default is 2).
	 * @param {Object} v
	 * @param {Number} l
	 * @return {String} 
	 */
	w.ultZeroize=function(v,l){
		var z="";
		l=l||2;
		v=String(v);
		for(var i=0;i<l-v.length;i++){
			z+="0";
		}
		return z+v;
	};
})(window,mui);

/**
 * ================================================== 
 * 用户信息本地存储
 * ==================================================
 **/
(function($,user) {
	/** 用户登录**/
	user.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.mobile = loginInfo.mobile || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.mobile.length < 11 || loginInfo.password.length < 6) {
			return callback(false);
		}else{
			return callback(true);
		}
	};
	/**用户退出 **/
	user.out = function(callback) {
		callback = callback || $.noop;
		plus.webview.currentWebview().opener().evalJS('refreshData()');
		localStorage.removeItem("userInfo");
		clicked('../login/login.html');
		return callback();
	};
	/**设置用户所有状态 **/
	user.setAllState = function(state,callback) {
		callback = callback || $.noop;
		state = state || {};
		localStorage.setItem('userInfo', JSON.stringify(state));
		return callback();
	};
	/**获取用户所有状态**/
	user.getAllState = function() {
		var stateText = localStorage.getItem('userInfo') || "{}";
		return JSON.parse(stateText);
	};
	/** 获取用户信息 **/
	user.getState = function(name) {
		var state = user.getAllState();
		if(state[name] == undefined){
			return null;
		}else{
			return state[name];	
		};
	}
	/**设置当前状态**/
	user.setState = function(name, val, callback) {
		callback = callback || $.noop;
		var state = user.getAllState();
		state[name] = val;
		user.setAllState(state);
		return callback();
	};
	
}(mui,window.user = {}));

/**
    * 从当前页面pop到目标页面
    * @param {String} targetId 目标页面ID
    * @param {Boolean} isReload 是否让目标页面执行reload方法刷新（全局刷新）
    * @param {String} eventName 自定义事件名称，如果存在，就触发（可以实现局部刷新）
    * @param {Object} data json格式的数据（自定事件参数）
    */
(function($,plusCommon) {
	
	plusCommon.popToTarget=function(targetId, isReload, eventName, data){
		console.log("targetId"+targetId);
        //获取目标页面
        var target = plus.webview.getWebviewById(targetId);
        if (!target) {
            console.log("目标页面不存在！");
            return;
        }
        //获取当前页面
        var current = plus.webview.currentWebview();
        if (current === target) {
            console.log("目标页面是当前页面！");
            return;
        }
        //将要关闭的页面
        var pages = new Array(current);
        //父级页面
        var opener = current.opener();
        console.log('opener:'+opener);
        console.log('opener:'+JSON.stringify(opener));
        console.log('target:'+JSON.stringify(target));
        while (opener){
            if (opener === target) {//找到了目标页面
                //是否需要触发目标页面的自定义事件
                if (eventName) {
                    if (isReload) {//全局刷新和局部刷新（自定义事件）同时存在
                        //在全局刷新完成之后再触发目标页面的自定义事件
                        target.onloaded = function(){
                            mui.fire(target, eventName, data);
                        };
                    } else {
                        mui.fire(target, eventName, data);
                    }
                }
                //是否需要全局刷新目标页面
                if (isReload) {
                    target.reload();
                }
                //关闭目标页面的所有子级页面pages
                pages.map(function(page){
                    page.close();
                });
                return;
            }
            pages.push(opener);
            opener = opener.opener();
        }
        //没有找到目标页面
        console.log("目标页面不是当前页面的祖先！");
    }
}(mui,window.plusCommon = {}));



/**
 * @description：自定义指令，可以用全局方法 Vue.filter() 注册一个自定义过滤器;
 * 返回格式化的时间戳 yy-mm-dd
 */
Vue.filter('dataToYearOther',function(value){
	value = parseInt(value);
    var d = new Date(value);
	return yearToStr(d);
});
/**
 * @description：自定义指令，可以用全局方法 Vue.filter() 注册一个自定义过滤器;
 * 返回格式化的时间戳 YYYY-MM-DD HH:MM:SS
 */
Vue.filter('dateToStr',function(value){
    var d = new Date(value*1000);
	return dateToStr(d);
});
/**
 * @description：自定义指令，可以用全局方法 Vue.filter() 注册一个自定义过滤器;
 * 返回格式化的时间戳 YYYY-MM-DD HH:MM
 */
Vue.filter('minuteToStr',function(value){
    var d = new Date(value*1000);
	return minuteToStr(d);
});

Vue.filter('minuteToStr9',function(value){
    var d = new Date(value); 
	return minuteToStr(d);
});

/**
 * @description：自定义指令，可以用全局方法 Vue.filter() 注册一个自定义过滤器;
 * 返回格式化的时间戳 YYYY-MM-DD HH:MM:SS
 */
Vue.filter('dateToStro',function(value){
	// console.log(value);
	if(value == '请选择提货时间' || value == '请选择' || value == '请选择收货时间'){
		return value;
	}else{
		var d = new Date(parseInt(value));
		return minuteToStr(d);
	}
});




/**
 * @description：自定义指令，可以用全局方法 Vue.filter() 注册一个自定义过滤器;
 * 返回价格/100
 */
Vue.filter('moneyToReal',function(value){
		return value/100;
});
/**
 * @description：自定义指令，可以用全局方法 Vue.filter() 注册一个自定义过滤器;
 * 返回格式化的时间戳 yy-mm-dd
 */
Vue.filter('dataToYear',function(value){
    var d = new Date(value*1000);
	return yearToStr(d);
});
/**
 * @description：自定义指令，可以用全局方法 Vue.filter() 注册一个自定义过滤器;
 * 返回格式化的时间戳mm-dd
 */
Vue.filter('monthToStr',function(value){
    var d = new Date(value*1000);
	return monthToStr(d);
});
/**
 * @description：自定义指令，可以用全局方法 Vue.filter() 注册一个自定义过滤器;
 * 返回格式化的时间戳hh:mm
 */

Vue.filter('hourToStr',function(value){
    var d = new Date(value);
 return hourToStr(d);
});

/**
 * 匹配电话号码
 * 15012341234 => 150****1234
 */
Vue.filter('phone', function (value) {
  if (!value) return '';
  let str = value;
  str = str.toString().replace(/^(\d{3})(\d{4})(\d{4})/g , '$1****$3')
  return str;
})

//千分位转数字
Vue.filter('NumFormat', function(value) {

  if(!value) return '0.00';
  /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
  var intPart =  Number(value)|0; //获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
  var floatPart = ".00"; //预定义小数部分
  // console.log(888,value)
  // console.log(888,typeof(value))
  var value2Array = value.toString().split(".");
  var isNegtiveNo = ''
  if(intPartFormat == 0){
    if(value.toString().indexOf('-') != 1) isNegtiveNo = '-' //修复小于0负数丢失的问题
  }

  //=2表示数据有小数位

  if(value2Array.length == 2) {
    floatPart = value2Array[1].toString(); //拿到小数部分
    if(floatPart.length == 1) { //补0,实际上用不着
      return isNegtiveNo + intPartFormat + "." + floatPart + '0';
    } else {
      return isNegtiveNo + intPartFormat + "." + floatPart;
    }
  } else {
    return isNegtiveNo + intPartFormat + floatPart;
  }
})




/*
 * * @description：自定义指令，可以用全局方法 Vue.filter() 注册一个自定义过滤器;
 * 判断星级*/
Vue.filter('gradeToString',function(value){
	var index = parseInt(value);
    var val = '';
    switch (index){
    	case 0:
    		val ='../images/icon/ystarsfive.png';
    		break;
    	case 1:
    		val ='../images/icon/ystars.png';
    		break;
    	case 2:
    		val ='../images/icon/ystarstwo.png';
    		break;
    	case 3:
    		val ='../images/icon/ystarsthree.png';
    		break;
    	case 4:
    		val ='../images/icon/ystarsfour.png';
    		break;
    	case 5:
    		val = '../images/icon/ystarsfive.png';
    		break;
    	default:
    		break;
    }
    return val;
});


/**
 * ==================================
 * description: 关于手机号常用方法的封装
 * ==================================
 * Date: 2018.1.10
 * Auther: liyuan
 */
;(function(win,doc,tel){
	
	/**
	 * @description: 手机号加*
	 * @param {string} str 需要加*的字符串
	 * @param {number} startLen 开始的长度
	 * @param {number} endLen 结束的长度
	 */
	tel.plusxing = function(str,startLen,endLen){
		var len = endLen-startLen;
	    var xing = '';
	    for (var i=0;i<len;i++) {
	        xing+='*';
	    }
	    return str.substr(0,startLen)+xing+str.substr(endLen,str.length);
	}
})(window,document,window.tel = {});


/**
 * ==================================
 * description: 请求钱包，验证token过期，index.js中最后调用
 * ==================================
 * Date: 2019.10.25
 * Auther: Kaderic
 * 
 * 1001 成功的请求
 * 1007 失败的请求
 * 其他状态码不知道
 */

function checkToken(){
	return true;
}

function set_title_ios(header){
	mui.plusReady(function () {
		    if (mui.os.ios) {
		        if (screen.height >= 812 && screen.width == 375){
		            //是iphoneX
		            StatusbarHeight=84;
		        }else{
		            //不是iphoneX
		            StatusbarHeight=20;
		        }
		    } else {
		        //H5+APP原生获取状态栏高度，如果打包不引入iOS原生，也可以只调用下面这句无需判断。
		        StatusbarHeight = plus.navigator.getStatusbarHeight();
		    }
			

		// var header=document.getElementById('hearder_id');
		var height = header.height();
		if(plus.navigator.isImmersedStatusbar()){// 兼容immersed状态栏模式
			// 获取状态栏高度并根据业务需求处理，这里重新计算了子窗口的偏移位置
			he_topoffset=(Math.round(height)+StatusbarHeight);
			// he_topoffset=(Math.round(fo_topoffset.height())+70);
			header.css({"height":he_topoffset+"px !important"});
			header.css({"padding-top":StatusbarHeight+"px !important"});
			
		}
	});
}

function judgeBigScreen() {  //，这里根据返回值 true 或false ,返回true的话 则为全面屏 
	let result = false;
		const rate = window.screen.height / window.screen.width;    
		let limit =  window.screen.height == window.screen.availHeight ? 1.8 : 1.65; // 临界判断值  
   // window.screen.height为屏幕高度
  //  window.screen.availHeight 为浏览器 可用高度
		if (rate > limit) {
			result = true;
		}
		return result;
	}

function setAutoHeight(callback,type) {  
	mui.plusReady(function() {
	    var topoffset = '45px';  
	    var header = document.getElementById('header_id');  
	    if(plus.navigator.isImmersedStatusbar()) {  
	        // 兼容immersed状态栏模式            
	        // 获取状态栏高度并根据业务需求处理，这里重新计算了子窗口的偏移位置           
	        topoffset = (Math.round(plus.navigator.getStatusbarHeight()) + 45); 
	        $('header').css({"padding-top":(topoffset - 45) + "px","height":topoffset+"px"});
	        if (type == 1) {
	        	$('.mui-content').css({'padding-top':topoffset+"px"});
	        }
	        callback(topoffset-45); 
	    }  
	})
}

function to_set_color_light(){
	mui.plusReady(function() {
		plus.navigator.setStatusBarStyle('light')
	});
}		
function to_set_color_dark(){
	mui.plusReady(function() {
		plus.navigator.setStatusBarStyle('dark')
	});
}
// setAutoHeight(function(){

// },1)
// var fl = judgeBigScreen();
// if (fl) {
// 	$('header').css({"padding-top":"25px"});
// 	$('.mui-action-back img').css({"top":"35px"});
// 	$('#btn').css({"top":"10px"});
// 	$('#nextStep').css({"margin-top":"10px"});
// }
// function checkToken(){
// 	// console.log("login");
// 	var token = user.getState('token');
// 	// console.log(token);
// 	if(!token){
// 		return false;
// 	} 
// 	mui.ajax(request.ServerUrl+'/app/user/get_money',{
// 		data:{
// 			token: token
// 		},
// 		dataType:'json',    // 服务器返回json格式数据
// 		type:'post',        // HTTP请求类型                    
// 		timeout:30000,      // 超时时间设置为10秒；
// 		success:function(data){
// 			// console.log("====验证token成功====");
// 			// console.log(JSON.stringify(data));
// 			var code = parseInt(data.code);
// 			// console.log(code);
// 			if(code == 1007 || code == 1008){      // 1007token失效或者未登录
// 				localStorage.removeItem("userInfo");
// 				clicked('../login/signIn.html');
// 			}
			
// 		},
// 		error:function(xhr,type,errorThrown){
// 			console.log("====验证token失败====");
// 		}
// 	});
// }