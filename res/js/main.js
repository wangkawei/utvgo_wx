//基础配置
//http://120.31.66.15:8080/
var hostName='http://app.utvgo.com';//http://120.31.66.15';//http://app.utvgo.com:8099/utvgoClient/interfaces/main_index.action
var hostPort=8099;
var serverAddress=hostName+':'+hostPort;

var account=localStorage.getItem('account');
var accountObj=JSON.parse(account);
var userId=''; 
if(!!account&&!!accountObj){
	userId=accountObj.userId||'1517';
}
//userId=1517;//用户帐号 用于测试

function checkWxBind(openid,fn,noBind){
	if(!!!openid){
		alert('无openid');
		return;
	}
	$.ajax({
		type: 'GET',
		url: serverAddress+'/utvgoClient/interfaces/smartGateway_wxBindingCheck.action',
		// data to be added to query string:
		data: {
			openid:openid
		},
		// type of data we are expecting in return:
		dataType: 'json',
		success: function(data){
			if(data.status==0){
				//已绑定
				localStorage.setItem('account',JSON.stringify(data.extra));
				!!fn&&fn();
			}else{
				//未绑定
				//alert(data.result);
				!!noBind&&noBind();
			}
		},
		error: function(xhr, type){

		}
	});
}


function bingWx(openid,keyNo,catvId,branchNo,userName,fn,fail){
	if(!!!openid){
		alert('无openid');
		return;
	}
	if(!!!keyNo||!!!catvId){
		alert('无账号');
		return;
	}
	$.ajax({
		type: 'GET',
		url: serverAddress+'/utvgoClient/interfaces/smartGateway_wxBindingKeyNo.action',
		// data to be added to query string:
		data: {
			openid:openid,
			catvId:catvId,
			keyNo:keyNo,
			branchNo:branchNo,
			userName:userName
		},
		// type of data we are expecting in return:
		dataType: 'json',
		success: function(data){
			if(data.status==0){
				//绑定成功
				localStorage.setItem('account',JSON.stringify(data.extra));
				!!fn&&fn();
			}else{
				!!fail&&fail();
			}
		},
		error: function(xhr, type){

		}
	});
}


/**
得到高宽，补充插件,修复当display为none是el.width()为0的bug
usage:
el.getW();//33
el.getH();//332
el.getSize();//{width:33,height:332}
**/
;(function($){
  $.extend($.fn, {
    getW: function(){
      // `this` refers to the current Zepto collection.
      // When possible, return the Zepto collection to allow chaining.
      //position: "absolute", visibility: "hidden", display: "block" 
      var pos=this.css('position')
      	  ,vis=this.css('visibility')
      	  ,dis=this.css('display')
      	  ,w=0
      ;
      this.css({
      	"position": "absolute", "visibility": "hidden", "display": "block"
      });
      w=this.width();

      this.css({
      	"position": pos, "visibility": vis, "display": dis
      });
      return w;
    }
    ,getH: function(){
    	var pos=this.css('position')
      	  ,vis=this.css('visibility')
      	  ,dis=this.css('display')
      	  ,h=0
      ;
      this.css({
      	"position": "absolute", "visibility": "hidden", "display": "block"
      });
      h=this.height();

      this.css({
      	"position": pos, "visibility": vis, "display": dis
      });
      return h;
    }
    ,getSize: function(){
    	var pos=this.css('position')
      	  ,vis=this.css('visibility')
      	  ,dis=this.css('display')
      	  ,w=0
      	  ,h=0
      ;
      this.css({
      	"position": "absolute", "visibility": "hidden", "display": "block"
      });
      w=this.width();
      h=this.height();
      this.css({
      	"position": pos, "visibility": vis, "display": dis
      });
      return {
      	width:w
      	,height:h
      };
    }
  })
})(Zepto);



function getUrlPara(href,rem){
	var url = href||window.location.href //获取url
		,request = {}
		,str=''
		,remStr = rem || '?' 
		,index = url.indexOf(remStr)
	;
   if (index != -1) {
   	  url=url.slice(index);
      str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         request[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]);
      }
   }
   return request;
}


function isWeiXin(){ 
	var ua = window.navigator.userAgent.toLowerCase(); 
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		return true; 
	}else{ 
		return false; 
	} 
} 

function showLoading(){
	$('.loadingTip').show();
}
function hideLoading(){
	$('.loadingTip').hide();
}



/**主体布局和侧边结构 js**/
;(function(){
	$('#menuBt').tap(function(e){
		if($('#sideMenu').hasClass('sideMenu-on')){
			$('#sideMenu').removeClass('sideMenu-on');
			$('#main').removeClass('main-on');
		}else{
			$('#sideMenu').addClass('sideMenu-on');
			$('#main').addClass('main-on');
		}
	});
	$('#meBt').tap(function(e){
		//alert('about me');
		location.href='usercenter.html';
	});
	$('#topNavBackBt').tap(function(e){
		window.history.back();
	});

	$('#topNavSearchBt').tap(function(e){
		//alert('search');
    if(parseInt(channelId,10)==2||parseInt(channelId,10)==3){
      
    }else{
      channelId=0;
    }
    location.href='./site_search.html?channelId='+(channelId||0);
	});

	$('#main').on('touchstart',function(e){
		if($('#sideMenu').hasClass('sideMenu-on')&&e.target.id!='menuBt'){
			$('#sideMenu').removeClass('sideMenu-on');
			$('#main').removeClass('main-on');
			e.stopPropagation();
			e.preventDefault();
			e.stopImmediatePropagation();
		}
	});

	//侧边搜索
	$('#searchInput').tap(function(e){
		//alert('input');
    
    location.href='./site_search.html?channelId=0';
	});

})();



/**detail tab**/
function detailTabInitShow(){

	$('.detailTabItem').on('tap',function(e){
		var i=$(this).index();
		//console.log(i);
		$('.detailTabItem.on').removeClass('on');
		$(this).addClass('on');
		$('.detailTabItemContent.on').removeClass('on');
		$('.detailTabItemContent').eq(i).addClass('on');
	});

	$('.detailTabItem.on').removeClass('on');
	$('.detailTabItem').eq(0).addClass('on');
	$('.detailTabItemContent').eq(0).addClass('on');
}




;(function() {
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		//appId: 'wx92d82a6e0fd6ff09', // 必填，公众号的唯一标识
		timestamp: '1459303663', // 必填，生成签名的时间戳
		nonceStr: 'pYvCP2V0sUQLtXTM', // 必填，生成签名的随机串
		signature: '',// 必填，签名，见附录1
		jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	var loginWxBaseUrl = 'http://wechat.utvmall.cn/wechat/wechat-goLogin/GoLogin?rqType=Login&after_login_url=';
	wx.ready(function () {
		// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		wx.hideMenuItems({
			menuList: ['menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:facebook', 'menuItem:share:QZone', 'menuItem:copyUrl', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
		});
		//分享到朋友圈
		wx.onMenuShareTimeline({
			title: function () {
				return document.title + '－电视自由行'
			}, // 分享标题
			link: function () {
				return loginWxBaseUrl + location.href
			}, // 分享链接
			imgUrl: '', // 分享图标
			success: function () {
				// 用户确认分享后执行的回调函数
			},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			},
			fail: function () {

			}
		});
		//分享给朋友
		wx.onMenuShareAppMessage({
			title: function () {
				return document.title + '－电视自由行'
			}, // 分享标题
			desc: '', // 分享描述
			link: function () {
				return loginWxBaseUrl + location.href
			}, // 分享链接
			imgUrl: '', // 分享图标
			type: '', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function () {
				// 用户确认分享后执行的回调函数
			},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			},
			fail: function () {

			}
		});

		//wx.hideOptionMenu();//隐藏右上角菜单按钮
	});


})();