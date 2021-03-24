

var indexData=new Vue({
	el:"#bankContent",
	data:{
		payList:[],
		page:1,
	},
	mounted() {
		this.getPages();
		mui.plusReady(function(){
			
		})
		
	},
	methods:{
		getPages(){
			let self=this;
			let data={
				page:self.page
			}
			request.PostInfo_new(request.accountPage,data,function(res){
				let temp_data=res.data.info;
				if(temp_data &&　temp_data.length>0){
					self.payList=temp_data;
				}
			})
		},
		
		//选择支付方式跳回提现页面
		backMoney(item){
			var self  = this;
			// 跳转到当前页面的页面（父页面）
			var wp = plus.webview.currentWebview().opener();
			 console.log(wp.id);
			if(wp.id=="./extract.html"){
				wp.evalJS('listenBack('+JSON.stringify(item)+')');
				
			}else{
				// clicked('../wallet/extract.html',{data:item})
			}
			mui.back();
		},
		
		//修改已有数据
		edit(id){
			console.log(id);
			let data={
				self_id:id
			}
			clicked('./create_bank.html',{data:data});
		},
		
		//跳转添加页		
		jump(){
			let data={
				self_id:null
			}
			clicked('./create_bank.html',{data:data})
		}
	}
})

