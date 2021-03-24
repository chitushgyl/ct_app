/**
 * ====================================================
 * description: 车牌号
 * ====================================================
 * */

;(function(window,document,layer,mui){
	/**
	 * [provinces description] 省
	 * @type {Array} 省简称
	 */
	var provinces = new Array("京","沪","浙","苏","粤","鲁","晋","冀",
	            "豫","川","渝","辽","吉","黑","皖","鄂",
	            "津","贵","云","桂","琼","青","新","藏",
	            "蒙","宁","甘","陕","闽","赣","湘");
	/**
	 * [keyNums description] 键盘关键字
	 * @type {Array}
	 */
	var keyNums = new Array("0","1","2","3","4","5","6","7","8","9",
	            "Q","W","E","R","T","Y","U","I","O","P",
	            "A","S","D","F","G","H","J","K","L",
	            "OK","Z","X","C","V","B","N","M","Del");

	var carkeyboard = window.carkeyboard = function(options){
		this.provinces = options.provinces || provinces; // 车牌号第一位省简称数据
		this.keyNums = options.keyNums || keyNums; // 车牌号后六位显示数据
		this.carNum = options.carNum; // 车牌号
	}

	var carNum = [];
	/**
	 * [showProvince description] 显示省简称的键盘
	 * @return {[type]} [description]
	 */
	var showProvince = function(){
		document.getElementById('pro').innerHTML = '';
		var ss="";
		for(var i=0;i<provinces.length;i++){
			ss=ss+addKeyProvince(i);
		};
		document.getElementById('pro').innerHTML = "<ul class='clearfix ul_pro'>"+ss+"<li class='li_close' id='li_close'><span>关闭</span></li><li class='li_clean'><span>清空</span></li></ul>";
	}
	/**
	 * [addKeyProvince description] 添加省简称键值
	 * @param {Number} provinceIds [description] 省简称数组索引
	 */
	var addKeyProvince = function(provinceIds) {
		var proName = provinces[provinceIds];
		var addHtml = '<li class="keyword_1" data-text="'+proName+'">';
            addHtml += '<span>'+proName+'</span>';
            addHtml += '</li>';
            return addHtml;
	};
	/**
	 * [showKeybord description] 显示二级键盘
	 * @param  {[type]} argument [description]
	 */
	var showKeybord = function() {
		document.getElementById('pro').innerHTML = '';
		var sss="";
		for(var i=0;i<keyNums.length;i++){
			sss=sss+'<li class="ikey ikey'+i+' '+(i>9?"li_zm":"li_num")+' '+(i>28?"li_w":"")+'" data-text="'+i+'"><span class="keyword_2" data-text="'+keyNums[i]+'" data-index="'+i+'">'+keyNums[i]+'</span></li>'
		} 
		document.getElementById('pro').innerHTML = "<ul class='clearfix ul_keybord'>"+sss+"</ul>";
	}
	/**
	 * [chooseProvince description] 关闭省简称键盘
	 * @param  {document} element [description] 被点击的dom节点
	 */
	var chooseProvince = function(proName) {
	   	showKeybord();
	}
	

	/**
	 * [choosekey description] 关闭键盘
	 * @param  {[type]} argument [description]
	 * @param  {[type]} argument [description]
	 * @return {[type]} [description]
	 */
	var choosekey = function(jj,proName){
		if(jj==29){
			var str = ''
			for (var i=0; i<carNum.length; i++) {
				str = str+ carNum[i]; 
			}
			document.getElementById('carNum').innerText = str;
			layer.closeAll();
		}else if(jj==37){ // 删除
			carNum.pop();
			// carNum = carNum.slice(carNum.length-2, 1);
			var str = '';
			for (var i=0; i<carNum.length; i++) {
				str = str+ carNum[i]; 
			}
			document.getElementById('carNum').innerText = str;
			if(carNum.length==0){
				showProvince();
			}
		}else{
			if(carNum.length > 7){
				return
			}
			carNum.push(proName);
			var str = ''
			for (var i=0; i<carNum.length; i++) {
				str = str+ carNum[i]; 
			}
			document.getElementById('carNum').innerText = str;
			
		}
	}
	var closePro = function(){
          layer.closeAll();
   	}
	var  openlayerPro = function(argument) {
		window.cartype = layer.open({
			type: 1
			,content: '<div id="pro"></div>'
			,anim: 'up'
			,shade :false 
			,style: 'position:fixed; bottom:0; left:0; width: 100%; height: auto; padding:0; border:none;'
		});
	 	showProvince();
	}
	mui("body").on('tap', '.keyword_1', function(event) {
		var proName = this.getAttribute('data-text');
		carNum.push(proName);
		var str = ''
		for (var i=0; i<carNum.length; i++) {
			str = str+ carNum[i]; 
		}
		document.getElementById('carNum').innerText = str;
		chooseProvince(proName);
		/* Act on the event */
	});

	mui("body").on('tap', '.keyword_2', function(event) {
		var index = this.getAttribute('data-index');
		var proName = this.getAttribute('data-text');
		choosekey(index,proName);
		/* Act on the event */
	});
	
	mui("body").on('tap', '.li_close', function(event) {
		closePro();
		/* Act on the event */
	});
	
	mui("body").on('tap', '.li_clean', function(event) {
		document.getElementById('carNum').innerText = '';
		carNum = [];
		/* Act on the event */
	});
	
// 	document.getElementById('card').addEventListener('tap',function(){
// 		openlayerPro();
// 		console.log('ok');
// 	});
// })(window,document,layer,mui);


