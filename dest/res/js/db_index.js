

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
    url: serverAddress+'/utvgoClient/interfaces/hdtvContent_index.action',
    // data to be added to query string:
    data: {},
    // type of data we are expecting in return:
    dataType: 'json',
    success: function(data){

        indexData=data;
        renderTopBanner(data);
        renderHots(data);
        hideLoading();
        renderDy(data);
        renderJj(data);
        renderRmdm(data);

        renderYyzq(data);
    },
    error: function(xhr, type){
        //alert('network error!');
    }
});

function renderTopBanner(data){
    var s='';
    var items=data.result.headPics;
    for(var i=0,len=items.length;i<len;i++){
        s+='<li class="swiper-slide"> <a href="./dyDetail.html?type='+items[i].type+'&contentId='+items[i].id+'"><img src="'+items[i].img+'" /></a> </li>';

    }
    $('#scrollerIndexTopBanner').append(s);

    initTopBanner();
}
function renderHots(data){
    var s='';
    var items=data.result.hots;
    for(var i=0,len=items.length;i<len;i++){
        s+='<div class="rdzx-item"> <a href="./play_sn.html?playName='+encodeURIComponent(items[i].extra.name)+'&playUrl='+encodeURIComponent(items[i].extra.playUrl)+'&playImg='+encodeURIComponent(items[i].extra.img)+'&contentId='+encodeURIComponent(items[i].extra.contentId)+'&col=2&type='+encodeURIComponent(items[i].type)+'&mediaNumber='+encodeURIComponent(items[i].extra.mediaNumber)+'" class="rdzx-item-link"><img src="'+items[i].bigImg+'" /> <p class="rdzx-text">'+items[i].name+'</p></a> </div>';
    }
    $('#rdzxContent').append(s);
}

function renderDy(data){
    var s='';
    var items=data.result.hotDys;
    for(var i=0,len=items.length;i<len;i++){
        s+='<div class="rmdy-item"> <a href="./dyDetail.html?type=dy&contentId='+items[i].id+'" class="rmdy-item-link"><img src="'+items[i].img+'" /> <p class="rdzx-text ellipsis">'+items[i].name+'</p></a> </div>';
    }
    $('#rmdyContent').append(s);

}
function renderJj(data){
    var s='';
    var items=data.result.hotDsjs;
    for(var i=0,len=items.length;i<len;i++){
        s+='<div class="rmdy-item"> <a href="./dyDetail.html?type=dsj&contentId='+items[i].id+'" class="rmdy-item-link"><img src="'+items[i].img+'" /> <p class="rdzx-text ellipsis">'+items[i].name+'</p></a> </div>';
    }
    $('#jjtjContent').append(s);

}

function renderRmdm(data){
    var s='';
    var items=data.result.hotComics;
    for(var i=0,len=items.length;i<len;i++){
        s+='<div class="rmdy-item"> <a href="./dyDetail.html?type=dsj&contentId='+items[i].id+'" class="rmdy-item-link"><img src="'+items[i].img+'" /> <p class="rdzx-text ellipsis">'+items[i].name+'</p></a> </div>';
    }
    $('#rmdmContent').append(s);

}

function renderYyzq(data){
    var s='';
    var items=data.result.zqs;
    for(var i=0,len=items.length;i<len;i++){
        s+='<div class="rdzx-item"> <a data-href="./play_sn.html?playName='+encodeURIComponent(items[i].extra.name)+'&playUrl='+encodeURIComponent(items[i].extra.playUrl)+'&playImg='+encodeURIComponent(items[i].extra.img)+'&contentId='+encodeURIComponent(items[i].extra.contentId)+'&col='+(items[i].extra.mediaNumber>1 ? 3 : 2)+'&type='+encodeURIComponent(items[i].type)+'&mediaNumber='+encodeURIComponent(items[i].extra.mediaNumber)+'" class="rdzx-item-link"><img src="'+items[i].extra.img+'" /> <p class="rdzx-text ellipsis">'+items[i].extra.name+'</p></a></div>';
    }
    $('#yyzqContent').append(s);
    $('#yyzqContent a.rdzx-item-link').on('tap',function(e){
        var i=$(this).parent().index();
        try{
            localStorage.setItem('videoRemark',indexData.result.zqs[i].extra.remark);
        }catch(err){}
        
        window.location.href=$(this).attr('data-href');
    });
}

$('.db_more').on('tap',function(e){
    if($(this).hasClass('on')){
        $(this).removeClass('on');
        $('.db-main-footer-more').removeClass('on');
    }else{
        $(this).addClass('on');
        $('.db-main-footer-more').addClass('on');;
    }
});



