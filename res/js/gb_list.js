
var dataFlag={};
var req=null;
var urlParaObj={};//
var mainId=0;
showLoading();	
$(document).ready(function () {
	urlParaObj=getUrlPara();//
	mainId=sessionStorage.getItem('audioArea')||0;
	mainId=parseInt(mainId,10);
	sessionStorage.removeItem('audioArea');
	init();

});

function init(){

	getTvTypes(function(data){
		initTypesList(data,function(){
			loadTVlistByType(mainId,function(){
				//$("#container2Wrapper .indexContentBox ").eq(mainId).find(".zb-item-logo").eq(subId).addClass("on");
			});
			//initSwiper(mainId);

		});
	});	
}

function loadTVlistByType(activeIndex,fun){
	// var i=swiper.activeIndex;
	var i=activeIndex;
	var areaId=$('#typeList .swiper-slide').eq(i).attr('data-id');
	var $el=$('#container2Wrapper .swiper-slide').eq(i);
	if (!!dataFlag[""+areaId]&&!!dataFlag[""+areaId].flag) {
		return false;
	};
	
	if (!!req) {
		req.abort();
		req=null
	};
	showLoading();

	req=$.ajax({
	  type: 'GET',
	  url: serverAddress+'/utvgoClient/interfaces/getRadio_list.action?pageNo=1&pageSize=1000&areaId='+areaId,
	  // data to be added to query string:
	  //data: {},
	  // type of data we are expecting in return:
	  dataType: 'json',
	  success: function(data){
	  	if (data.status==0) {
	  		var _data=data.result;
	  		var s='';
	  		var item;
		    for(var i=0,len=_data.length;i<len;i++){
		    	item=_data[i];			    	
		    		s+='<div class="zb-item"> <div  class="zb-item-link clearfix"> <div data-href="./gb_listShow.html?contentId='+item.id+'&fetchRadioId='+item.fetchRadioId+'"  class="zb-item-logo" style=""></div> <div class="zb-item-text"> <p class="zb-item-now ellipsis">'+item.radioName+'</p> <p class="zb-item-next ellipsis">正在播出：'+item.showName+'</p> </div> <!--<div class="zb-item-icon"></div>--> </div> </div>'; 
		    	}
		    if(_data.length<=0){
		    	s+='<div class="noDtataTips">暂无数据</div>';
		    }
		    $el.html(s);
		    if (!!fun) {
		    	fun();
		    };
	  	};
	  	hideLoading();
	  	dataFlag[""+areaId]={};
	  	dataFlag[""+areaId].flag=true;
	  },
	  error: function(xhr, type){
	    //alert('network error!');
	    //hideLoading();
	  }

	});
}
function initSwiper(_mainId){
	var Swiper1 = new Swiper('#swiper-container1',{
        paginationClickable: !0,
        slidesPerView: "auto",
        freeMode: !0 , 
        initialSlide : _mainId  
		// ,onTouchStart: function(swiper, even){
		//  	$(".listType-item.on").removeClass("on");
		//  	$(".listType-item").eq(Swiper1.activeIndex).addClass("on");	
		//  	Swiper2.swipeTo(Swiper1.activeIndex,1000,false);			
		//      console.log(swiper);
		//     }
		
	});
	var Swiper2 = new Swiper('#swiper-container2',{
        paginationClickable: !0,
        initialSlide: _mainId,
        //slidesPerView: "auto",
        //freeMode: !0 ,  
		onSlideChangeEnd: function(swiper, even){
		 	$(".listType-item.on").removeClass("on");
		 	$(".listType-item").eq(Swiper2.activeIndex).addClass("on");
		 	Swiper1.swipeTo(Swiper2.activeIndex,200,false);	
		 	loadTVlistByType(swiper.activeIndex);
		 	mainId=swiper.activeIndex;

	 	},
	 	onFirstInit : function(swiper,event){
	 		swiper.activeIndex=_mainId;
	 	}
	});
	// Swiper1.params.control = Swiper2;//需要在Swiper2初始化后，Swiper1控制Swiper2
	// Swiper2.params.control = Swiper1;//需要在Swiper1初始化后，Swiper2控制Swiper1
	$(".listType-item").eq(Swiper2.activeIndex).addClass("on");

	$("#swiper-container1").on("tap",".listType-item",function(){
	 	var _this=$(this);
	 	var _index=_this.index();
	 	$(".listType-item.on").removeClass("on");
	 	_this.addClass("on");
	 	Swiper2.swipeTo(_index,300,false);
	 	loadTVlistByType(_index);
	 	mainId=_index;
	});	
	// $("#swiper-container2").on("swipe",function(){
	//  	var _this=$(this);
	//  	$(".listType-item.on").removeClass("on");
	//  	$(".listType-item").eq(Swiper2.activeIndex).addClass("on");
	// });		
};

$("#container2Wrapper").on("tap",".zb-item-logo",function(){
	var _this=$(this);
	var _parent=_this.parent();
	var _url=_this.attr("data-href");
	sessionStorage.setItem('audioArea',mainId);
	// window.location.hash='?mainId='+mainId+'&subId='+subId;
	window.location.href=_url;
	// _parent.siblings().find(".zb-item-logo").removeClass("on");
	// _this.find(".zb-item-logo").addClass("on");
})
.on("tap",".zb-item-icon",function(){
	var _this=$(this);
	if (_this.hasClass("on")) {
		_this.removeClass("on");
	}else{
		_this.addClass("on");
	};
	
});

function getTvTypes(back){
	showLoading();
	req=$.ajax({
	  type: 'GET',
	  url: serverAddress+'/utvgoClient/interfaces/getFilterWords_list.action?channelId=10056',
	  // data to be added to query string:
	  data: {},
	  // type of data we are expecting in return:
	  dataType: 'json',
	  success: function(data){
  		var _data=data.result[0].areas||[];
	  	if (data.status==0) {};
	  	if (!!back) {
	  		back(_data);
	  	};
	  },
	  error: function(xhr, type){
	    //alert('network error!');
	  }
	});

}
function initTypesList(typeArr,back){
	var _typeArr=typeArr;
	var typeStr="";
	var listStr="";
	for (var j = 0,_typeLen=typeArr.length; j < _typeLen; j++) {
		if(!!!_typeArr[j].name){
			continue;
		}
		typeStr=typeStr+'<li class="listType-item swiper-slide " data-id="'+_typeArr[j].id+'"><span>'+ (_typeArr[j].name||"--")+'</span><!--<i></i> --></li>'; 
		if (_typeArr[j].id) {
	    	listStr+='<li id="" class="indexContentBox swiper-slide overflow-scroll-y"></li>';
	    }
	};
	$("#typeList").html(typeStr);
    $('#container2Wrapper').html(listStr);
    initSwiper(mainId);
	hideLoading();	
    if (!!back) {
    	back();
    };
}

