
$('.list-page-main').on('scroll',function(e){
	var $el=$(this),top=$el.scrollTop(),wh=$el.height();
	//var contentH=$(this).scrollTop()+$(this).height()-46;
	//console.log($(this).scrollTop()+'||'+$('#listContent').height()+'||'+contentH);
	//$('.topNav-title').html($(this).scrollTop()+'||'+$('#listContent').height()+'||'+contentH);

	//即将滚到顶部了
	if(top<=54){
		//显示相对定位 类型，隐藏已选类型,隐藏固定定位
		$('.listTypeBox').show();
		$('.listTypeBox.fixed').hide();
		$('.listTypeSelectedBox').hide();
	}else{
		//隐藏固定定位 类型，显示已选类型
		$('.listTypeBox').hide();
		$('.listTypeSelectedBox').show();
	}
	//即将到底部了
	if((top+wh-46+5)>=$('#listContent').height()){
		if(ajaxMore){
			return;
		}
		//加在更多
		if($('.nomore').length>0){
			$('.nomore').show().html('正在加载...');
		}else{
			$('#listContent').append('<div class="nomore">正在加载...</div>');
		}

		getNewData('more');
		//$('#listContentBox').append('<div class="nomore">没有更多了!</div>');
	}
});
var ajaxMore=null;

$('.listTypeSelectedBox').on('tap',function(e){
	e.stopPropagation();
	e.preventDefault();
	e.stopImmediatePropagation();
	$(this).hide();
	$('.listTypeBox.fixed').show();
	updateListTypeFixedSwiper();
});

var channelId,pageNo,typeId,areaId,yearId,pageSize,supplierId,spName,channelName;
var urlParaObj=getUrlPara();
channelId=urlParaObj.channelId||'';
supplierId=urlParaObj.supplierId||'';
spName=urlParaObj.spName||'';
channelName=urlParaObj.channelName||'';
pageNo=1;
typeId=0;
areaId=0;
yearId=0;
pageSize=10;
var typeName='全部类型';

if(parseInt(supplierId,10)>0){
	$('.topNav-title').html(spName);
}else{
	$('.topNav-title').html(channelName);
}

function getTypeData(){
	var url=serverAddress+'/utvgoClient/interfaces/consoc_listContent.action';
	if(!!!supplierId){
		url=serverAddress+'/utvgoClient/interfaces/hdtvContent_typeContext.action'
	}
	$.ajax({
		type: 'GET',
		url: url,
		// data to be added to query string:
		data: {supplierId:supplierId,channelId:channelId,pageSize:pageSize,pageNo:pageNo,publishYear:yearId,typeId:typeId,areaId:areaId},
		// type of data we are expecting in return:
		dataType: 'json',
		success: function(data){
			hideLoading();
			renderTypeData(data);
			if(ajaxMore){
				return;
			}
			if(!!supplierId){
				renderListData(data.result.contents,'new');
			}else{
				getNewData('new');
			}
		},
		error: function(xhr, type){
			//alert('network error!');
		}
	});
}
getTypeData();

function renderTypeData(data){
	var s='',items=[],i= 0,len= 0,text='',on='';
	//type
	s+='<div id="listType-type" class="listType-row listType-type swiper-container"><div class="swiper-wrapper">';
	items=data.result.channels||[];
	if(!!!supplierId){
		items=data.result.dyTypes||[];
	}
	i=0;
	len=items.length;
	if(!!supplierId){//专区
		s+='<div class="swiper-slide listType-item on" data-id="0"><div class="listType-item-text">'+'全部类型'+'</div></div>';

		for(;i<len;i++){
			text=items[i].name;
			s+='<div class="swiper-slide listType-item" data-id="'+items[i].id+'"><div class="listType-item-text">'+text+'</div></div>';
		}
	}else{
		for(;i<len;i++){
			text=items[i].typeName;
			if(items[i].typeId==0){
				on='on';
			}else{
				on='';
			}
			s+='<div class="swiper-slide listType-item '+on+'" data-id="'+items[i].typeId+'"><div class="listType-item-text">'+text+'</div></div>';
		}
	}
	s+='</div></div>';

	

	$('#listTypeBox').html(s);

	s= s.replace('id="listType-type"','id="listType-type-fixed"');
	$('#listTypeBoxFixed').html(s);

	initListTypeSwiper();
	initListTypeEvent();
}

function initListTypeEvent(){
	$('.listType-type .listType-item').on('tap',function(e){
		if(!!supplierId){
			channelId=$(this).attr('data-id');
		}else{
			typeId=$(this).attr('data-id');
		}
		typeName=$(this).children().html();
		$('.listType-type .listType-item.on').removeClass('on');
		$('#listType-type .listType-item').eq($(this).index()).addClass('on');
		$('#listType-type-fixed .listType-item').eq($(this).index()).addClass('on');

		try{ajaxMore.abort();}catch(err){}
		getNewData('new');
		setListTypeSelectedBox();
	});

}

function setListTypeSelectedBox(){
	$('.listTypeSelectedBox').html('当前选择: '+typeName);
}

function getNewData(action){
	var action=action||'new';
	if(action=='new'){
		pageNo=1;
	}else{
		pageNo++;
	}
	if(action=='new'){
		showLoading();
	}
	var url=serverAddress+'/utvgoClient/interfaces/consoc_listContent.action';
	if(!!!supplierId){
		url=serverAddress+'/utvgoClient/interfaces/content_listContent.action';
	}
	ajaxMore=$.ajax({
		type: 'GET',
		url: url,
		// data to be added to query string:
		data: {supplierId:supplierId,channelId:channelId,pageSize:pageSize,pageNo:pageNo,publishYear:yearId,typeId:typeId,areaId:areaId},
		// type of data we are expecting in return:
		dataType: 'json',
		success: function(data){
			hideLoading();
			renderListData((!!supplierId ? data.result.contents:data.result),action);
		},
		error: function(xhr, type){
			ajaxMore=null;
			//alert('network error!');
		}
	});
}


function renderListData(data,action){
	var s='';
	var data=data||[];
	for(var i= 0,len=data.length;i<len;i++){
		s+='<div class="commonList-item"> <a data-remark="'+data[i].remark+'" data-href="./play_sn.html?playName='+encodeURIComponent(data[i].name)+'&playUrl='+encodeURIComponent(data[i].playUrl)+'&playImg='+encodeURIComponent(data[i].img)+'&contentId='+encodeURIComponent(data[i].contentId)+'&col='+(data[i].mediaNumber>1 ? 3 : 2)+'&type='+encodeURIComponent(data[i].type||'content')+'&mediaNumber='+encodeURIComponent(data[i].mediaNumber)+'" class="commonList-item-link clearfix"> <div class="commonList-item-img"> <img src="'+data[i].img+'" /> </div> <div class="commonList-item-text-wrapper"> <p class="commonList-item-text">'+data[i].name+'</p> <span class="commonList-item-type-text">'+data[i].type+'</span> </div> </a> </div>';
	}

	if(!!!action||action=='new'){
		$('#listContentBox').html(s);
	}else{
		$('#listContentBox').append(s);
	}
	if($('.nomore').length>0){
		//加载到内容了
		$('.nomore').hide();
	}else{
		$('#listContent').append('<div class="nomore">正在加载...</div>');
	}
	//没有内容了
	if(data.length<pageSize){
		$('.nomore').show().html('没有更多了!');
		ajaxMore=true;//最后一页了，设置ajaxMore避免再请求
	}else{
		ajaxMore=null;
	}

}

$('#listContentBox').on('tap','.commonList-item-link',function(e){
    var s=$(this).attr('data-remark');
    try{
        localStorage.setItem('videoRemark',s);
    }catch(err){}
    
    window.location.href=$(this).attr('data-href');
});

function updateListTypeFixedSwiper(){
	// listTypeType.reInit();
	// listTypeArea.reInit();
	// listTypeYear.reInit();

	listTypeTypeFixed.reInit();
}
var listTypeType,listTypeTypeFixed;
function initListTypeSwiper() {
	listTypeType = new Swiper('#listType-type', {
		//pagination: '#slideTopBannerIndicator',
		paginationClickable: true,
		//slidesPerView: 1,
		slidesPerView: 'auto',
		freeMode: true
		//loop: true,
		//autoplay:8000,
		//onFirstInit:bannerPageChangeTips,
		//onSlideChangeEnd:bannerPageChangeTips
	});

	listTypeTypeFixed = new Swiper('#listType-type-fixed', {
		//pagination: '#slideTopBannerIndicator',
		paginationClickable: true,
		//slidesPerView: 1,
		slidesPerView: 'auto',
		freeMode: true
		//loop: true,
		//autoplay:8000,
		//onFirstInit:bannerPageChangeTips,
		//onSlideChangeEnd:bannerPageChangeTips
	});
}