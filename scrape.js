function getGuildName() {
    var guild = $(".name-3gtcmp:first").text();
    return guild;
}

function getChannelName() {
    var channel = $("div.titleText-2IfpkV:first").text();
    return channel;
}

function getUsers() {
    var guild = getGuildName();
    var users = []
    $(".member-username-inner").each(function(i) {
        users.push({
            name: $(this).text(),
            owner: false,
            avatar: 'http://thecatapi.com/?id=cqv')
        };
    });
    //console.log(members);
    data = {"guild": guild, "users": users};
    chrome.runtime.sendMessage({
            method: 'POST',
            url: 'http://dsg1.crc.nd.edu:5001/cse30246/discorddashboard/test',
            data: JSON.stringify(data)
        },  function(responseText) {
            console.log(responseText);
    });
}

function getAllMessages() {
    var guild = getGuildName();
    var channel = getChannelName();
    var $messages = $(".message-group .message-text");
    var m = [];
    $messages.each(function(i) {
        m.push(getMessage($(this)));
    });
    var data = {
        guild: guild,
        channel: channel,
        messages: m
    }
    chrome.runtime.sendMessage({
            method: 'POST',
            url: 'http://dsg1.crc.nd.edu:5001/cse30246/discorddashboard/test',
            data: JSON.stringify(data)
        },  function (responseText) {
            console.log(responseText);
    });
}

function getMessage($node) {
    message = $node.text();
    $header = $node.parents('.comment').children('.message.first:first').find('.old-h2');
    user = $header.children('.username-wrapper:first').text();
    time = $header.children('.timestamp:first').text();
    return {'user': user, 'time': time, 'text': message};
    //console.log("New message in "+guild+" ("+channel+") by "+user+" at "+time+": "+message);
}

function observeMessages(mutations) {
    getAllMessages();
    /*
    mutations.forEach(function(m) {

        console.log("Message mutation type: ", m.type, m);
        if (m.type = "childList") {
            m.addedNodes.forEach(function(n) {
                console.log(n);
                $n = $(n);
                if ($n.hasClass("message") && !$n.hasClass("message-sending")) {
                    getMessage($n)
                }
                else if ($n.hasClass("message-group")) {
                    $n.find(".message-text").each(function() {
                        getMessage($(this));
                    });
                }
            });
        }
    });*/
}

function observeUsers(mutations) {
    mutations.forEach(function(m) {
        console.log("User mutation type: ", m.type, m);
        if (m.type = "childList") {
            m.addedNodes.forEach(function(n) {
                console.log(n);
                $n = $(n);
                if ($n.hasClass("member")) {
                    console.log("New User: ", n);
                }
            });
        }
    });
}

function observeChannel(mutations) {
    mutations.forEach(function(m) {
        console.log("Channel mutation type: ", m.type, m);
        if (m.type == "characterData") {
            console.log(m.target.data);
            setTimeout(getAllMessages, 250);
        }
    });
}

$(document).ready(function() {
    setTimeout(function() {
        getUsers();
        getAllMessages();
        //setInterval(getUsers, 3000);

        var messageObserver = new MutationObserver(observeMessages);
        var userObserver = new MutationObserver(observeUsers);
        var channelObserver = new MutationObserver(observeChannel);

        //New Messages
        messageObserver.observe($("div.messages")[0], {childList: true, subtree: true, attributeFilter: ['message-group']});

        //New Members
        //userObserver.observe($("div.channel-members")[0], {childList: true, subtree: true, attributeFilter: ['member']});

        //Change in channel
        channelObserver.observe($("div.titleText-2IfpkV")[0], {characterData: true, childList: true, subtree: true})
    }, 5000);

    //setInterval(getMessages, 3000);
});
