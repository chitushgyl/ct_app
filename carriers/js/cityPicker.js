// mui.init();
// 			mui.ready(function() {
// 				/**
// 				 * 获取对象属性的值
// 				 * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
// 				 * @param {Object} obj 对象
// 				 * @param {String} param 属性名
// 				 */
// 				var _getParam = function(obj, param) {
// 					return obj[param] || '';
// 				};
 
// 				// 三级联动
// 				var cityPicker3 = new mui.PopPicker({
// 					layer: 3
// 				});
// 				cityPicker3.setData(cityData3);
// 				var showCityPickerButton = document.getElementById('showCityPicker');
// 				showCityPickerButton.addEventListener('tap', function(event) {
// 					cityPicker3.show(function(items) {
// 						showCityPickerButton.innerText = "你选择的城市是:" + _getParam(items[0], 'text') + " " + _getParam(items[1],
// 							'text') + " " + _getParam(items[2], 'text');
 
// 						//返回 false 可以阻止选择框的关闭
// 						//return false;
// 					});
// 				}, false);
// 			});
			
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