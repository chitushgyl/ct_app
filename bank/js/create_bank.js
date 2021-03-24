var indexData=new Vue({
	el:"#bankContent",
	data:{
		bankType:"Bank",
		checked:false,
		form:{
			self_id:'',
			type:'Bank',//新增类型
			bank_name:'',//请填写银行名称
			card_number:'',//请填写卡号
			card_holder:'',	//持卡人
			alipay_number:'',//支付宝账号
			alipay_name:'',//真实姓名
			default_flag:'N',//是否设为默认提现
		},
		canDo:false,
	},
	mounted() {
		let self=this;
		mui.plusReady(function(){
			var selfPage = plus.webview.currentWebview();
			self.form.self_id = selfPage.data.self_id;    //记录传来的id
			console.log(JSON.stringify(selfPage));
			console.log('传来的id：'+self.form.self_id);
			if(self.form.self_id){
				self.getOrigin(self.form.self_id);
			}
		})
	},
	methods:{
		
		//获取已配置数据
		getOrigin(id){
			let self=this;
			let data={
				self_id:id
			}
			request.PostInfo_new(request.createAccount,data,function(res){
				console.log('res的值是：'+JSON.stringify(res));
				let temp_data=res.data.info;
				// console.log(JSON.stringify('temp_data.type是：'+temp_data.type));
				self.bankType=temp_data.type;
				self.form.type=temp_data.type;
				if(temp_data.default_flag == 'Y'){
					self.checked=true;
				}else{
					self.checked=false;
				}
				if(temp_data.type == 'Bank'){
					self.form.bank_name=temp_data.bank_name;
					self.form.card_holder=temp_data.card_holder;
					self.form.card_number=temp_data.card_number;
				}
			})
		},
		
		
		
		//是否设置默认提现
		set(){
			let self=this;
			self.checked=!self.checked;
			if(self.checked){
				self.form.default_flag='Y';
			}else{
				self.form.default_flag='N';
			}
		},
		
		//输入验证
		onBlur(type,val){
			let self=this;
			console.log(val);
			switch(type){
				case'bank_name':
					if(val.length<2){
						mui.toast('银行名称有误！');
						return;
					}
				break;
				case'card_number':
					if(val.length<16){
						mui.toast('银行卡号有误！');
						return;
					}
				break;
				case'card_holder':
					if(val.length<2){
						mui.toast('持卡人姓名有误！');
						return;
					}
				break;
			}
		},
		
		//提交新增
		submit(){
			let self=this;
			let data=self.form;
			// console.log(JSON.stringify(data));
			if(data.bank_name == ''){
				mui.toast('请完整填写信息！');
				return ;
			}
			if(data.card_number == ''){
				mui.toast('请完整填写信息！');
				return ;
			}
			if(data.card_holder == ''){
				mui.toast('请完整填写信息！');
				return ;
			}
			
			request.PostInfo_new(request.accountAdd,data,function(res){
				console.log('res是：'+JSON.stringify(res));
				mui.toast(res.msg);
				// let wobj = plus.webview.getWebviewById("bank/bank.html");//注意 HBuilder 是  1.html 的 ID 你如果1.html 有ID  要替换掉HBuilder，
				// wobj.reload(true);
				setTimeout(()=>{
					mui.back();
				},1500)
			},function(res){
				
			})
			
		},
			
	}
})