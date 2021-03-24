/* *
 * ==========================================
 * protocity.js 
 * ==========================================
 * Auther: 李渊
 * Notes: protocity 用于从选择城市 展示方式为从底部弹出 一级是省，点击省出现市，点击市关闭遮罩层，返回选择的城市的id和名称
 *        此插件适用与移动端 依赖 mui.js 和  layer.js 
 */
;(function($,window,document){
	
var selectCarSize = window.selectCarSize = function(carData) {
	this.carData = carData || []; // 城市数据
	this._init();
};

var proto = selectCarSize.prototype;

// 初始化
proto._init = function() {
	var self = this;
	
	self._createDom();
	
	// 点击关闭
	$('#selectCarSize').on('tap','.selectCity-close',function(){ 
	  	self.callback();
	  	self.close();
	});
	// 点击不限
	$('#selectCarSize').on('tap','.no-item',function(){ 
	  	self.callback();
	  	self.close();
	});
	// 点击车型
	$('#selectCarSize').on('tap','.pro-item',function(){ 
	  	self.car_index = this.getAttribute('data-index');
	  	self.car_value = this.getAttribute('data-value');
	  	self.car_name = this.innerText;
	  	
	  	if(self.car_value == 6 || self.car_value == 7){
	  		
	  		self.car_name += '冷藏半挂';
	  		
	  	}else if( self.car_value != 9 && self.car_value != 15 ){
	  		
	  		self.car_name += '冷藏厢车';
	  		
	  	}
	  	
  		var data = {
  			value: self.car_value,
  			name: self.car_name,
  			index: self.car_index
  		}
  		self.callback(data);
  		self.close();
  		return false;
	});
}

// 创建Dom
proto._createDom = function() {
	var self = this;
	var wrap = document.createElement('div');
	wrap.className = 'selectCity';
	wrap.id = 'selectCarSize';
	
	//关闭按钮
	var close_btn = document.createElement('div');
	close_btn.className = 'close_btn';
	close_btn.innerHTML = '<span class="mui-icon mui-icon-close selectCity-close"></span>';
	
	wrap.innerHTML = self._createBody();
	wrap.appendChild(close_btn);
	
	var layer = document.createElement('div');
	layer.className = 'selectCity-backdrop';
	layer.id = 'selectCarSize-backdrop';
	document.body.appendChild(wrap);
	document.body.appendChild(layer);
}

// 创建body
proto._createBody = function() {
	var str = '<div class="selectCity-body">'
				+'<div class="selectCity-body-head selectCity-header">'
					+'<span class="selectCity-title">冷链车型</span>'
				+'</div>'
				+'<ul class="selectCity-list" id="carDate">'
				+'</ul>'
			+'</div>';
	return str;
}

// 车型
proto._showPro = function() {
	var self = this;
	var carData = self.carData;
	var _str = '';
	for (var i = 0; i < carData.length; i++) {
		_str += '<li class="selectCity-item pro-item" data-index="'+i+'" data-value = "'+carData[i].value+'"> <span>'+carData[i].text+'</span></li>';
	}
	document.getElementById('carDate').innerHTML = _str;
}

//更换数据、选择器级别
proto.setData = function(data,type){
	var self = this;
	self.carData = data;
	if(type){
		self.type = type;
	}
}

// 打开
proto.open = function(callback) {
	var self = this;
	self._showPro();
	document.getElementById('selectCarSize').style.display = 'block';
	document.getElementById('selectCarSize-backdrop').classList.add('active');
	self.callback = callback || $.noop();
}

// 关闭
proto.close = function() {
	document.getElementById('selectCarSize').style.display = 'none';
	document.getElementById('selectCarSize-backdrop').classList.remove('active');
}
	
})(mui,window,document);