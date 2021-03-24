/**
 * ---------------------
 * @decription: 解决安卓软键盘弹出时底部元素上浮的问题
 * @Notes: 逆向固定
 * bottom值会使元素上浮，但是我们又希望元素固定在底部。
 * 此时，可以使用逆向的方式，也就是设置top值让元素固定在顶部。
 * ---------------------
 */
(function($,window,document){
	 // plus.webview.currentWebview().setStyle({
  //       softinputMode: "adjustResize"  // 弹出软键盘时自动改变webview的高度
  //   });
	var bottomEl = document.querySelector('.android-fixed');
	
	var height = bottomEl.clientHeight;
	
	var bottom = bottomEl.getAttribute('data-default');
	
	if(!bottom){
		bottom = 0;
	}
	// 可见区域高度减去元素的高度
	bottomEl.style.top = document.documentElement.clientHeight - bottom - height + 'px';
	
	
})(mui,window,document);

   
