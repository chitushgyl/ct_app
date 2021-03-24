;(function($,window,document){
	var Map = null;
	// 百度地图API功能
	var map = window.map = function(options){
		this.ele = options.ele || "map"; // 地图容器
		this.zoom = options.zoom || 11; // 初始化地图的缩放级别
		this.city = options.city || '上海'; // 初始化地图的城市名
		this.mapObject = null;
		console.log('options:'+JSON.stringify(options));
	}
	
	// 初始化地图
	map.prototype.init = function(){
		var self = this;
		Map = new BMap.Map(self.ele);
		Map.centerAndZoom(self.city, self.zoom);
	}
	// 地址解析
	map.prototype.geocodeSearch = function(add,city){
		var self = this;
		var myGeo = new BMap.Geocoder();
		myGeo.getPoint(add, function(point){
			console.log('point:'+JSON.stringify(point));
			console.log('add:'+JSON.stringify(add));
			if (point) {
				self.addMarker(point,new BMap.Label(add));
			}else{
				console.log("您选择地址没有解析到结果!");
			}
		}, city);
	
	}

	map.prototype.getLocation = function(point,callback){
		var pt = new BMap.Point(point.lng,point.lat);
		var geoc = new BMap.Geocoder();
		geoc.getLocation(pt, function(rs){
			var addComp = rs.addressComponents;
			callback(addComp);
			console.log(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
		});
	}
	// 添加marker
	map.prototype.addMarker = function(point,label){
		var self = this;
		var marker = new BMap.Marker(point);
		Map.addOverlay(marker);
		marker.setLabel(label);
	}
	// 驾车路线检索
	map.prototype.RouteSearch =  function(start,end){
		var self = this;
		var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE,BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
		var route = routePolicy[1]; // 此枚举类型表示驾车方案的策略配置。0 最少时间 1 最短距离 2 少高速
//		Map.clearOverlays(); // 情况地图覆盖物
		var driving = new BMap.DrivingRoute(Map,{renderOptions:{map: Map, autoViewport: true},policy: route});
		driving.search(start,end);
	}
	//途经点
	map.prototype.RouteManySearch = function(start,end,way){
		var self = this;
		if(way == ''){
		var	a = null;
		}else{
		  var a = way.split(",");
		}
		console.log(start);
		console.log(end);
		console.log(a);
		var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE,BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
		var route = routePolicy[1]; // 此枚举类型表示驾车方案的策略配置。0 最少时间 1 最短距离 2 少高速
		Map.clearOverlays(); // 情况地图覆盖物
		var driving = new BMap.DrivingRoute(Map,{renderOptions:{map: Map, autoViewport: true}});
		driving.search(start,end,{waypoints:a});
		
		
	}
	// 根据浏览器定位
	map.prototype.geolocation = function(fun){
		var self = this;
		self.callback = fun;
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				var mk = new BMap.Marker(r.point);
//				Map.addOverlay(mk);
				Map.panTo(r.point);
				self.callback(r.point);
			}
			else {
				alert('failed'+this.getStatus());
			}        
		},{enableHighAccuracy: true})	
	}
	// 设置雷达动画
	map.prototype.adimate = function(point){
		var self = this;
		var circle = new BMap.Circle(point,0,{
			strokeColor: "#1A8AFF", //圆形边线颜色
			fillColor: '#1A8AFF', // 圆形填充颜色。当参数为空时，圆形将没有填充效果
			strokeWeight: 1, // 圆形边线的宽度，以像素为单位
			strokeOpacity: 0.5, // 圆形边线透明度，取值范围0 - 1
			fillOpacity: 1, // 圆形填充的透明度，取值范围0 - 1
			strokeStyle: 'solid', // 圆形边线的样式，solid或dashed
			enableMassClear: true, // 是否在调用map.clearOverlays清除此覆盖物，默认为true
			enableEditing: false, // 是否启用线编辑，默认为false
			enableClicking: false // 是否响应点击事件，默认为true
		});
		Map.addOverlay(circle);
		
//		setInterval(function(){
//			var radius = circle.getRadius();
//			var StrokeOpacity = circle.getStrokeOpacity();
//			console.log(StrokeOpacity);
//			if(radius<100){
////				circle.setStrokeOpacity(StrokeOpacity-0.01);
//				circle.setRadius(radius+0.1);
//			}else{
////				circle.setStrokeOpacity(1);
//				circle.setRadius(0);
//			}
//			
//		},1);
	}
})(mui,window,document);
