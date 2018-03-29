(function() {

var lastMessage = null;
var nextLastMessage = null;

var userDelay = 3000;
var messageDelay = 3000;
var initialDelay = 3000;
var uploadUsers = true;
var uploadMessages = true;
var messageID = "";

var userIntervalID = false;
var msgIntervalID = false;

var usersReset = false;

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
    if (oldPos === newPos) {
        $(".channel-members").scrollTop(0);
        usersReset = true;
    }
    else {
        usersReset = false;
    }
}

function getAllUsers() {
    if (uploadUsers) {
        var guild = getGuildName();
        var users = []
        $(".member").each(function(i) {
            users.push(getUser($(this)));
        });

        var data = {"guild": guild, "users": users, "usersReset": usersReset};

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

    var element = $node.get()[0];
    var e = element.ownerDocument.createEvent('MouseEvent');

    e.initMouseEvent('contextmenu', true, true,
             element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
             false, false, false,2, null);


    !element.dispatchEvent(e);
    var $context = $('.contextMenu-uoJTbz:last');
    if ($context.length > 0) {
        console.log("Found context menu :)");
        copyFromNode($context, ".item-1XYaYf");
    }
    else {
        console.log("No context menu found :(");
    }

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
        var $messageGroups = $(".message-group").get().reverse();
        var m = [];
        $($messageGroups).each(function(i) {
            var newMessages = getMessageGroup($(this), (i === 0));
            m = m.concat(newMessages[0]);
            if (newMessages[1]) return false;
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
                        lastMessage = nextLastMessage;
                }
        });
    }
}

function getMessage($messageNode, time, user, first) {
    var text = $messageNode.text();
    var messageIdentifier = JSON.stringify({time: time, user: user, text: text});
    console.log("old last message:", lastMessage);
    console.log("new      message:", messageIdentifier);
    if (messageIdentifier === lastMessage) {
        console.log("hit last message!");
        return false;
    }
    if (first) nextLastMessage = messageIdentifier;
    return text;
}

function getMessageGroup($groupNode, first) {
    var $header = $groupNode.find('.message.first:first').find('.old-h2');
    var user = $header.children('.username-wrapper:first').text();
    var time = $header.children('.timestamp:first').text();
    var avatar = parseAvatarUrl($groupNode.find('.avatar-large:first').css('background-image'));
    var m = [];
    $messages = $groupNode.find('.message-text').get().reverse();
    var stop = false;

    $($messages).each(function(i) {
        var text = getMessage($(this), time, user, first && (i === 0));
        if (text === false) {
            stop = true;
            return false;
        };
        m.push({
            'user': user,
            'avatar': avatar,
            'time': time,
            'text': text
        });
    });
    return [m, stop];
}

function updateSettings() {
    messageDelay = $("input[name=messageDelay]").val();
    userDelay = $("input[name=userDelay]").val();
    uploadUsers = $("input[name=uploadUsers]").is(":checked");
    uploadMessages = $("input[name=uploadMessages]").is(":checked");
    console.log("updated time settings!");
    clearInterval(userIntervalID);
    clearInterval(msgIntervalID);
    userIntervalID = setInterval(getAllUsers, userDelay);
    msgIntervalID = setInterval(getAllMessages, messageDelay);

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
                <span>User Delay: <input type="number" name="userDelay" min="100" max="60000" step="100" value="1000"></span>
                <span>Message Delay: <input type="number" name="messageDelay" min="100" max="60000" step="100" value="30000"></span>
                <span>Upload Users: <input type="checkbox" name="uploadUsers"></span>
                <span>Upload Messages: <input type="checkbox" name="uploadMessages" checked></span>
                <button name="update" id="updateSettings" type='button'">Update</button>
            </form>
        </div>
    `;
    //$(".layer-kosS71:last").append(el);
    $("#app-mount").append(el);
    updateSettings();
    $("#updateSettings").click(function(e) {
        //e.preventDefault();
        updateSettings();
    });
}
// Just in case... EventFire()
// Source : https://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript

function copyFromNode($node, className) {
    //console.log($node);
    $node.find(className).each(function() {
        if ($(this).text() == "Copy ID") {
            $(this).bind('copy', function(){
                //console.log("COPY ID button was COPIED");
            });
            var element = $(this)[0];
            //console.log(element);
            var e = element.ownerDocument.createEvent('MouseEvent');
            e.initMouseEvent('click', true, true,
                     element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
                     false, false, false, 0, null);


            !element.dispatchEvent(e);

            return false;
        }
    });
}

document.addEventListener('copy', function(e){
    //Stop default copy
    //e.preventDefault();

    // The copy event doesn't give us access to the clipboard data,
    // so we need to get the user selection via the Selection API.
    var selection = window.getSelection().toString();

    // Transform the selection in any way we want.
    // In this example we will escape HTML code.
    console.log("Copied data: ", selection);
    //e.clipboardData.setData('text/plain', selection);
});

$(document).ready(function() {
    setTimeout(function() {
        setupSettings();
    }, initialDelay);
});

})();
