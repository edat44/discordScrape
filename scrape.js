function getUsers() {
    var guild = $(".name-3gtcmp:first").text()
    console.log("guild: " + guild)
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

$(document).ready(function() {
    setInterval(function() {
        getUsers();
    }, 3000);
});
