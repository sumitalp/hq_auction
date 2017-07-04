var socket  = io.connect('http://localhost:3000');
// var auction_id = '';
// if(window.location.href.indexOf("bids") != -1 || 
//     window.location.href.indexOf("bid/add") != -1){
//     var hrefArr = window.location.href.split('/');
//     auction_id = hrefArr[hrefArr.length - 1];
//     console.log(auction_id); 
// }

$(function(){
    $( "#auction_start" ).datetimepicker({
        dateFormat: "yy-mm-dd",
        timeFormat: "hh:mm"
    });

    socket.on('notify', function(reqUser, userIds, data){
        var html = '<div class="alert alert-info fade in">';
        html += '<a class="close" href="#" data-dismiss="alert">×</a><span>'+ data + '</span></div>';
        
        if(userIds.indexOf(reqUser) > -1){
            console.log('Notify user');
            $('#sktNotifier').append(html);
        }
        
    });

    $('a.win').click(function(){
        var href = $(this).attr('href');

        $.ajax({
            url: href
        }).done(function(data){
            var html = '<div class="alert alert-info fade in">';

            if(data){
                html += '<a class="close" href="#" data-dismiss="alert">×</a><span>'+ data + '</span></div>';
                $("#sktNotifier").append(html);
            }
                
        });
        return false;
    });
})