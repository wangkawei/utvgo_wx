
$('.list-page-main').on('scroll',function(e){
	var $el=$(this),top=$el.scrollTop(),wh=$el.height();
	//var contentH=$(this).scrollTop()+$(this).height()-46;
	//console.log($(this).scrollTop()+'||'+$('#listContent').height()+'||'+contentH);
	//$('.topNav-title').html($(this).scrollTop()+'||'+$('#listContent').height()+'||'+contentH);

	//即将滚到顶部了
	
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


var qdId,pageNo,typeId,areaId,yearId,pageSize,supplierId,spName,qdName;
var urlParaObj=getUrlPara();
qdId=urlParaObj.qdId||'';
supplierId=urlParaObj.supplierId||'';
spName=urlParaObj.spName||'';
qdName=urlParaObj.qdName||'';
pageNo=1;
typeId=0;
areaId=0;
yearId=0;
pageSize=10;
var typeName='全部类型';

if(!!qdName){
	$('.topNav-title').html(qdName);
}

getNewData('new');


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

	//utvgoClient/tvutvgo/channel/ajaxContentList.action?boxId=7695&pagesize=1000
	var url=serverAddress+'/utvgoClient/tvutvgo/channel/ajaxContentList.action';
	
	ajaxMore=$.ajax({
		type: 'GET',
		url: url,
		// data to be added to query string:
		data: {supplierId:supplierId,boxId:qdId,pagesize:pageSize,'pager.offset':offset,pageNo:pageNo,year:yearId,typeId:typeId,areaId:areaId},
		// type of data we are expecting in return:
		dataType: 'json',
		success: function(data){
			hideLoading();
			renderListData(data.pm.records||[],action,data.pm.total);
		},
		error: function(xhr, type){
			ajaxMore=null;
			//alert('network error!');
		}
	});
}

var playList=[];
function renderListData(data,action,total){
	var s='';
	var data=data||[];
	for(var i= 0,len=data.length;i<len;i++){
		if(data[i].tvgoImg.indexOf('http://')==-1){
			data[i].tvgoImg=imgBasePath + data[i].tvgoImg;
		}
		s+='<div class="commonList-item"> <a data-remark="'+data[i].remark+'" data-href="./play_sn.html?playName='+encodeURIComponent(data[i].recommendContentName||data[i].contentName)+'&playUrl='+encodeURIComponent(data[i].playUrl||data[i].tvgoPlayurl)+'&playImg='+encodeURIComponent(data[i].tvgoImg)+'&currentIndex='+i+'&boxId='+qdId+'&channelId='+data[i].channelId+'&contentId='+encodeURIComponent(data[i].contentId)+'&col='+(total>0 ? 3 : 3)+'&type='+encodeURIComponent('qi')+'&mediaNumber='+encodeURIComponent(total)+'" class="commonList-item-link clearfix"> <div class="commonList-item-img"> <img src="'+data[i].tvgoImg+'" /> </div> <div class="commonList-item-text-wrapper"> <p class="commonList-item-text">'+(data[i].recommendContentName||data[i].contentName)+'</p> <span class="commonList-item-type-text"><!--'+data[i].createTime.split(' ')[0]+'&nbsp;&nbsp;&nbsp;-->'+data[i].typeName+'</span> </div> </a> </div>';
	}

	if(!!!action||action=='new'){
		$('#listContentBox').html(s);
		playList=data;
	}else{
		$('#listContentBox').append(s);
		playList=playList.concat(data);
	}
	try{
        localStorage.setItem('playList',JSON.stringify(playList));
    }catch(err){}

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

