/*var startDate = new Date(2014, 11, 20);
var endDate = new Date(2014, 11, 25);
var $alert = $('#my-alert');
$('#my-start').datepicker().
  on('changeDate.datepicker.amui', function(event) {
    if (event.date.valueOf() > endDate.valueOf()) {
      $alert.find('p').text('开始日期应小于结束日期！').end().show();
    } else {
      $alert.hide();
      startDate = new Date(event.date);
      $('#my-startDate').text($('#my-start').data('date'));
    }
    $(this).datepicker('close');
  });

$('#my-end').datepicker().
  on('changeDate.datepicker.amui', function(event) {
    if (event.date.valueOf() < startDate.valueOf()) {
      $alert.find('p').text('结束日期应大于开始日期！').end().show();
    } else {
      $alert.hide();
      endDate = new Date(event.date);
      $('#my-endDate').text($('#my-end').data('date'));
    }
    $(this).datepicker('close');
  });*/



$(document).ready(function(){
  $(".1").val('会议结束');

  $(function(){
  function o(o){
  $qr.empty().qrcode(o)
}
//input框的值
var c=$("#doc-qr-text");
//div框
$qr = $("#doc-qrcode"),
//c.val('http://cardwechat.tyust.edu.cn/signup'),
o(location.href),
$("#doc-gen-qr").on("click",function(){
  o(c.val());
}),
c.on("focusout",function(){
  o(c.val());
})
});
});


var  hidden= 'm'
var table = $('#table1').html();
function addDay(){
  $('.Mhidden').attr('class','');
  $('#table1').append(table);
 hidden= hidden+'m'
}


function Mhidden(){
  var s = $('#datetimepicker1m').val();
  var e = $('#datetimepicker110m').val();
  var m = $('#meetingInfm').val();
  var k = $('#speakerm').val();
  $('.Mhidden').append('<tr>' +
                        '<td><input name='+ hidden +' '+ 'type="text" value=' + s + '></td>' +
                        '<td><input name='+ hidden +' '+'type="text" value=' + e + '></td>' +
                        '<td><input name='+ hidden +' ' + 'type="text" value=' + k + '></td>' +
                        '<td><input name='+ hidden +' ' + 'type="text" value=' + m + '></td>' +
                    '</tr>');

}
function Ahidden(){
  var s = $('#datetimepicker1a').val();
  var e = $('#datetimepicker110a').val();
  var m = $('#meetingInfa').val();
  var k = $('#speakera').val();
  $('.Ahidden').append('<tr>' +
                        '<td><input name='+ hidden +' ' + 'type="text" value=' + s + '></td>' +
                        '<td><input name='+ hidden +' ' +'type="text" value=' + e + '></td>' +
                        '<td><input name='+ hidden +' '+'type="text" value=' + k + '></td>' +
                        '<td><input name='+ hidden +' '+'type="text" value=' + m + '></td>' +
                    '</tr>');

}
function Ehidden(){
  var s = $('#datetimepicker1e').val();
  var e = $('#datetimepicker110e').val();
  var m = $('#meetingInfe').val();
  var k = $('#speakere').val();
  $('.Ehidden').append('<tr>' +
                        '<td><input name='+ hidden + ' ' +'type="text" value=' + s + '></td>' +
                        '<td><input name='+ hidden +' ' +'type="text" value=' + e + '></td>' +
                        '<td><input name='+ hidden +' '+'type="text" value=' + k + '></td>' +
                        '<td><input name='+ hidden +' '+'type="text" value=' + m + '></td>' +
                    '</tr>');
}



function meetingdownload(){
  var selecteds = $("#download :selected");
  var meetingid = $("#download").attr('name');
  console.log(selecteds);
  var i = 0;
  while(i < selecteds.length){
    var filename = selecteds[i].value;
    var url = '/getMaterials/' + meetingid + '/' + filename;
    /*jQuery.ajax(url);*/
    var href = 'http://netwechat.tyust.edu.cn/getMaterials/jv7gon6awq2utyb9/' + filename;
    window.location.assign(href);
    console.log(href);
    i++;
  }
  /*selecteds.forEach(function(selected){
    var filename = selected.value;
    var url = '/getMaterials/:' + meetingid + '/:' + filename;
    jQuery.ajax(url);
  })*/
}
