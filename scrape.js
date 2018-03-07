function getGuildName() {
    var guild = $(".name-3gtcmp:first").text();
    return guild;
}

function getUsers() {
    var guild = getGuildName();
    var members = []
    $(".member-username-inner").each(function(i) {
        members.push($(this).text());
    });
    console.log(members);
    data = {"guild": guild, "members": members};
    chrome.runtime.sendMessage({
            method: 'POST',
            url: 'http://dsg1.crc.nd.edu:5001/cse30246/discorddashboard/test',
            data: JSON.stringify(data)
        }, function(responseText) {
            console.log(responseText);
    });
}

function getMessages() {
    var guild = getGuildName();
    var $messages = $(".message-group .comment");
}

$(document).ready(function() {
    setTimeout(function() {
        getUsers();
        setInterval(getUsers, 3000);
    }, 5000);
    setInterval(getMessages, 3000);
});
