/**
 * Created by ivan on 16/7/30.
 */

var urlParaObj=getUrlPara();//contentId=31996
var playUrl=urlParaObj.playUrl||"";//contentId=31996
var contentId=urlParaObj.contentId||"";//contentId=31996
var fetchRadioId=urlParaObj.fetchRadioId||"";//contentId=31996
var radioName=decodeURIComponent(urlParaObj.radioName)||"";//contentId=31996
var showName=decodeURIComponent(urlParaObj.showName)||"";//contentId=31996
var playUrl=decodeURIComponent(urlParaObj.playUrl)||"";//contentId=31996
var islive=false;
var liveAuth='?id=utvgo&uid=3a163d973ed4c23a8e150212099db671&user=vrrvrmnuwsihilggucfnhhchjidjbjijafgej&appid=10057&uuid=13BD6592188244D0A92C156532C06D372566000006566B00C122';
showLoading();
$(document).ready(function(){
    init();
});

function init(){
    GetRadioDetailInfo(function(data){
        var _result=data.result;
        var videoView= $("#videoView");
        videoView.attr("src",_result.playUrl+liveAuth);
        // $(".video-play-img").attr("src",_result.imageUrl);
        $(".video-play-title").text(_result.radioName);
        window.document.title=_result.radioName;
        renderRadioShow(data);
        initPlayEvent();
    });

        
}
function GetRadioDetailInfo(back){
    showLoading();
    $.ajax({
        type: 'GET',
        url: serverAddress+'/utvgoClient/interfaces/getRadio_detailInfo.action?id='+contentId+'&fetchRadioId='+fetchRadioId,
        // data to be added to query string:
        data: {},
        // type of data we are expecting in return:
        dataType: 'json',
        success: function(data){
            var _data=data;
            if (data.status==0) {
                if (back) {
                    back(_data);
                };
            };
            hideLoading();
        },
        error: function(xhr, type){
            //alert('network error!');
        }
    });
}


function renderRadioShow(data){
    var contentBox= $("#detailTabContentBox_0");
    var _dataArr=data.extra.showList;
    var _result=data.result;
    var _tvShowDate="";
    var _tvShows=data.extra.showList;;
    var _tvShowsItem="";
    var tvListBoxStr="";
    var isOverTips="";
    var today=new Date();
    var showTime="";
    var isOver="";

        for (var j = 0,_subListLen=_tvShows.length; j < _subListLen; j++) {
             isOver=new Date(today.toString().replace(today.toString().split(" ")[4],_tvShows[j].startTime))-today;
             console.log(isOver);
            if (isOver<0) {
                isOverClass="isOver";
                // isOverTips="已结束";
            }else if (0<=isOver&&isOver<=_tvShows[j].duration*1000) {
                isOverClass="onPlay";
                // isOverTips="正在<br>播放";
            }else{
                isOverClass="notStart";
                // isOverTips="";
            };

            _tvShowsItem+='<li data-showid="'+_tvShows[j].id+'" class="listItem '+isOverClass+'"> <div class="icon "><b class="top"></b><b class="bottom"></b><i></i><span class="playTipsText">'+isOverTips+'</span></div> <div class="tvShowItem ellipsis"> <span class="tvShowtime">'+_tvShows[j].startTime+'&nbsp;&nbsp;'+_tvShows[j].showName+'</span> </div> </li>';

        };
        if(_tvShows.length<=0){
            _tvShowsItem='<li class="listItem nolist">没有资源</li>';
        }
        tvListBoxStr='<ul class="tvListBox overflow-scroll-y ">'+_tvShowsItem+'</ul>';
        _tvShowsItem="";
        // console.log(tvListBoxStr);

    //};
    contentBox.append(tvListBoxStr);
    $("#detailTabContentBox_0 .tvListBox").eq(0).addClass("show");
    var _height=$(window).height()-($(window).height()*0.37)-20;
    $("#detailTabContentBox_0 .tvListBox").height(_height);


}

function initPlayEvent(){
    var videoView=document.getElementById("videoView");
    var videoViewImg=$(".video-play-img");
    // videoView.onPlay=function(){
    //     videoViewImg.addClass("on");
    // }
    // videoView.onpause =function(){
    //     videoViewImg.removeClass("on");
    // } 
    $(".video-play-play-icon").on("tap",function(){
        if (videoViewImg.hasClass("on")) {
             videoView.pause();
             videoViewImg.removeClass("on")
        }else{
             videoView.play();
             videoViewImg.addClass("on")            
        };
    });

}


//==================================================================

if(isWeiXin()){
    $('.video-top-bar').hide();
    $('.video-play-wrapper').css('padding-top','0px');
}

$('.video-top-bar-back').on('tap',function(e){
    //alert('t');
    window.history.back();
});