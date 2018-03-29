# discordScrape

## json object for users:
```
{
    guild: STRING,
    usersReset: BOOL (reached end of users list)
    users: array of {
        name: STRING,
        owner: BOOL,
        avatar: STRING (URL),
        status: STRING (online, idle, dnd, invisible, or offline),
        game: STRING ('None' for no game),
        bot: BOOL
    }
}
```

## json object for messages
```
{
    guild: STRING,
    channel: STRING,
    guild_avatar: STRING (url),
    messages: array of {
        text: STRING,
        time: STRING,
        avatar: STRING (URL),
        user: STRING
    }
}
```

## json object for guild
```
{
    guild: STRING,
    avatar: STRING,
    channels: array of STRINGS,
}
```
