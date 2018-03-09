# discordScrape

## json object for users:
```
{
    guild: STRING,
    users: {
        name: STRING,
        owner: BOOL,
        avatar: STRING (URL)),
        status: STRING?,
        game: STRING (or empty string)
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
