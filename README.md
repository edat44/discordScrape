# discordScrape

## json object for users:
```
{
    guild: STRING,
    users: array of {
        name: STRING,
        owner: BOOL,
        avatar: STRING (URL)),
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
    user_avatar: STRING,
    messages: array of {
        text: STRING,
        time: STRING?,
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
