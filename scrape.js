function getUsers() {
    var guild = $(".name-3gtcmp:first").text()
    console.log("guild: " + guild)
    var members = []
    $(".member").each(function(i) {
        members.push($(this).text());
    });
    console.log(members);
}

$(document).ready(function() {
    setInterval(function() {
        getUsers();
    }, 5000);
});
