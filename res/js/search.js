
$('.list-page-main').on('scroll',function(e){
	var $el=$(this),top=$el.scrollTop(),wh=$el.height();
	//var contentH=$(this).scrollTop()+$(this).height()-46;
	//console.log($(this).scrollTop()+'||'+$('#listContent').height()+'||'+contentH);
	//$('.topNav-title').html($(this).scrollTop()+'||'+$('#listContent').height()+'||'+contentH);

	//即将滚到顶部了
	
	//即将到底部了
	if((top+wh-56+5)>=$('#listContent').height()){
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


var channelId,pageNo,typeId,areaId,yearId,pageSize,supplierId;
var urlParaObj=getUrlPara();
channelId=-1;//urlParaObj.channelId||-1;
supplierId=urlParaObj.supplierId||'';
pageNo=1;
typeId=0;
areaId=0;
yearId=0;
pageSize=10;
var keywords='';
function hasDetailPage(channelId){
	var channelIds=[10085,10086];
	for(var i=0,len=channelIds.length;i<len;i++){
		if(channelId==channelIds[i]){
			return true;
		}
	}
	return false;
}

hideLoading();
$('#siteSearchCancelBt').on('tap',function(e){
	window.history.back();
})
$('#siteSearchInput').focus();
keywords=$('#siteSearchInput').val();
if(keywords){
	getNewData('new');
}
$('#siteSearchInput').on('input keyup',function(e){
	//console.log(e.keyCode);
	if(e.keyCode==13){
		//搜索
		keywords=$(this).val();
		if(keywords==''){
			alert('请输入关键字搜索!');
			return;
		}
		getNewData('new');
	}
});




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

	var offset=(parseInt(pageNo,10)-1)*pageSize;

	//http://27.36.116.72/utvgoClient/tvutvgo/channel/ajaxList.action?channelId=5&pagesize=10&pager.offset=0&typeId=10470
	//Integer(typeId), areaId, year, lanId,keywords,supplierId
	var url=serverAddress+'/utvgoClient/tvutvgo/channel/ajaxList.action';
	
	ajaxMore=$.ajax({
		type: 'GET',
		url: url,
		// data to be added to query string:
		data: {supplierId:supplierId,channelId:channelId,keywords:keywords,pagesize:pageSize,'pager.offset':offset,pageNo:pageNo,year:yearId,typeId:typeId,areaId:areaId},
		// type of data we are expecting in return:
		dataType: 'json',
		success: function(data){
			hideLoading();
			renderListData(data,action);
		},
		error: function(xhr, type){
			ajaxMore=null;
			//alert('network error!');
		}
	});
}

//var playList=[];
function renderListData(datas,action){
	var s='';
	var data=datas.pm.records||[];
	var herf='';
	for(var i= 0,len=data.length;i<len;i++){
		if(data[i].tvgoImg.indexOf('http://')==-1){
			data[i].tvgoImg=imgBasePath + data[i].tvgoImg;
		}
		if(hasDetailPage(data[i].channelId)){
			href='dyDetail.html?channelId='+data[i].channelId+'&contentId='+data[i].id+'&type='+(data[i].mediaNum>=2 ? 'dsj':'dy');
		}else{
			//期
			href='./list_set.html?qdId='+data[i].id+'&qdName='+data[i].contentName;
		}
		s+='<div class="commonList-item"> <a  data-href="'+href+'" class="commonList-item-link clearfix"> <div class="commonList-item-img"> <img src="'+data[i].tvgoImg+'" /> </div> <div class="commonList-item-text-wrapper"> <p class="commonList-item-text">'+(data[i].contentName)+'</p> <span class="commonList-item-type-text"><!--'+data[i].createTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;-->'+data[i].channelName+'</span> </div> </a> </div>';
	}

	if(!!!action||action=='new'){
		$('#listContentBox').html(s);
		//playList=data;
	}else{
		$('#listContentBox').append(s);
		//playList=playList.concat(data);
	}
	// try{
 //        localStorage.setItem('playList',JSON.stringify(playList));
 //    }catch(err){}

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
    window.location.href=$(this).attr('data-href');
});

