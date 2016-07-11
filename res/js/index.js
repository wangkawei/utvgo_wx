

/**首页top banner**/
function indexBannerChangeH(){
	var w=$(window).width();
	$('#indexTopBannerBox').height(Math.floor(w/(640/280)));
}
indexBannerChangeH();
function initTopBanner(){
	scrollerIndexTopBanner = new Swiper('#indexTopBannerBox',{
	    pagination: '#slideTopBannerIndicator',
	    paginationClickable: true,
	    slidesPerView: 1,
	    loop: true,
	    autoplay:8000,
	    onFirstInit:bannerPageChangeTips,
    	onSlideChangeEnd:bannerPageChangeTips
	});
}
function bannerPageChangeTips(swiper){
	var i=swiper.activeLoopIndex||0;//当前的index
	var s='';
	if(indexData){
		s=indexData.result.headPics[i].name;
	}
	$('#indexTopBannerTextBar').html(s);
}

var indexData=null;

$.ajax({
  type: 'GET',
  url: serverAddress+'/utvgoClient/interfaces/main_index.action',
  // data to be added to query string:
  data: {},
  // type of data we are expecting in return:
  dataType: 'json',
  success: function(data){
    
    indexData=data;
    renderTopBanner(data);
    renderHots(data);
    renderTVs(data);
    renderDy(data);
    renderYyzq(data);
  },
  error: function(xhr, type){
    alert('network error!');
  }
});

function renderTopBanner(data){
	var s='';
	var items=data.result.headPics;
    for(var i=0,len=items.length;i<len;i++){
    	s+='<li class="swiper-slide"> <a href="#"><img src="'+items[i].bigImg+'" /></a> </li>';

    }
    $('#scrollerIndexTopBanner').append(s);

	initTopBanner();
}
function renderHots(data){
	var s='';
	var items=data.result.hots;
    for(var i=0,len=items.length;i<len;i++){
    	s+='<div class="rdzx-item"> <a href="#" class="rdzx-item-link"><img src="'+items[i].bigImg+'" /> <p class="rdzx-text">'+items[i].name+'</p></a> </div>';
    }
    $('#rdzxContent').append(s);
}
function renderTVs(data){
	var s='';
	var items=data.result.tvs;
    for(var i=0,len=items.length;i<len;i++){
    	s+='<div class="zb-item"> <a href="#" class="zb-item-link clearfix"> <div class="zb-item-logo" style="background-image:url('+items[i].extra.img+');"></div> <div class="zb-item-text"> <p class="zb-item-name ellipsis">'+items[i].name+'</p> <p class="zb-item-now ellipsis">'+items[i].extra.showTime+' '+items[i].extra.showName+'</p> <p class="zb-item-next ellipsis">'+items[i].extra.nextShowTime+' '+items[i].extra.nextShowName+'</p> </div> <div class="zb-item-icon"></div>'+(items[i].extra.isOpen?'':'<div class="zb-nolimitTime-icon"></div>')+'</a> </div> ';
    }
    $('#zbContent').append(s);
	
}
function renderDy(data){
	var s='';
	var items=data.result.ys;
    for(var i=0,len=items.length;i<len;i++){
    	s+='<div class="rmdy-item"> <a href="#" class="rmdy-item-link"><img src="'+items[i].extra.img+'" /> <p class="rdzx-text ellipsis">'+items[i].extra.name+'</p></a> </div>';
    }
    $('#rmdyContent').append(s);

}
function renderYyzq(data){
	var s='';
	var items=data.result.spList;
	for(var i=0,len=items.length;i<len;i++){
    	s+='<div class="yyzq-item"> <a href="#" class="yyzq-item-link"><img src="'+items[i].img+'" /> <p class="yyzq-text ellipsis">'+items[i].name+'</p></a></div>';
    }
    $('#yyzqContent').append(s);
}


