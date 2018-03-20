chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.type == 'sendData') {
        var message = request.message;
        $.ajax({
            type: message.method,
            url: message.url,
            data: message.data,
            contentType: "text/plain",
            dataType: 'json',
            success: function(responseText){
                callback(responseText);
            },
            error: function(xhr, textStatus, errorThrown) {
                //if required, do some error handling
                callback('failed to connect to ' + message.url +
                '\nerror: ' + errorThrown +
                '\ntextStatus: ' + textStatus +
                '\nxhr: ' + xhr.status);
            }
        });
    }
    else if (request.type == 'getTabSettings') {
        var message = request.message;
        var url = message.url;
        getTabSettings(callback);
    }

    return true; // prevents the callback from being called too early on return
});

function getTabSettings(url, callback) {
    // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
    // for chrome.runtime.lastError to ensure correctness even when the API call fails
    chrome.storage.sync.get(url, (items) => {
        callback(chrome.runtime.lastError ? null : items[url]);
    });
}
