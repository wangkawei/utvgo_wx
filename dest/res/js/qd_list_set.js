function getNewData(e){var e=e||"new";"new"==e?pageNo=1:pageNo++,"new"==e&&showLoading();var a=serverAddress+"/utvgoClient/interfaces/content_listQdContent.action";ajaxMore=$.ajax({type:"GET",url:a,data:{supplierId:supplierId,qdId:qdId,pageSize:pageSize,pageNo:pageNo,publishYear:yearId,typeId:typeId,areaId:areaId},dataType:"json",success:function(a){hideLoading(),renderListData(a.result||[],e)},error:function(e,a){ajaxMore=null,alert("network error!")}})}function renderListData(e,a){for(var t="",e=e||[],n=0,o=e.length;n<o;n++)t+='<div class="commonList-item"> <a data-remark="'+e[n].remark+'" data-href="./play_sn.html?playName='+encodeURIComponent(e[n].name)+"&playUrl="+encodeURIComponent(e[n].playUrl)+"&playImg="+encodeURIComponent(e[n].img)+"&contentId="+encodeURIComponent(e[n].contentId)+"&col="+(e[n].mediaNumber>1?3:2)+"&type="+encodeURIComponent("qd")+"&mediaNumber="+encodeURIComponent(e[n].mediaNumber)+'" class="commonList-item-link clearfix"> <div class="commonList-item-img"> <img src="'+e[n].img+'" /> </div> <div class="commonList-item-text-wrapper"> <p class="commonList-item-text">'+e[n].name+'</p> <span class="commonList-item-type-text">'+e[n].createTime+"&nbsp;&nbsp;&nbsp;"+e[n].type+"</span> </div> </a> </div>";a&&"new"!=a?($("#listContentBox").append(t),playList=playList.concat(e)):($("#listContentBox").html(t),playList=e);try{localStorage.setItem("playList",JSON.stringify(playList))}catch(r){}$(".nomore").length>0?$(".nomore").hide():$("#listContent").append('<div class="nomore">正在加载...</div>'),e.length<pageSize?($(".nomore").show().html("没有更多了!"),ajaxMore=!0):ajaxMore=null}$(".list-page-main").on("scroll",function(e){var a=$(this),t=a.scrollTop(),n=a.height();if(t+n-46+5>=$("#listContent").height()){if(ajaxMore)return;$(".nomore").length>0?$(".nomore").show().html("正在加载..."):$("#listContent").append('<div class="nomore">正在加载...</div>'),getNewData("more")}});var ajaxMore=null,qdId,pageNo,typeId,areaId,yearId,pageSize,supplierId,spName,qdName,urlParaObj=getUrlPara();qdId=urlParaObj.qdId||"",supplierId=urlParaObj.supplierId||"",spName=urlParaObj.spName||"",qdName=urlParaObj.qdName||"",pageNo=1,typeId=0,areaId=0,yearId=0,pageSize=10;var typeName="全部类型";qdName&&$(".topNav-title").html(qdName),getNewData("new");var playList=[];$("#listContentBox").on("tap",".commonList-item-link",function(e){var a=$(this).attr("data-remark");try{localStorage.setItem("videoRemark",a)}catch(t){}window.location.href=$(this).attr("data-href")});