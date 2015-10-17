/**
 * Created by Administrator on 2015/8/13.
 */

$(document).ready(function(){
    $("#ipApplyImg ,#ipFinishImg").click(function(){
        $("#doc-modal-1").css("display","block");
    });
});

var handleClick = function(){
    $("#doc-modal-1").css("display","none");
    $(".modal_ipApply").css({"width":"400px","height":"400px"});
};

$("#doc-modal-1").mousewheel(function(event) {
    //alert(event.detail);
    if(event.deltaY > 0){
        var imgWidth = $(".modal_ipApply").css("width");
        var imgHeight = $(".modal_ipApply").css("height");
        var w = imgWidth.substr(0,3) * 1.2 + 'px';
        var h = imgHeight.substr(0,3) * 1.2 + 'px';
        $(".modal_ipApply").css({"width":w,"height":h});
    }else{
        var imgWidth = $(".modal_ipApply").css("width");
        var imgHeight = $(".modal_ipApply").css("height");
        var w = imgWidth.substr(0,3) * 0.8 + 'px';
        var h = imgHeight.substr(0,3) * 0.8 + 'px';
        $(".modal_ipApply").css({"width":w,"height":h});
    }
});

$("#ipApplyFail").click(function(){
    $("#ipApplyInput").css("display","none");
    $("#reason").css("display","block");
});

$("#ipApplyCancel").click(function(){
    $("#ipApplyInput").css("display","block");
    $("#reason").css("display","none");
});
$("#ipFinishCompile").click(function(){
    $("#ipFinishInput input").removeAttr("readonly");
});
$("#ipFinishCancel").click(function(){
    $("#ipFinishInput input").attr("readonly","readonly");
});

$("#ipApplyIP").focus(function(e){
   window.setInterval(function(){
           var value = document.getElementById('ipApplyIP').value;
           switch (value.length) {
               case 3:
                   document.getElementById('ipApplyIP').value = value + '.';
               case 7:
                   document.getElementById('ipApplyIP').value = value + '.';
               case 11:
                   document.getElementById('ipApplyIP').value = value + '.';
           }
           //console.log(value.length);
           //document.getElementById('ipApplyIP').value = 123;
       },100);
});

$("#ipApplyMAC").focus(function(){
    window.setInterval(function(){
        var value = document.getElementById('ipApplyMAC').value;
        switch (value.length){
            case 2: document.getElementById('ipApplyMAC').value = value +'-';
            case 5: document.getElementById('ipApplyMAC').value = value +'-';
            case 8: document.getElementById('ipApplyMAC').value = value +'-';
            case 11: document.getElementById('ipApplyMAC').value = value +'-';
            case 14: document.getElementById('ipApplyMAC').value = value +'-';
        }
        //console.log(value.length);
        //document.getElementById('ipApplyIP').value = 123;
    },100);
});


