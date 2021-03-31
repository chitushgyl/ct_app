var indexData=new Vue({
	el:"#extractContent",
	data:{
		bankInfo:{
			self_id:'',
			group_name:'',
			bank_name:'中国建设银行',
			card_holder:'',
			card_number:'1221 1212 1231 122 1231',
			default_flag:'',
			money:'',//用户提现的金额
		},
		user_money:'',//用户余额
	},
	mounted:function(){
		let self=this;
		
		mui.plusReady(function(){
			var selfPage = plus.webview.currentWebview();
			console.log('selfPage.data的值是：'+JSON.stringify(selfPage.data));
			if(selfPage.data){
				/**
				 * 有值表示是通过clicked方法跳转页面过来的(即是从钱包导航栏山个银行卡过来的)，
				 * 这个时候，需要直接赋值，不用去调用接口加载默认银行卡
				 */
				self.bankInfo.self_id=selfPage.data.self_id;
				self.bankInfo.bank_name=selfPage.data.bank_name;
				self.bankInfo.card_holder=selfPage.data.card_holder;
				self.bankInfo.card_number=selfPage.data.card_number;
				self.bankInfo.default_flag=selfPage.data.default_flag;	
			}else{
				/**
				 * 没有页面参数过来，说明是从钱包提现按钮过来的，需要调用接口加载默认银行卡
				 */
				self.defaultBank();
			}
			
		});
		self.getData();
	},
	methods:{
		
		//获取页面数据
		getData(){
			let self=this;
			//获取用户余额
			request.PostInfo_new(request.user_owm,{},function(res){
				self.user_money=res.data.user_capital.money;
			},function(res){
				mui.toast(res.msg);
			});
		},
		
		//加载默认银行卡信息
		defaultBank(){
			let self=this;
			request.PostInfo_new(request.getAccount,{},function(res){
				console.log('getAccount的值是：'+JSON.stringify(res));
				let temp_data=res.data.info;
				if(temp_data &&　temp_data.length>0){
					self.bankInfo.self_id=temp_data[0].self_id;
					self.bankInfo.bank_name=temp_data[0].bank_name;
					self.bankInfo.card_number=temp_data[0].card_number;
					self.bankInfo.card_holder=temp_data[0].card_holder;
					self.bankInfo.default_flag=temp_data[0].default_flag;
				}
			},function(res){
				mui.toast(res.msg);
			})
		},
		
		//跳转选择银行卡页面
		jumpBank(){
			clicked('../bank/bank.html');
		},
		
		//全部提现
		setAll(){
			let self=this;
			var quxian_money=self.user_money;
			quxian_money=parseFloat(quxian_money.replace(/[^\d\.-]/g, ""))
			self.bankInfo.money=quxian_money;			
		},
		
		//确认提现
		submit(){
			let self=this;
			
			if(!self.bankInfo.self_id){
				mui.toast('请选择提现银行卡！');
				return false;
			}
			console.log(self.user_money);
			console.log(self.bankInfo.money);
			if(	parseFloat( self.user_money.replace(/[^\d\.-]/g, ""))<self.bankInfo.money){
				mui.toast('余额不足！');
				return false;
			}
			if(self.bankInfo.money==''){
				mui.toast('提现金额不能为空！');
				return false;
			}
			
			if(self.bankInfo.money<1){
				mui.toast('提现金额要大于1元！');
				return false;
			}

			request.PostInfo_new(request.withdraw_money,self.bankInfo,function(res){
				console.log('withdraw_money的值是：'+JSON.stringify(res));
				mui.toast(res.msg);
				setTimeout(()=>{
					// mui.back();
					clicked('./wallet.html')
				},1500)
			},function(res){
				mui.toast(res.msg);
			})
		}
		
	}
})

function listenBack(data) { //常用地址获得选中的返回值
	indexData.bankInfo.self_id=data.self_id;
	indexData.bankInfo.bank_name=data.bank_name;
	indexData.bankInfo.card_holder=data.card_holder;
	indexData.bankInfo.card_number=data.card_number;
	indexData.bankInfo.default_flag=data.default_flag;
};