function urlParaInit(e){urlParaObj=getUrlPara(e||""),type=urlParaObj.type||"",col=urlParaObj.col||"2",playUrl=urlParaObj.playUrl||"",playImg=urlParaObj.playImg||"",playName=urlParaObj.playName||"",mediaNumber=urlParaObj.mediaNumber||1,contentId=urlParaObj.contentId||0}function getLikeList(){$.ajax({type:"GET",url:serverAddress+"/utvgoClient/interfaces/content_getExtraInfo.action",data:{contentId:contentId,userId:userId},dataType:"json",success:function(e){return 0!=e.status?void alert(e.result):void renderLikeList(e)},error:function(e,t){alert("network error!")}})}function renderLikeList(e){var t="",a=e.result||[];likeDataList=a;for(var i=0,l=a.length;i<l;i++)t+='<div class="rdzx-item"> <a data-href="./play_sn.html?playName='+encodeURIComponent(a[i].name)+"&playUrl="+encodeURIComponent(a[i].playUrl)+"&playImg="+encodeURIComponent(a[i].img)+"&contentId="+encodeURIComponent(a[i].contentId)+"&col=2&type="+encodeURIComponent(a[i].type)+"&mediaNumber="+encodeURIComponent(a[i].mediaNumber)+'" class="rdzx-item-link"><img src="'+a[i].img+'" /> <p class="rdzx-text">'+a[i].name+"</p></a> </div>";$("#likeListBox").html(t),$("#likeListBox .rdzx-item-link").on("tap",function(e){urlParaInit($(this).attr("data-href")),setVideoTitle(playName),setVideoInfo(playUrl,playImg),setVideoIntroduce(playName),document.getElementById("videoView").play()})}function renderVideoIntroduce(e){$("#videoIntroduceBox").html(e)}function renderDetailTab(e){var t="";t+='<div class="detailTabBar col'+col+' clearfix">',3==col&&(t+='<div class="detailTabItem on"> <span class="detailTab-text">选集</span> </div>'),t+='<div class="detailTabItem"> <span class="detailTab-text">猜你喜欢</span> </div> <div class="detailTabItem"> <span class="detailTab-text">简介</span> </div>',t+="</div>",t+='<div class="detailTabContentBox overflow-scroll-y">',3==col&&(t+='<div class="detailTabItemContent detail-jiList clearfix"> <a href="#" class="detail-jiList-item">1</a> </div>'),t+='<div id="likeListBox" class="detailTabItemContent indexContentBox clearfix"> </div> <div id="videoIntroduceBox" class="detailTabItemContent"> </div>',t+="</div>",$(".detailTabBox").each(function(e,a){$(a).html(t)}),detailTabInitShow()}function init(){setVideoTitle(playName),setVideoInfo(playUrl,playImg),getLikeList(),setVideoIntroduce(playName)}function setVideoInfo(e,t){playUrl&&(document.getElementById("videoView").src=e),t&&$(".video-play-img").css("background-image","url("+t+")")}function setVideoIntroduce(e){var t='<div class="detail-profile"> <p>'+e.replace("\r\n","</p><p>")+"</p></div>";$("#videoIntroduceBox").html(t)}function setVideoTitle(e){document.title=e,$(".video-play-title").html(e)}var urlParaObj=getUrlPara(),contentId=0,type="",col="2",playUrl="",playImg="",playName="",mediaNumber=1,playDataList=[],likeDataList=[],currentIndex=0;$(".video-play-wrapper").one("touchstart",function(e){$(".video-play-play-icon").hide(),$(".video-play-img").hide(),document.getElementById("videoView").play()}),$(".video-top-bar-back").on("tap",function(e){window.history.back()}),isWeiXin()&&($(".video-top-bar").hide(),$(".video-play-wrapper").css("padding-top","0px")),urlParaInit(),renderDetailTab(),init();