(function() {

var lastMessage = '';

var userDelay = 3000;
var messageDelay = 3000;
var initialDelay = 3000;
var uploadUsers = true;
var uploadMessages = true;
var messageID = "";

function getGuildName() {
    var guild = $(".name-3gtcmp:first").text();
    return guild;
}

function getChannelName() {
    var channel = $("div.titleText-2IfpkV:first").text();
    return channel;
}


function getGuildAvatar() {
    var avatar = parseAvatarUrl($('.guild.selected').find('.avatar-small').css('background-image'));
    return avatar;
}


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
    if (uploadUsers) {
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
                    console.log("User response:", responseText);
                    if (!(responseText.status && responseText.status === 'error')) {
                        scrollUsers();
                    }
                }
        );
    }
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

    //var evt = $.Event('contextmenu', {pageX: 123, pageY: 123});
    //$(document).trigger(evt);
    //console.log($('.contextMenu-uoJTbz:last').get());
    //console.log($node);

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
    if (!url.length) return '';
    var match = url.match(/url\("(.*)"\)/)
    if (match.length > 1)
        return match[1];
    return '';
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
    if (uploadMessages) {
        var guild = getGuildName();
        var channel = getChannelName();
        var guildAvatar = getGuildAvatar();
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
            guild_avatar: guildAvatar,
            messages: m
        }

        console.log("Message Data:", data);
        chrome.runtime.sendMessage({
                method: 'POST',
                url: 'http://dsg1.crc.nd.edu:5001/cse30246/discorddashboard/add_messages',
                data: JSON.stringify(data)
            },  function (responseText) {
                console.log("Message Response:", responseText);
                if (!(responseText.status && responseText.status === 'error')) {
                    if ($messages.length > 0)
                        lastMessage = $($messages[0]).text();
                }
        });

        console.log(lastMessage);
    }

    setTimeout(getAllMessages, messageDelay);
}

function getMessage($node) {
    var message = $node.text();
    var $header = $node.parents('.comment').children('.message.first:first').find('.old-h2');
    var user = $header.children('.username-wrapper:first').text();
    var time = $header.children('.timestamp:first').text();
    var avatar = parseAvatarUrl($header.parents('.message-group').find('.avatar-large:first').css('background-image'));
    // document.getElementById('.btn-option').click();
    // console.log(document);
    /*
    var evt = $.Event('click');

    $node.find('.btn-option').trigger(evt);  //  Source : https://stackoverflow.com/questions/27080518/how-to-fix-element-dispatchevent-is-not-a-function-without-breaking-something
    $popup = $('.option-popout:last')
    console.log($popup.get()); // .find(':nth-child(2)')
    $popup.children().each(function() {
        if ($(this).text() == "Copy ID") {
            console.log($(this));
            $(this).trigger($.Event('click'));
            return false;
        }
    });
    */
    return {'user': user, 'avatar': avatar, 'time': time, 'text': message};
}

function updateSettings() {
    alert("updating settings!");
    messageDelay = $("input[name=messageDelay]").val();
    userDelay = $("input[name=userDelay]").val();
    uploadUsers = $("input[name=uploadUsers]").is(":checked");
    uploadMessages = $("input[name=uploadMessages]").is(":checked");
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
                <span>Upload Users: <input type="checkbox" name="uploadUsers" checked></span>
                <span>Upload Messages: <input type="checkbox" name="uploadMessages" checked></span>
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

document.addEventListener('copy', function(e){
    //Stop default copy
    e.preventDefault();

    // The copy event doesn't give us access to the clipboard data,
    // so we need to get the user selection via the Selection API.
    var selection = window.getSelection().toString();

    // Transform the selection in any way we want.
    // In this example we will escape HTML code.
    console.log("Copied data: ", selection);
    messageID = selection;
    e.clipboardData.setData('text/plain', selection);
});

$(document).ready(function() {
    setupSettings();
    setTimeout(function() {
        getAllUsers();
        getAllMessages();
    }, initialDelay);
});

})();
