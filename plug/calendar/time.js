$.extend({
	dateToolInit:function(opt){
		this.monthMun=2;
		$.getIdate();
	},
	getIdate:function(){
		var idate=$('<div id="component"><div>');
		var c = '<div id="component"><div>';
		$('body').append(c);
		var node = $.getDatesStr();
		// alert(node);

		$('#component').append(node);
		// idate.append($.getDatesStr());
		// var node = $('#component').html();
		// console.log($('#component').html());
		// alert($('#component').html());
	},
	getHeaderStr:function(){
		return str='<div data-reactroot="">'+
		'<div class="animate-init">'+
		'<div class="calendar-page ">'+
		'<div class="m-calendar ">'+
		'<header class="page-header ">'+
		'<div class="left-action ">'+
		'<div class="left-btn" onclick="$.backpage()" style="display:flex;justify-content: center;"><img src="../images/user/topbackarr1.png" style="width: 20px;height:20px;"></div>'+
		'</div>'+
		'<div class="page-title">选择发车时间</div>'+
		'</header>'+
		'<div class="calendar-content" id="calendar-content">';
},
getDatesStr:function(){
	var str=$.getHeaderStr();
	for(var i=0;i<this.monthMun;i++){
		str+='<div class="calender-month"><div class="calendar-month-title" id="month-'+$.getNewmonth(i).split('-')[0]+'-'+$.getNewmonth(i).split('-')[1]+'">'+
		$.getNewmonth(i).split('-')[0]+'年'+parseInt($.getNewmonth(i).split('-')[1])+'月'+'</div>';
		str+=$.getWeekStr();
		str+=$.getCalendarday($.getNewmonth(i));
	}
	return str+$.getFooterStr();
},
getWeekStr:function(){
	return str='<ul class="calendar-date-bar">'+
	'<li class="dates-item">日</li>'+
	'<li class="dates-item">一</li>'+
	'<li class="dates-item">二</li>'+
	'<li class="dates-item">三</li>'+
	'<li class="dates-item">四</li>'+
	'<li class="dates-item">五</li>'+
	'<li class="dates-item">六</li>'+
	'</ul>';
},
getFooterStr:function(){
	return str='</div>'+
	'</div>'+
	'</div>'+
	'</div>'+
	'</div>';
},
getNewmonth:function(num){
	var myDate=new Date();
	var year=myDate.getFullYear();
	var month=num+myDate.getMonth()+1;
	var monthStr=myDate.getMonth()+1;
	if(month>12){
		year++;
	}
	if(month===12){
		monthStr=12;
	}else{
		monthStr=month%12;
	}
	monthStr=(monthStr<10?"0"+monthStr:monthStr);
	return year+'-'+monthStr;
},
getWeek:function(opt){
	var week=new Date(opt.replace("-","/").replace("-","/")).getDay();
	return week;
},
getDaysInOneMonth:function(opt){
	var d=new Date(parseInt(opt.split('-')[0]),parseInt(opt.split('-')[1]),0);
	return d.getDate();
},
getCalendarday:function(opt){
	var str='';
	var week=$.getWeek(opt+'-'+'1') - 0;
	var daynum=$.getDaysInOneMonth(opt) - 0;
	var count=0;
	var day=0;
	for(var i=0;i<(daynum+week);i++){
		if(i%7===0){
			str+='<div class="calendar-week">';
		}
		if(i<week){
			str+='<div class="calendar-day" data-date=""></div>';
			count++;
		}else{
			day=i-week+1;
			day=(day<10?"0"+day:day);
			if($.isDay(opt+'-'+day)===1){
				str+='<div class="calendar-day trust-day" data-date="'+opt+'-'+day+'" data-type="day" onclick="$.selectday(this)"><span class="day">'+parseInt(day)+'</span></div>'
			}else if($.isDay(opt+'-'+day)===0){
				str+='<div class="calendar-day disable-day trust-day" data-date="'+opt+'-'+day+'" data-type="disableDay"><span class="day">'+parseInt(day)+'</span></div>';
			}else{
				str+='<div style="color:#0088f4;" class="calendar-day trust-day" data-date="'+opt+'-'+day+'" data-type="day" onclick="$.selectday(this)"><span class="day" style=";">今天</span></div>'
			}

			count++;
			if(i===(daynum+week-1)&&count<7){
				for(var j=0;j<(7-count);j++){
					str+='<div class="calendar-day" data-date=""></div>';
				}
				str+='</div>';
			}
		}
		if(count%7===0){
			str+='</div>';
			count=0;
		}
	}
	str+='</div>';
	return str;
},
getNewday:function(){
	var myDate=new Date();
	var month=1;
	var day=1;
	month=myDate.getMonth()+1;
	month=(month<10?"0"+month:month);
	day=myDate.getDate();
	day=(day<10?"0"+day:day);
	return myDate.getFullYear()+'-'+month+'-'+day;
},
isDay:function(opt){
	var stdt=new Date(opt.replace("-","/").replace("-","/"));
	var etdt=new Date($.getNewday().replace("-","/").replace("-","/"));
	if($.getNewday()===opt){
		return 2;
	}else{
		if(stdt>etdt){
			return 1;
		}else{
			return 0;
		}
	}
},
selectday:function(_this){
	if(iDateTriptype==='1'){
		$(".trust-day").removeClass('select-single-day');
		$(_this).addClass('select-single-day');
		$('.animate-init').removeClass('animate-start');
		var date = $(_this).attr('data-date');
		startDate.val(date);
		// vm2_bulk.picktime = date;
		vm2_bulk.select_date = date;
		vm2_bulk.set_date(new Date(date));
		if (vm2_bulk.switch) {
			vm.getTransportData(1);
		}
	}else{
		if(startDate.val()===''){
			$(".trust-day").removeClass('select-single-day');
			$(_this).addClass('select-go-day');
			startDate.val($(_this).attr('data-date'));
		}else{
			if($.backselectday($(_this).attr('data-date'))){
				$(".trust-day").removeClass('select-back-day');
				$(_this).addClass('select-back-day');
				// endtDate.val($(_this).attr('data-date'));
				$('.animate-init').removeClass('animate-start');
			}else{
				$(".trust-day").removeClass('select-go-day');
				$(_this).addClass('select-go-day');
				startDate.val($(_this).attr('data-date'));
				$.compareDate();
			}
		}
	}
},
backselectday:function(opt){
	var stdt=new Date(startDate.val().replace("-","/").replace("-","/"));
	var middlet=new Date(opt.replace("-","/").replace("-","/"));
	if(stdt>middlet){
		return false;
	}else{
		return true;
	}
},
compareDate:function(){
	$(".trust-day").removeClass('select-go-day');
	$(".trust-day").removeClass('during-day');
	$(".trust-day").removeClass('select-back-day');
	$(".trust-day").removeClass('select-single-day');
	var stdt=new Date(startDate.val().replace("-","/").replace("-","/"));
	// var etdt=new Date(endtDate.val().replace("-","/"))
	$(".trust-day").each(function(){
		var middlet=new Date($(this).attr('data-date').replace("-","/").replace("-","/"))
		if($(this).attr('data-date')===startDate.val()){
			if(iDateTriptype==='1'){
				$(this).addClass('select-single-day');
			}else{
				$(this).addClass('select-go-day');
			}
		}
		// else if($(this).attr('data-date')===endtDate.val()){
		// 	$(this).addClass('select-back-day');
		// }
		// else if(middlet>stdt&&etdt>middlet){
		// 	$(this).addClass('during-day');
		// }
	});
},
backpage:function(){
	$('.animate-init').removeClass('animate-start');
}

});
// 选择一个
var iDateTriptype='1';
var endtDate=$('#endtDate');
var startDate=$('#startDate');
$('.Trip_type').on('click',function(){
	iDateTriptype=$(this).attr('datatype');
	$('.Trip_type').css({'color':'#888'});
	$(this).css({'color':'#4373e8'});
	// $('#endtDate').val('');
});
startDate.on('click',function(){
	$('.animate-init').addClass('animate-start');$.compareDate();
});
endtDate.on('click',function(){
	if(iDateTriptype==='1'){
		return;
	}
	$.compareDate();
	$('.animate-init').addClass('animate-start');
});
$.dateToolInit();