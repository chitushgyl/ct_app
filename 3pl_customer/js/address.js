/* 二级三级混合的地址选择器------------零担
*  不包括台湾、海南和三沙市以及两个特别行政区
* 零担中parval和整车不一样，地级市的parval是自身的cityval
*  2020-02-06
*/ 
	var data={
		type:'1'
	};
	
	var proAllData=[];
	var cityAllData =[];
	request.PostInfo_new(request.get_city,data,function(res){
		
		var list = res.data.info;
					for (var i in list) {
						// {"parent":"安徽省","provval":"12","city":"合肥市","py":"hefeishi","parval":"186"},
						if (list[i].level == 2) {
							var one = {
								parent:'',
								provval:list[i].parent_id,
								city:list[i].name,
								py:'',
								parval:list[i].id								
							};
							cityAllData.push(one);
						}
						if (list[i].level == 1) {
							var one = {
								pro:list[i].name,
								id:list[i].id
							};
							proAllData.push(one);
						}
						
						
					}
					//console.log(JSON.stringify(proAllData));
		
	},function(res){

	});	
	