
	
	
	var urlParaObj=getUrlPara();//contentId=31996
	var contentId=0;
	var channelId=0;
	var type='';
	var col=2;//几列
	var playUrl='';
	var playImg='';
	var playName='';
	var mediaNumber=1;
	var boxId=0;
	var qiDataList=[];//期列表
	var likeDataList=[];
	var duojiDataList=[];//多集列表
	var currentIndex=0;
	var isDuoji=false;
	var duojiType='';//集 or 期 ji qi

	function urlParaInit(url){
		urlParaObj=getUrlPara(url||'');
		type=urlParaObj.type||'';
		col=urlParaObj.col||'2';//几列
		playUrl=urlParaObj.playUrl||'';
		playImg=urlParaObj.playImg||'';
		playName=urlParaObj.playName||'';
		mediaNumber=urlParaObj.mediaNumber||1;
		contentId=urlParaObj.contentId||0;
		channelId=urlParaObj.channelId||0;
		boxId=urlParaObj.boxId||0;
		currentIndex=urlParaObj.currentIndex||0;
		if(col>2) duojiType='ji';
		
		if(type=='qd'||type=='qi'){
			duojiType='qi';
			col=3;
		}
		isDuoji=false;
		if(col>2){
			isDuoji=true;
		}
	}
	//添加播放记录到本地
	function addRecord(playUrl,playName,playImg,contentId,boxId,type,mediaNumber,channelId){
		var o={
			contentId:contentId,
			contentName:playName,
			remark:playName,
			playUrl:playUrl,
			mediaNum:mediaNumber||1,
			tvgoImg:playImg,
			type:type,
			boxId:boxId,
			channelId:channelId
		};
		var rl=localStorage.getItem('recordList')||'';
		if(!rl){
			rl=[];
		}else{
			rl=JSON.parse(rl);
		}
		for(var i=0,len=rl.length;i<len;i++){
			if(contentId==rl[i].contentId){
				return;
			}
		}
		if(rl.length>20){
			rl.pop();
		}
		rl.unshift(o);
		localStorage.setItem('recordList',JSON.stringify(rl));
	}

	function getLikeList(){
		showLoading();
		var offset=0;
		var pageSize=10;
		var pageNo=1;
		var yearId=0;
		var areaId=0;
		var typeId=0;
		////utvgoClient/tvutvgo/channel/ajaxList.action?channelId=5&pagesize=10&pager.offset=0&typeId=10470
		var url=serverAddress+'/utvgoClient/tvutvgo/channel/ajaxList.action';
		$.ajax({
			type: 'GET',
			url: url, //serverAddress+'/utvgoClient/interfaces/hdtvContent_listChannelData.action'
			// data to be added to query string:
			data: {channelId:channelId,pagesize:pageSize,'pager.offset':offset,pageNo:pageNo,year:yearId,typeId:typeId,areaId:areaId},
			// type of data we are expecting in return:
			dataType: 'json',
			success: function(data){
				hideLoading();
				if(!!!data||!!!data.pm){
					//最后一页了，设置ajaxMore避免再请求
					return;
				}
				renderLikeList(data.pm.records||[]);
			},
			error: function(xhr, type){
				hideLoading();
				//alert('network error!');
			}
		});	
	}
	function renderLikeList(data){
		var s='';
		var items=data||[];
		var href='';
		likeDataList=items;
		for(var i=0,len=items.length;i<len;i++){
			if(items[i].tvgoImg.indexOf('http://')==-1){
				items[i].tvgoImg=imgBasePath+items[i].tvgoImg;
			}
			if(items[i].id==boxId){
				continue;
			}
			href='./play_sn.html?playName='+encodeURIComponent(items[i].contentName)+'&playUrl='+encodeURIComponent(items[i].playUrl||items[i].tvgoPlayurl)+'&playImg='+encodeURIComponent(items[i].tvgoImg)+'&currentIndex=0&boxId='+items[i].id+'&channelId='+items[i].channelId+'&contentId='+encodeURIComponent(items[i].contentId)+'&col='+(items[i].mediaNum>1? 3:2)+'&type='+encodeURIComponent(type)+'&mediaNumber='+encodeURIComponent(items[i].mediaNum);//为电影 模式所用
			if(type=='qi'){
				s+='<div class="rdzx-item"> <a data-boxid="'+items[i].id+'" data-href="'+href+'" class="rdzx-item-link"><img src="'+items[i].tvgoImg+'" /> <p class="rdzx-text">'+items[i].contentName+'</p></a> </div>';
			}else{
				//rmdy
				s+='<div class="rmdy-item"> <a data-boxid="'+items[i].id+'" data-href="'+href+'" class="rmdy-item-link"><img src="'+items[i].tvgoImg+'" /> <p class="rdzx-text ellipsis">'+items[i].contentName+'</p></a> </div>';
			}
		}

		$('#likeListBox').html(s);

		$('#likeListBox .'+(type=='qi'?'rdzx':'rmdy')+'-item-link').on('tap',function(e){
			//alert($(this).attr('data-href'));
			
			$('.video-play-play-icon').hide();
			$('.video-play-img').hide();
			if(isDuoji&&duojiType=='ji'){
				$('.detail-jiList-item').off();
				getDetailNew($(this).attr('data-boxid'));
			}else if(duojiType=='qi'){
				getDetailNew($(this).attr('data-boxid'));
			}else{
				getDetailNew($(this).attr('data-boxid'));
				//电影模式
				//window.location.replace($(this).attr('data-href'));

				/*var i=$(this).parent().index();
				//alert(i);
				urlParaInit($(this).attr('data-href'));
				setVideoTitle(playName);
				setVideoInfo(playUrl,playImg);
				setVideoIntroduce(likeDataList[i].remark||playName);
				document.getElementById('videoView').play();
				addRecord(playUrl,playName,playImg,contentId);*/
			}
		});
		if(type!='qi'){
			setTimeout(function(){
				//var w=$('.rmdy-item-link').width();
				//if(!!!w){return;}
				var w=$('body').width();
				w=(w-(11*4))/3;
				var h=w/(210/280);
				$('.rmdy-item-link img').height(h);
			},0);
		}else{
			setTimeout(function(){
				var w=$('.rdzx-item-link').width();
				if(!!!w){return;}
				var h=w/(210/158);
				$('.rdzx-item-link img').height(h);
			},0);
		}
	}
	var getDetailNewReq=null;
	function getDetailNew(boxId){
		var href='';
		if(getDetailNewReq){
			getDetailNewReq.abort();
			getDetailNewReq=null;
		}
		//http://27.36.116.72/utvgoClient/tvutvgo/channel/ajaxDetail.action?channelId=10085&boxId=9287&zoneId=17&pagesize=1000
		var url=serverAddress+'/utvgoClient/tvutvgo/channel/ajaxDetail.action';
		showLoading();
		getDetailNewReq=$.ajax({
		  type: 'GET',
		  url: url,
		  // data to be added to query string:
		  data: {channelId:channelId,boxId:boxId,zoneId:17,pagesize:1000},
		  // type of data we are expecting in return:
		  dataType: 'json',
		  success: function(data){
		  	getDetailNewReq=null;
		  	hideLoading();
		  	if(type!='dy'&&data.pm.records.length>0){
		  		//电视剧 或 期
		  		var item=data.pm.records[0];
		  		if(item.tvgoImg.indexOf('http://')==-1){
					item.tvgoImg=imgBasePath+item.tvgoImg;
				}
		  		href='./play_sn.html?playName='+encodeURIComponent(item.contentName)+'&playUrl='+encodeURIComponent(item.playUrl||item.tvgoPlayurl)+'&playImg='+encodeURIComponent(item.tvgoImg)+'&currentIndex=0&boxId='+data.snet_ContentBox.id+'&channelId='+item.channelId+'&contentId='+encodeURIComponent(item.contentId)+'&col='+(data.snet_ContentBox.mediaNum>1? 3:2)+'&type='+encodeURIComponent(type)+'&mediaNumber='+encodeURIComponent(data.snet_ContentBox.mediaNum);
		  		//设置缓存
		  		if(type=='qi'){
		  			localStorage.setItem('playList',JSON.stringify(data.pm.records));
		  		}else{
		  			//ji
		  			localStorage.setItem('duojiDatas',JSON.stringify(data.pm.records));
		  		}
		  		
		  	}else{
		  		//电影模式
		  		var item=data.snet_ContentBox;
		  		if(item.tvgoImg.indexOf('http://')==-1){
					item.tvgoImg=imgBasePath+item.tvgoImg;
				}
		  		href='./play_sn.html?playName='+encodeURIComponent(item.contentName)+'&playUrl='+encodeURIComponent(item.playUrl||item.tvgoPlayurl)+'&playImg='+encodeURIComponent(item.tvgoImg)+'&currentIndex=0&boxId='+item.id+'&channelId='+item.channelId+'&contentId='+encodeURIComponent(item.contentId)+'&col='+(item.mediaNum>1? 3:2)+'&type='+encodeURIComponent(type)+'&mediaNumber='+encodeURIComponent(item.mediaNum);
		  	}
		    window.location.replace(href);
		  },
		  error: function(xhr, type){
		    //alert('network error!');
		    getDetailNewReq=null;
		  }
		});
	}
	function getDuojiList(boxId){

		/*
		showLoading();
		$.ajax({
		  type: 'GET',
		  url: serverAddress+'/utvgoClient/interfaces/content_listContentTvs.action',
		  // data to be added to query string:
		  data: {contentId:contentId},
		  // type of data we are expecting in return:
		  dataType: 'json',
		  success: function(data){
		  	hideLoading();
		  	if(data.status!=0){
		  		alert(data.result);
		  		return;
		  	}
			duojiDataList=data.result||[];
		    renderDuojiList(data);

		    
		  },
		  error: function(xhr, type){
		    //alert('network error!');
		  }
		});*/
		var duojiDatas=localStorage.getItem('duojiDatas')||'';
		if(!!duojiDatas){
			try{localStorage.setItem('duojiDatas','');}catch(err){}
			duojiDatas=JSON.parse(duojiDatas);
			renderDuojiList(duojiDatas);
		}else{
			//拉取多集信息 并播放
			showLoading();
			var url=serverAddress+'/utvgoClient/tvutvgo/channel/ajaxContentList.action';
			//utvgoClient/tvutvgo/channel/ajaxContentList.action?boxId=9319&pagesize=1000
			$.ajax({
				type:'GET',
				url:url,
				data:{boxId:boxId,pagesize:1000},
				dataType:'json',
				success:function(data){
					hideLoading();
					if(data.pm.records.length>0&&type=='ji'){
						renderDuojiList(data.pm.records||[]);
						//currentIndex=0;
						$('.detail-jiList-item').eq(currentIndex).trigger('tap');
					}
				},
				error:function(xhr,type){
					hideLoading();
				}
			});
		}
	}
	function renderDuojiList(data){
		var items=data||[];
		var s='';
		for(var i=0,len=items.length;i<len;i++){
			if(items[i].tvgoImg.indexOf('http://')==-1){
				items[i].tvgoImg=imgBasePath+items[i].tvgoImg;
			}
			s+='<a data-playurl="'+(items[i].playUrl||items[i].tvgoPlayurl)+'" data-img="'+items[i].tvgoImg+'" title="'+items[i].contentName+'" class="detail-jiList-item">'+items[i].recommendContentName+'</a>';
		}
		if(items.length<=0){
			s='<div style="text-align: center;line-height: 50px;color: #fff;">无数据!</div>';
		}
		$('#duojiListBox').html(s);
		$('.detail-jiList-item').off();
		$('.detail-jiList-item').on('tap',function(e){
			var $el=$(this);
			var i=$el.index();
			currentIndex=i;
			var playUrl=$el.attr('data-playurl');
			var title=$el.attr('title');
			var img=$el.attr('data-img');
			setVideoInfo(playUrl,img);
			document.getElementById('videoView').play();
			$('.detail-jiList-item.on').removeClass('on');
			$el.addClass('on');
			$('.video-play-play-icon').hide();
			$('.video-play-img').hide();
		});
		$('.detail-jiList-item').eq(currentIndex).addClass('on');
	}

	function playDuojiNext(){
		var len=duojiType=='ji'?duojiDataList.length:qiDataList.length;
		if((currentIndex+1)>=len){
			return;
		}
		if(duojiType=='ji'){
			$('.detail-jiList-item').eq(++currentIndex).trigger('tap');
		}else{
			$('.commonList-item').eq(++currentIndex).trigger('tap');
		}
		
	}
	function getQiList(boxId){

		var playList=localStorage.getItem('playList')||'';//期 缓存的数据
		try{localStorage.setItem('playList','');}catch(err){}
		if(!!playList){
			//有 期 数据缓存
			qiDataList=JSON.parse(playList);
			renderQiList();
		}else{
			//拉取期 列表 信息 并播放
			showLoading();
			var url=serverAddress+'/utvgoClient/tvutvgo/channel/ajaxContentList.action';
			//utvgoClient/tvutvgo/channel/ajaxContentList.action?boxId=9319&pagesize=1000
			$.ajax({
				type:'GET',
				url:url,
				data:{boxId:boxId,pagesize:1000},
				dataType:'json',
				success:function(data){
					hideLoading();
					qiDataList=data.pm.records;
					renderQiList();
					if(data.pm.records.length>0){
						currentIndex=0;
						$('.commonList-item').eq(currentIndex).trigger('tap');
					}
				},
				error:function(xhr,type){
					hideLoading();
				}
			});
		}
		
	}
	function renderQiList(){
		var items=qiDataList||[];
		var s='';
		for(var i=0,len=items.length;i<len;i++){
			if(items[i].tvgoImg.indexOf('http://')==-1){
				items[i].tvgoImg=imgBasePath+items[i].tvgoImg;
			}
			s+='<div class="commonList-item" data-remark="'+items[i].remark+'" data-playurl="'+(items[i].playUrl||items[i].tvgoPlayurl)+'" data-img="'+items[i].tvgoImg+'" title="'+(items[i].recommendContentName||items[i].contentName)+'"><a class="commonList-item-link clearfix"> <div class="commonList-item-img"> <img src="'+items[i].tvgoImg+'" /> </div> <div class="commonList-item-text-wrapper"> <p class="commonList-item-text">'+(items[i].recommendContentName||items[i].contentName)+'</p> <span class="commonList-item-type-text"><!--'+items[i].createTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;-->'+items[i].typeName+'</span> </div> </a> </div>';
		}
		if(items.length<=0){
			s='<div style="text-align: center;line-height: 50px;color: #fff;">无数据!</div>';
		}
		$('#duojiListBox').html(s);
		$('.commonList-item').off();
		$('.commonList-item').on('tap',function(e){
			var $el=$(this);
			var i=$el.index();
			//console.log(i);
			currentIndex=i;
			duojiType='qi';
			col=3;
			isDuoji=true;
			var playUrl=$el.attr('data-playurl');
			var title=$el.attr('title');
			var img=$el.attr('data-img');
			setVideoInfo(playUrl,img);
			document.getElementById('videoView').play();
			setVideoTitle(title);
			setVideoIntroduce($el.attr('data-remark'));
			//$('.detail-jiList-item.on').removeClass('on');
			//$el.addClass('on');
			$('.video-play-play-icon').hide();
			$('.video-play-img').hide();
		});
		//$('.detail-jiList-item').eq(0).addClass('on');
	}
	

	function renderDetailTab(){
		var s='';
		s+='<div class="detailTabBar col'+col+' clearfix">';
		
		if(col==3){
			s+='<div class="detailTabItem on"> <span class="detailTab-text">'+(type=='qi'?'播放列表':'选集')+'</span> </div>';
		};
		
		s+='<div class="detailTabItem"> <span class="detailTab-text">猜你喜欢</span> </div> <div class="detailTabItem"> <span class="detailTab-text">简介</span> </div>';

		s+='</div>';

		s+='<div class="detailTabContentBox overflow-scroll-y">';

		if(col==3){
			s+='<div id="duojiListBox" class="detailTabItemContent detail-jiList clearfix">  </div>';
		}

		s+='<div id="likeListBox" class="detailTabItemContent indexContentBox clearfix"> </div> <div id="videoIntroduceBox" class="detailTabItemContent"> </div>';

		s+='</div>';

		$('.detailTabBox').each(function(i,n){
			$(n).html(s);
		});

		detailTabInitShow();

	}

	function getLimitInfo(fn){
		var url=serverAddress+'/utvgoClient/tvutvgo/tvplay/isCanPlay.action';
		$.ajax({
			type:'GET',
			url:url,
			data:{playType:'LIVE'},
			dataType:'json',
			success:function(data){
				if(parseInt(data.result,10)!=0){
					//体验人数已满
					alert(data.desc);
					history.back();
				}else{
					!!fn&&fn();
				}
			},
			error:function(xhr,type){
				
			}
		});
	}

	function init(){
		//先判断是否到了体验人数
		getLimitInfo(function(){
			setVideoTitle(playName);
			setVideoInfo(playUrl,playImg);
			if(isDuoji&&duojiType=='ji'){
				getDuojiList(boxId);
			}
			getLikeList();
			setVideoIntroduce(localStorage.getItem('videoRemark')||playName);
			try{
				localStorage.setItem('videoRemark','');
			}catch(err){}
			document.getElementById('videoView').addEventListener('ended',function(e){
				if(isDuoji){
					playDuojiNext();
				}
			});
			document.getElementById('videoView').addEventListener('error',function(e){
				alert('视频加载失败!');
			});
			if(duojiType=='qi'){
				getQiList(boxId);
			}

		});
	}

	$('.video-play-wrapper').one('touchstart',function(e){
		$('.video-play-play-icon').hide();
		$('.video-play-img').hide();
		document.getElementById('videoView').play();
		addRecord(playUrl,playName,playImg,contentId,boxId,type,mediaNumber,channelId);
	});
	$('.video-top-bar-back').on('tap',function(e){
		//alert('t');
		window.history.back();
	});
	
	function setVideoInfo(url,img){
		if(playUrl){
			document.getElementById('videoView').src=url;
		}
		if(img){
			$('.video-play-img').css('background-image','url('+img+')');
		}
	}
	function setVideoIntroduce(s){
		var ss='<div class="detail-profile"> <p>'+s.replace('\r\n','</p><p>')+'</p></div>';
		$('#videoIntroduceBox').html(ss);
	}

	function setVideoTitle(s){
		document.title=s;
		$('.video-play-title').html(s);
	}
	
	if(isWeiXin()){
		$('.video-top-bar').hide();
		$('.video-play-wrapper').css('padding-top','0px');
	}


	urlParaInit();
	renderDetailTab();
	init();

