/* *
 * ==========================================
 * protocity.js 
 * ==========================================
 * Auther: 李渊
 * Notes: protocity 用于从选择城市 展示方式为从底部弹出 一级是省，点击省出现市，点击市关闭遮罩层，返回选择的城市的id和名称
 *        此插件适用与移动端 依赖 mui.js 和  layer.js 
 */
;(function($,window,document){
	
var selectCity = window.selectCity = function(cityData,type,hotCity) {
	this.cityData = cityData || []; // 城市数据
	this.type = type || 3;	// 显示的层级 1 只显示省 2 省市 3 省市区
	this.hotCity = hotCity || [{'value':'45054','text':'上海市'},{'value':'291','text':'深圳市'}];	// 显示的层级 1 只显示省 2 省市 3 省市区
	this._init();
};

var proto = selectCity.prototype;

// 初始化
proto._init = function() {
	var self = this;
	var type = self.type;
	
	self._createDom();
	
	// 点击关闭
	$('#selectCity').on('tap','.selectCity-close',function(){ 
	  	self.callback();
	  	self.close();
	});
	// 点击不限
	$('#selectCity').on('tap','.no-item',function(){ 
	  	self.callback();
	  	self.close();
	});
	// 点击热门
	$('#selectCity').on('tap','.hot-item',function(){ 
	  	var value = this.getAttribute('data-value');
	  	var name = this.innerText;
  		var data = {
  			pro_value: '',
  			pro_name: '',
	  		city_value : value,
	  		city_name: name,
	  		area_value : '',
	  		area_name : ''
  		}
	  	self.callback(data);
	  	self.close();
	});
	// 点击省
	$('#selectCity').on('tap','.pro-item',function(){ 
	  	self.pro_index = this.getAttribute('data-index');
	  	self.pro_value = this.getAttribute('data-value');
	  	self.pro_name = this.innerText;
	  	if(type == 1){
	  		var data = {
	  			pro_value: self.pro_value,
	  			pro_name: self.pro_name,
	  		}
	  		self.callback(data);
	  		self.close();
	  		return false;
	  	}
	  	
	  	self._showCity(self.pro_index);
	});
	// 点击城市
	$('#selectCity').on('tap','.city-item',function(){
	  	self.city_index = this.getAttribute('data-index');
	  	self.city_value = this.getAttribute('data-value');
	  	self.city_name = this.innerText;
	  	if(type == 2){
  			var data = {
  				pro_value: self.pro_value,
	  			pro_name: self.pro_name,
		  		city_value : self.city_value,
		  		city_name: self.city_name
		  	}
		  	self.callback(data);
		  	self.close();
	  		return false;
	  	}
	  	
	  	self._showArea(self.pro_index,self.city_index);
	});
	// 点击区
	$('#selectCity').on('tap','.area-item',function(){
	  	self.area_index = this.getAttribute('data-index');
	  	self.area_value = this.getAttribute('data-value');
	  	self.area_name = this.innerText;
	
		var data = {
			pro_value: self.pro_value,
  			pro_name: self.pro_name,
	  		city_value : self.city_value,
	  		city_name: self.city_name,
	  		area_value : self.area_value,
	  		area_name : self.area_name
	  	}
		
	  	self.callback(data);
	  	self.close();
	});
	// 点击全市
	$('#selectCity').on('tap','.allcity',function(){
	
		var data = {
			pro_value: self.pro_value,
  			pro_name: self.pro_name,
	  		city_value : self.city_value,
	  		city_name: self.city_name
	  	}
		
	  	self.callback(data);
	  	self.close();
	});
}

// 创建Dom
proto._createDom = function() {
	var self = this;
	var wrap = document.createElement('div');
	wrap.className = 'selectCity';
	wrap.id = 'selectCity';
	
	//关闭按钮
	var close_btn = document.createElement('div');
	close_btn.className = 'close_btn';
	close_btn.innerHTML = '<span class="mui-icon mui-icon-close selectCity-close"></span>';
	
	wrap.innerHTML = self._createHot()+self._createBody();
	wrap.appendChild(close_btn);
	
	var layer = document.createElement('div');
	layer.className = 'selectCity-backdrop';
	layer.id = 'selectCity-backdrop';
	document.body.appendChild(wrap);
	document.body.appendChild(layer);
}

// 创建热门
proto._createHot = function() {
	var self = this;
	var hotcity = self.hotCity;
	var _str = '<li class="selectCity-item no-item" data-value = ""> <span>不限</span></li>';
	for (var i = 0; i < hotcity.length; i++) {
		_str += '<li class="selectCity-item hot-item" data-value = "'+hotcity[i].value+'"> <span>'+hotcity[i].text+'</span></li>';
	}
	
	var hotStr = '<div class="selectCity-hot">'
				+'<div class="selectCity-hot-head selectCity-header">'
					+'<span class="selectCity-title">热门城市</span>'
				+'</div>'
				+'<ul class="selectCity-list">'+ _str+'</ul>'
				+'</div>';
	return hotStr;
}

// 创建body
proto._createBody = function() {
	var str = '<div class="selectCity-body">'
				+'<div class="selectCity-body-head selectCity-header">'
					+'<span class="selectCity-title">选择城市</span>'
				+'</div>'
				+'<ul class="selectCity-list" id="cityDate">'
				+'</ul>'
			+'</div>';
	return str;
}

// 显示省
proto._showPro = function() {
	var self = this;
	var cityData = self.cityData;
	var _str = '';
	for (var i = 0; i < cityData.length; i++) {
		_str += '<li class="selectCity-item pro-item" data-index="'+i+'" data-value = "'+cityData[i].value+'"> <span>'+cityData[i].text+'</span></li>';
	}
	document.getElementById('cityDate').innerHTML = _str;
}

// 显示市
proto._showCity = function(proindex) {
	var self = this;
	var Data = self.cityData[proindex].children;
	if(!Data){
		self.close();
		return false;
	}
	var _str = '';
	for(var i = 0; i<Data.length; i++){
		_str += '<li class="selectCity-item city-item" data-index="'+i+'" data-value="'+Data[i].value+'"> <span>'+Data[i].text+'</span></li>';
	}
	document.getElementById('cityDate').innerHTML = _str;
}

// 显示区
proto._showArea = function(proindex,cityindex) {
	var self = this;
	var Data = self.cityData[proindex].children[cityindex].children;
	if(!Data){
		self.close();
		return false;
	}
	var _str = '<li class="selectCity-item allcity"> <span>全市</span></li>';
	for(var i = 0; i<Data.length; i++){
		_str += '<li class="selectCity-item area-item" data-index="'+i+'" data-value="'+Data[i].value+'"> <span>'+Data[i].text+'</span></li>';
	}
	document.getElementById('cityDate').innerHTML = _str;
}

//修改当前地址库
proto.setCityData = function(citydata){
	var self = this;
	self.cityData = citydata;
}
// 打开
proto.open = function(callback) {
	var self = this;
	self._showPro();
	document.getElementById('selectCity').style.display = 'block';
	document.getElementById('selectCity-backdrop').classList.add('active');
	self.callback = callback || $.noop();
}

// 关闭
proto.close = function() {
	document.getElementById('selectCity').style.display = 'none';
	document.getElementById('selectCity-backdrop').classList.remove('active');
}
	
})(mui,window,document);