/**
 * Created by ivan on 16/7/30.
 */

var urlParaObj=getUrlPara();//contentId=31996
var playUrl=urlParaObj.playUrl||"";//contentId=31996
var contentId=urlParaObj.contentId||"";//contentId=31996
var playName=urlParaObj.playName||"";//contentId=31996
var islive=false;
var liveAuth='?id=utvgo&uid=3a163d973ed4c23a8e150212099db671&user=vrrvrmnuwsihilggucfnhhchjidjbjijafgej&appid=10057&uuid=13BD6592188244D0A92C156532C06D372566000006566B00C122';
$(document).ready(function(){
    getTvShowList();
    getBackShowsList();
    window.document.title=playName;
    //$("#videoView").attr("src",playUrl);
    document.getElementById('videoView').src=playUrl+liveAuth;
});

function getTvShowList(){
    $.ajax({
        type: 'GET',
        url: serverAddress+'/utvgoClient/interfaces/tvShow_listTvShow.action?tvId='+urlParaObj.contentId+'&userId=',
        // data to be added to query string:
        data: {},
        // type of data we are expecting in return:
        dataType: 'json',
        success: function(data){
            var _data=data.result||[];
            if (data.status==0) {
                renderTVShow(_data);
            };

        },
        error: function(xhr, type){
            //alert('network error!');
        }
    });
}


function renderTVShow(dataArr){
    var contentBox= $("#detailTabContentBox_0");
    var _dataArr=dataArr;
    var _tvShowDate="";
    var _tvShows="";
    var _tvShowsItem="";
    var tvListBoxStr="";
    var _dateStr="";
    var day={"1":"一","2":"二","3":"三","4":"四","5":"五","6":"六","0":"日"};
    for (var i = 0,_dataLen=_dataArr.length; i < _dataLen; i++) {
        _tvShowDate=_dataArr[i].showDate.split("-").slice(1).join("-");
        _tvShows=_dataArr[i].tvShows;
        _dateStr+='<li class="weekItem " ><div class="text">周'+day[""+new Date(_dataArr[i].showDate).getDay()]+'<br><span class="tvShowDate">'+_tvShowDate+'</span></div></li>';

        for (var j = 0,_subListLen=_tvShows.length; j < _subListLen; j++) {
            var isOver=new Date(_tvShows[j].showTime.replace(/-/g, "/"))-new Date();
            if (isOver<0) {
                isOverClass="isOver";
                isOverTips="已结束";
            }else if (_tvShows[j].showId==contentId) {
                isOverClass="onPlay";
                isOverTips="正在<br>播放";
            }else{
                isOverClass="notStart";
                isOverTips="";
            };

            _tvShowsItem+='<li data-showid="'+_tvShows[j].showId+'" class="listItem '+isOverClass+'"> <div class="icon "><b class="top"></b><b class="bottom"></b><i></i><span class="playTipsText">'+isOverTips+'</span></div> <div class="tvShowItem ellipsis"> <span class="tvShowtime">'+_tvShows[j].showTime+'&nbsp;&nbsp;'+_tvShows[j].showName+'</span> </div> </li>';

        };
        if(_tvShows.length<=0){
            _tvShowsItem='<li class="listItem nolist">没有资源</li>';
        }
        tvListBoxStr+='<ul class="tvListBox overflow-scroll-y ">'+_tvShowsItem+'</ul>';
        _tvShowsItem="";
        // console.log(tvListBoxStr);

    };
    _dateStr='<ul class="weekBox">'+_dateStr+'</ul>';
    contentBox.append(_dateStr);
    $("#detailTabContentBox_0 .weekBox  .weekItem").eq(0).addClass("on") ;
    contentBox.append(tvListBoxStr);
    $("#detailTabContentBox_0 .tvListBox").eq(0).addClass("show");
    var _height=$(window).height()-($(window).height()*0.37)-80;
    $("#detailTabContentBox_0 .tvListBox").height(_height);


}


//==================================================================
function getBackShowsList(){
    $.ajax({
        type: 'GET',
        url: serverAddress+'/utvgoClient/interfaces/tvShow_listPlayBackTvShow.action?tvId='+contentId+'&userId=',
        // data to be added to query string:
        data: {},
        // type of data we are expecting in return:
        dataType: 'json',
        success: function(data){
            var _data=data.result||[];
            if (data.status==0) {
                BackShowsList_render(_data);
            };

        },
        error: function(xhr, type){
            //alert('network error!');
        }
    });

}

function BackShowsList_render(dataArr){
    var contentBox= $("#detailTabContentBox_1");
    var _dataArr=dataArr;
    var _tvShowDate="";
    var _tvShows="";
    var _tvShowsItem="";
    var tvListBoxStr="";
    var _dateStr="";
    var day={"1":"一","2":"二","3":"三","4":"四","5":"五","6":"六","0":"日"};
    for (var i = 0,_dataLen=_dataArr.length; i < _dataLen; i++) {
        _tvShowDate=_dataArr[i].showDate.split("-").slice(1).join("-");
        _dateStr+='<li class="weekItem " ><div class="text">周'+day[""+new Date(_dataArr[i].showDate).getDay()]+'<br><span class="tvShowDate">'+_tvShowDate+'</span></div></li>';

        _tvShows=_dataArr[i].playBackShows;
        for (var j = 0,_subListLen=_tvShows.length; j < _subListLen; j++) {
            _tvShowsItem+='<li data-playurl="'+_tvShows[j].cliPlayUrl+'" data-tvname="'+_tvShows[j].showName+'" data-showid="'+_tvShows[j].backId+'" class="listItem on"> <div class="icon "><b class="top"></b><b class="bottom"></b><i></i><span class="playTipsText"></span></div> <div class="tvShowItem ellipsis"> <span class="tvShowtime">'+_tvShows[j].showTime+'&nbsp;&nbsp;'+_tvShows[j].showName+'</span> </div> </li>';

        };
        if(_tvShows.length<=0){
            _tvShowsItem='<li class="listItem nolist">没有资源</li>';
        }
        tvListBoxStr+='<ul class="tvListBox overflow-scroll-y ">'+_tvShowsItem+'</ul>';
        _tvShowsItem="";
        // console.log(tvListBoxStr);

    };
    _dateStr='<ul class="weekBox">'+_dateStr+'</ul>';
    contentBox.append(_dateStr);
    $("#detailTabContentBox_1 .weekBox  .weekItem").eq(0).addClass("on") ;
    contentBox.append(tvListBoxStr);
    $("#detailTabContentBox_1 .tvListBox").eq(0).addClass("show");
    var _height=$(window).height()-($(window).height()*0.37)-80;
    $("#detailTabContentBox_1 .tvListBox").height(_height);

}




$(document).on("tap",".detailTabItem ",function(){
    var _this=$(this);
    _this.addClass("on").siblings().removeClass("on");
    $(".detailTabContentBox").eq(_this.index()).addClass("show").siblings().filter(".detailTabContentBox").removeClass("show");
})
    .on("tap",".weekItem",function(){
        var _this=$(this);
        _this.addClass("on").siblings().removeClass("on");
        _this.parent().siblings().filter(".tvListBox").removeClass("show").eq(_this.index()).addClass("show");
    })

    .on("tap","#detailTabContentBox_0 .listItem",function() {
        var _this = $(this);
        if(islive){
            return;
        }

        window.document.title=playName;
        //$("#videoView").attr("src",playUrl);
        document.getElementById('videoView').src=playUrl+liveAuth;
        $('.video-play-play-icon').hide();
        $('.video-play-img').hide();
        document.getElementById('videoView').play();
        islive=true;
    })
    .on("tap","#detailTabContentBox_1 .listItem",function(){
        var _this=$(this);
        if (_this.hasClass("onPlay")) {
            return false;
        };
        //$("#videoView").attr("src",_this.attr("data-playurl")) ;
        document.getElementById('videoView').src=_this.attr("data-playurl")+liveAuth;
        window.document.title=_this.attr("data-tvname");
        _this.addClass("onPlay").siblings().removeClass("onPlay").find(".playTipsText").html("");
        _this.find(".playTipsText").html("正在<br>播放");
        $('.video-play-play-icon').hide();
        $('.video-play-img').hide();
        document.getElementById('videoView').play();
        islive=false;
    });

$('.video-play-wrapper').one('tap',function(e){
    $('.video-play-play-icon').hide();
    $('.video-play-img').hide();
    document.getElementById('videoView').play();
    islive=true;
});

if(isWeiXin()){
    $('.video-top-bar').hide();
    $('.video-play-wrapper').css('padding-top','0px');
}

$('.video-top-bar-back').on('tap',function(e){
    //alert('t');
    window.history.back();
});