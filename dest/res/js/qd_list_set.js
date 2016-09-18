
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
	var url=serverAddress+'/utvgoClient/interfaces/content_listQdContent.action';
	
	ajaxMore=$.ajax({
		type: 'GET',
		url: url,
		// data to be added to query string:
		data: {supplierId:supplierId,qdId:qdId,pageSize:pageSize,pageNo:pageNo,publishYear:yearId,typeId:typeId,areaId:areaId},
		// type of data we are expecting in return:
		dataType: 'json',
		success: function(data){
			hideLoading();
			renderListData(data.result||[],action);
		},
		error: function(xhr, type){
			ajaxMore=null;
			//alert('network error!');
		}
	});
}

var playList=[];
function renderListData(data,action){
	var s='';
	var data=data||[];
	for(var i= 0,len=data.length;i<len;i++){
		s+='<div class="commonList-item"> <a data-remark="'+data[i].remark+'" data-href="./play_sn.html?playName='+encodeURIComponent(data[i].name)+'&playUrl='+encodeURIComponent(data[i].playUrl)+'&playImg='+encodeURIComponent(data[i].img)+'&contentId='+encodeURIComponent(data[i].contentId)+'&col='+(data[i].mediaNumber>1 ? 3 : 2)+'&type='+encodeURIComponent('qd')+'&mediaNumber='+encodeURIComponent(data[i].mediaNumber)+'" class="commonList-item-link clearfix"> <div class="commonList-item-img"> <img src="'+data[i].img+'" /> </div> <div class="commonList-item-text-wrapper"> <p class="commonList-item-text">'+data[i].name+'</p> <span class="commonList-item-type-text">'+data[i].createTime+'&nbsp;&nbsp;&nbsp;'+data[i].type+'</span> </div> </a> </div>';
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

