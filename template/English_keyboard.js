/* *
 * ==========================================
 * protocity.js 
 * ==========================================
 * Auther: 李渊
 * Notes: 弹出英文键盘
 */
;(function($,window,document){

var English_keyboard = window.English_keyboard = function() {
	this.value = '';
	this._init();
};

var proto = English_keyboard.prototype;

// 初始化
proto._init = function() {
	var self = this;
	
	// 创建dom
	self._createDom();
	
	// 点击取消
	$('#fixed-keybord').on('tap','.ikey-close',function(){ 
		self.callback('');
		self.value = '';
	  	self._hide();
	});
	// 点击英文键盘
	$('#fixed-keybord').on('tap','.ikey',function(){
		
	  	var value = this.getAttribute('data-value');
	  	
	  	self.value += value;
	  	
	  	self.callback(self.value);
	});
	// 点击删除键
	$('#fixed-keybord').on('tap','.cancel',function(){
		
		if(self.value.length > 0){
			
			self.value = self.value.substr(0,self.value.length-1);
			self.callback(self.value);
			
		}else{
			return false;
		}
	});
	//点击确定返回数据
	$('#fixed-keybord').on('tap','.confirm',function(){
		self.callback(self.value);
	  	self._hide();
	});
	//点击遮罩关闭键盘
	$('body').on('tap','.fixed-keybord-drop',function(){
		self.callback(self.value);
	  	self._hide();
	})
}

// 创建Dom
proto._createDom = function() {
	var self = this;
	var _Str = 
		'<div class="fixed-keybord-tit">城市首字母检索</div>'
		+'<ul class="clearfix ul_keybord">'
			+'<li class="ikey ikey10 li_zm " data-value="A"><span>A</span></li>'
			+'<li class="ikey ikey11 li_zm " data-value="B"><span>B</span></li>'
			+'<li class="ikey ikey12 li_zm " data-value="C"><span>C</span></li>'
			+'<li class="ikey ikey13 li_zm " data-value="D"><span>D</span></li>'
			+'<li class="ikey ikey14 li_zm " data-value="E"><span>E</span></li>'
			+'<li class="ikey ikey15 li_zm " data-value="F"><span>F</span></li>'
			+'<li class="ikey ikey16 li_zm " data-value="G"><span>G</span></li>'
			+'<li class="ikey ikey17 li_zm " data-value="H"><span>H</span></li>'
			+'<li class="ikey ikey18 li_zm " data-value="I"><span>I</span></li>'
			+'<li class="ikey ikey19 li_zm " data-value="J"><span>J</span></li>'
			+'<li class="ikey ikey20 li_zm " data-value="K"><span>K</span></li>'
			+'<li class="ikey ikey21 li_zm " data-value="L"><span>L</span></li>'
			+'<li class="ikey ikey22 li_zm " data-value="M"><span>M</span></li>'
			+'<li class="ikey ikey23 li_zm " data-value="N"><span>N</span></li>'
			+'<li class="ikey ikey24 li_zm " data-value="O"><span>O</span></li>'
			+'<li class="ikey ikey25 li_zm " data-value="P"><span>P</span></li>'
			+'<li class="ikey ikey26 li_zm " data-value="Q"><span>Q</span></li>'
			+'<li class="ikey ikey27 li_zm " data-value="R"><span>R</span></li>'
			+'<li class="ikey ikey28 li_zm " data-value="S"><span>S</span></li>'
			+'<li class="ikey ikey30 li_zm " data-value="T"><span>T</span></li>'
			+'<li class="ikey ikey31 li_zm " data-value="U"><span>U</span></li>'
			+'<li class="ikey ikey32 li_zm " data-value="V"><span>V</span></li>'
			+'<li class="ikey ikey33 li_zm " data-value="W"><span>W</span></li>'
			+'<li class="ikey ikey34 li_zm " data-value="X"><span>X</span></li>'
			+'<li class="ikey ikey35 li_zm " data-value="Y"><span>Y</span></li>'
			+'<li class="ikey ikey36 li_zm " data-value="Z"><span>Z</span></li>'
		+'</ul>'
		+'<div class="c_key cancel">←</div>'
		+'<div class="c_key confirm">OK</div>'
		+'<div class="c_key ikey-close">取消</div>';
	var wrap = document.createElement('div');
	wrap.className = 'fixed-keybord';
	wrap.id = 'fixed-keybord';
	wrap.innerHTML = _Str;
	document.body.appendChild(wrap);
	
	var drop = document.createElement('div');
	drop.className = 'fixed-keybord-drop';
	document.body.appendChild(drop);
}

// 显示
proto._show = function() {
	document.getElementById('fixed-keybord').style.display = "block";
	document.querySelector('.fixed-keybord-drop').style.display = "block";
}

// 隐藏
proto._hide = function(proindex) {
	var self = this;
	
	document.getElementById('fixed-keybord').style.display = "none";
	document.querySelector('.fixed-keybord-drop').style.display = "none";
}

// 打开
proto.open = function(callback) {
	var self = this;
	self._show();
	self.callback = callback || $.noop();
}
	
})(mui,window,document);