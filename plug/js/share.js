/**
 * =================================
 * 集成分享
 * =================================
 */
;(function($,doc,window){
	var share = window.share = function(){
		this.obj = {};
	}
	/**
	 * 初始化分享获取分享服务对象
	 */
	share.prototype.updateSerivces = function(){
		var self = this;
		plus.share.getServices(function(s) {
		    for(var i in s){
				var t=s[i];
				self.obj[t.id]=t;
			}
		}, function(e) {
		    console.log("获取分享服务列表失败：" + e.message);
		});
	}
	/**
	 * 打开分享
	 */
	share.prototype.openShare = function(msg){
		var self = this;
		
		var shares = self.obj;
		// 分享按钮
		var shareBts=[];
		// 更新分享列表
		var ss=shares['weixin'];
		
			// ss&&ss.nativeClient&&(shareBts.push({title:'微信朋友圈',s:ss,x:'WXSceneTimeline'}),
		if(navigator.userAgent.indexOf('qihoo')<0){  //在360流应用中微信不支持分享图片
				
			shareBts.push({title:'微信好友',s:ss,x:'WXSceneSession'});
		}
		// ss=shares['sinaweibo'];
		// ss&&ss.nativeClient&&shareBts.push({title:'新浪微博',s:ss});
		ss=shares['qq'];
		ss&&ss.nativeClient&&shareBts.push({title:'QQ',s:ss});
		// 弹出分享列表
		shareBts.length>0?plus.nativeUI.actionSheet({title:'分享',cancel:'取消',buttons:shareBts}, function(e){
			(e.index>0)&&self.shareAction(shareBts[e.index-1],msg);
		}):plus.nativeUI.toast('当前环境无法支持分享操作!');
	}
	/**
	 * 弹出action
	 * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
	 * @param {Boolean} bh 分享的内容 
	 * @example 
	 * msg = {
	 * 	content:  (String 类型 )分享消息的文字内容
	 * 	pictures: (Array[String] 类型 )分享消息的图片
	 *  thumbs:   (Array[Stromg] 类型 )分享消息的缩略图
	 *  href: 	  (String 类型 )分享独立的链接 仅支持网络地址（以http://或https://开头）。 如果不能同时支持其它内容信息，优先级顺序为：href>pictures>content。
	 *  title:    (String 类型 )分享消息的标题
	 * }
	 */
	share.prototype.shareAction = function(sb,msg){
		var self = this;
		
		if(!sb||!sb.s){ // 是否存在分享通道 并且此分享通道已经开启
			plus.nativeUI.toast('无效的分享服务！');
			return;
		}
		// 微信分享场景，仅微信分享平台有效
		msg.extra = {scene:sb.x}
		// 发送分享
		if(sb.s.authenticated){ // 如果授权
			self.shareMessage(msg, sb.s);
		}else{ // 创建分享授权控件对象
			plus.nativeUI.toast('---未授权---');
			sb.s.authorize(function(){
				self.shareMessage(msg,sb.s);
			}, function(e){
				plus.nativeUI.toast('认证授权失败：'+e.code+' - '+e.message);
			});
		}
	},
	/**
  	 * 发送分享消息
   	 * @param {JSON} msg
   	 * @param {plus.share.ShareService} 分享对象
   	 */
	share.prototype.shareMessage = function(msg, s){
		s.send(msg, function(){
			plus.nativeUI.toast('分享成功');
		}, function(e){
			plus.nativeUI.toast('分享失败');
		});
	}
	/**
	 * 解除所有分享服务的授权
	 */
	share.prototype.cancelAuth = function(){
		var self = this;
		try{
			for(var i in shares){
				var s=shares[i];
				if(s.authenticated){
					s.forbid();	
				}
			}
			// 取消授权后需要更新服务列表
			self.updateSerivces();
			plus.nativeUI.toast('取消成功');
		}catch(e){
			console.log(e);
		}
	}
})(mui,document,window);
