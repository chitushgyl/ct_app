/*
 * @description: 获取设备的网络状态信息 
 * @type 0 网络状态未知          CONNECTION_UNKNOW
 * @type 1 未连接网络              CONNECTION_NONE
 * @type 2 有线网络                  CONNECTION_ETHERNET
 * @type 3 无线WIFI网络       CONNECTION_WIFI
 * @type 4 蜂窝移动2G网络     CONNECTION_CELL2G
 * @type 5 蜂窝移动3G网络      CONNECTION_CELL3G
 * @type 6 蜂窝移动4G网络      CONNECTION_CELL4G
 * */
 function getNetworkinfo() {
 	var n = plus.networkinfo.getCurrentType();
 	if(n == 0 || n == 4){
 		mui.alert('网络异常','提示','确定',function (e) {
 		   e.index
 		},'div')
 	}else if(n == 1){
 		mui.alert('未连接网络','提示','确定',function (e) {
 		   e.index
 		},'div')
 	}
 }
 
document.addEventListener("plusready",getNetworkinfo,false);


