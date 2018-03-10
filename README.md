# discordScrape

## json object for users:
```
{
    guild: STRING,
    users: {
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
    messages: {
        text: STRING,
        time: STRING?,
        user: STRING
    }
}
```
