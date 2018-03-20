chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    $.ajax({
        type: request.method,
        url: request.url,
        data: request.data,
        contentType: "text/plain",
        dataType: 'json',
        success: function(responseText){
            callback(responseText);
        },
        error: function(xhr, textStatus, errorThrown) {
            //if required, do some error handling
            callback('failed to connect to ' + request.url +
            '\nerror: ' + errorThrown +
            '\ntextStatus: ' + textStatus +
            '\nxhr: ' + xhr.status);
        }
    });

    return true; // prevents the callback from being called too early on return
});
