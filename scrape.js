(function() {

var lastMessage = '';

var userDelay = 3000;
var messageDelay = 3000;
var initialDelay = 3000;

function getGuildName() {
    var guild = $(".name-3gtcmp:first").text();
    return guild;
}

function getChannelName() {
    var channel = $("div.titleText-2IfpkV:first").text();
    return channel;
}

/*
function getGuildInfo() {
    var name = getGuildName();
    var $channels = $(".container-1 .name-2SL4ev");
    var channels = [];
    $channels.each(function () {
        channels.push($(this).text());
    });
    console.log("channels:", channels);
}
*/

function scrollUsers() {
    var oldPos = $(".channel-members").scrollTop();
    var h = $(".channel-members").height();
    //console.log("old Scroll:", oldPos, ", h: ", h);
    $(".channel-members").scrollTop(oldPos + h);
    var newPos = $(".channel-members").scrollTop();
    if (oldPos === newPos)
        $(".channel-members").scrollTop(0);
}

function getAllUsers() {
    var guild = getGuildName();
    var users = []
    $(".member").each(function(i) {
        users.push(getUser($(this)));
    });

    var data = {"guild": guild, "users": users};

    chrome.runtime.sendMessage({
            method: 'POST',
            url: 'http://dsg1.crc.nd.edu:5001/cse30246/discorddashboard/add_users',
            data: JSON.stringify(data)
        },  function(responseText) {
                console.log(responseText);
            }
    );
    scrollUsers();
    setTimeout(getAllUsers, userDelay);
}

function getUser($node) {
    var status = '';
    if ($node.hasClass('member-status-online'))
        status = 'online';
    else if ($node.hasClass('member-status-idle'))
        status = 'idle';
    else if ($node.hasClass('member-status-dnd'))
        status = 'dnd';
    else if ($node.hasClass('member-status-invisible'))
        status = 'invisible';
    else
        status = 'offline';

    return {
        name: $node.find('.member-username-inner:first').text(),
        owner: $node.find('.member-owner-icon').length === 1,
        avatar: parseAvatarUrl($node.find('.avatar-small:first').css('background-image')),
        status: status,
        game: parseGame($node),
        bot: $node.text().indexOf('BOT') >= 0
    }
}

function parseAvatarUrl(url) {
    return url.match(/url\("(.*)"\)/)[1];
}

function parseGame($node) {
    $game = $node.find('.member-activity-text:first')
    if ($game.length === 1) {
        return $game.text();
    }
    else
        return 'None';
}

function getAllMessages() {
    var guild = getGuildName();
    var channel = getChannelName();
    var $messages = $(".message-text").get().reverse()
    var m = [];
    $($messages).each(function(i) {
        if ($(this).text() === lastMessage)
            return false;
        else
            m.push(getMessage($(this)));
    });
    var data = {
        guild: guild,
        channel: channel,
        messages: m
    }

    chrome.runtime.sendMessage({
            method: 'POST',
            url: 'http://dsg1.crc.nd.edu:5001/cse30246/discorddashboard/add_messages',
            data: JSON.stringify(data)
        },  function (responseText) {
            console.log(responseText);
    });

    if ($messages.length > 0)
        lastMessage = $($messages[0]).text();

    setTimeout(getAllMessages, messageDelay);
}

function getMessage($node) {
    message = $node.text();
    $header = $node.parents('.comment').children('.message.first:first').find('.old-h2');
    user = $header.children('.username-wrapper:first').text();
    time = $header.children('.timestamp:first').text();
    // document.getElementById('.btn-option').click();
    // console.log(document);
    var evt = $.Event('click');

    $node.find('.btn-option').trigger(evt);  //  Source : https://stackoverflow.com/questions/27080518/how-to-fix-element-dispatchevent-is-not-a-function-without-breaking-something
    console.log($('.option-popout:last').get()); // .find(':nth-child(2)')
    // eventFire($node.find('.btn-option:first'), 'click');
    return {'user': user, 'time': time, 'text': message};
}

function updateSettings() {
    alert("updating settings!");
    messageDelay = $("input[name=messageDelay]").val();
    userDelay = $("input[name=userDelay]").val();
    upload = $("input[name=upload]").is(":checked");
}

function setupSettings() {
    var el = `
        <style>
            #settings {
                background: blue;
            }
        </style>
        <div id='settings'>
            <form id="settings">
                <span>User Delay: <input type="number" name="userDelay" min="100" max="30000" step="100" value="3000"></span>
                <span>Message Delay: <input type="number" name="messageDelay" min="100" max="30000" step="100" value="3000"></span>
                <span>Upload to Server: <input type="checkbox" name="upload" checked></span>
                <button name="update" id="updateSettings" type='button'">Update</button>
            </form>
        </div>
    `;
    //$(".layer-kosS71:last").append(el);
    $("#app-mount").append(el);
    $("#updateSettings").click(function(e) {
        e.preventDefault();
        updateSettings();
    });
}
// Just in case... EventFire()
// Source : https://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript

function clickNode($node) {

}

$(document).ready(function() {
    setupSettings();
    setTimeout(function() {
        getAllUsers();
        getAllMessages();
    }, initialDelay);
});

})();
