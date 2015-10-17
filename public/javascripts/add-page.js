//<div id="addElement"></div>
//<p id="js-do-actions">
//    <input class="am-btn am-btn-primary buttonGroup" id="button1" value="添加" />
//    </p>

$(function() {
    var a=0;
    var $wrapper = $('#addElement');

    $('#js-do-actions').find('input').on('click', function(e) {

        var $t = $(e.target);
        if ($t.is('#button1')) {
            $wrapper.append(
                '<br/><div class="am-g"><div class="am-u-sm-2">'+
                    '<label for="doc-ipt-ip-1">待审核1</label>'+
                '</div>'+
               ' <div class="am-u-sm-8">'+
                '<div class="am-form-group">'+
                    '<input type="text" class="input-heigh" id="doc-ipt-ip-1" readonly="readonly">'+
                    '</div></div> <div class="am-u-sm-2">'+
                '<button type="button" class="am-btn am-btn-default am-round" style="padding: 10px;background-color:#b2e2fa">详情</button></div> </div>');
        } else {

        }
    });
});

$(document).ready(function(){
   $('#alter').click(function(){
       event.preventDefault();
     $('div.am-form-group').find('input').removeAttr("readOnly");
     $('div.am-form-group').find('textarea').removeAttr("readOnly");
       $('#addPicture').append(' <div class="am-form-group am-form-file"> ' +
           '<label for="doc-ipt-file-2">添加图片</label> ' +
           '<div> <button type="button" class="am-btn am-btn-default am-btn-sm"> ' +
           '<i class="am-icon-cloud-upload"></i> 选择要上传的图片</button> ' +
           '</div> <input type="file" id="doc-ipt-file-2"> </div>')
   })
});

$(document).ready(function(){
    $('#delet').click(function(){
        event.preventDefault();
        $('div.am-form-group').remove();
        alert("删除成功");
    });

    $('#cancel').click(function(){
        event.preventDefault();
        $('div.am-form-group').remove();
        alert("您已取消该申请");
    });

    $('#resave').click(function(){
        $('div.am-form-group').find('input').attr("readOnly","readOnly");
        $('div.am-form-group').find('textarea').removeAttr("readOnly");
        alert("已保存您的修改");
    })
});

$(document).ready(function(){
    var ary = new Array(5);
        $('#doc-ipt-name-1').change(function(username){
            var checkname= /^([a-z]|[\u4e00-\u9fa5])+$/;
            var n=checkname.test(username.target.value);
            if(n){
                $(this).css("border-color","green");
                ary[0]=1;
            }else{
                $(this).css("border-color","red");
                ary[0]=0;
            }
        });

        $('#doc-ipt-number-1').change(function(telephone){
            var checknumber=/^[0-9]{11}$/;
            var j=checknumber.test(telephone.target.value);
            if(j){
                $(this).css("border-color","green");
               ary[1]=1;
            }else{
                $(this).css("border-color","red");
                ary[1]=0;
            }
        });

        $('#doc-ipt-MAC-1').change(function(macaddress){
            var checkmac=/^(([0-9a-fA-F]{2}-){5}[0-9a-fA-F]{2})?$/;
            var m=checkmac.test(macaddress.target.value);
            if(m){
                $(this).css("border-color","green");
               ary[2]=1;
            }else{
                $(this).css("border-color","red");
             ary[2]=0;
            }
        });
        $('#doc-ipt-address-1').change(function(){
            var d=$('#doc-ipt-address-1').val().length/1024;
           if(d!=0){
               $(this).css("border-color","green");
               ary[3]=1;
           }else{
               $(this).css("border-color","red");
               ary[3]=0;
           }
        });
    $('#doc-ta-1').change(function(){
            var t=$('#doc-ta-1').val().length/1024;
           if(t!=0){
               $(this).css("border-color","green");
               ary[4]=1;
           }else{
               $(this).css("border-color","red");
               ary[4]=0;
           }
        });

    $("#present").click(function(){
        if(ary[0]==1 && ary[1]==1 && ary[2]==1 && ary[3]==1){
        $('div.am-form-group').find('input').attr("readOnly","readOnly");
        document.getElementById("present").innerHTML="已提交";}
        else{
            event.preventDefault();
            alert('请按照要求正确填写');
        }

    });
    $("#trouble-present").click(function(){
        if(ary[0]==1 && ary[1]==1 && ary[3]==1&& ary[4]==1){
        event.preventDefault();
        $('div.am-form-group').find('input').attr("readOnly","readOnly");
        document.getElementById("present").innerHTML="已提交";}
        else{
            event.preventDefault();
            alert('请按照要求正确填写');
        }

    });
});


