# fitbit-logger

Need to get logs from the device without being attached to a debugger? Either because testing on debugger isn't simulating the exact environment of your users, or because you need to get logs from your users directly?

Enter fitbit-logger.

Fitbit-logger is a replacement for console.log that also persists all the logs to filesystem and sends them to companion. There it can either just log them, so you can see them through Fitbit Android app, or it can post them to an URL of your choice, effectively **giving you a way to gather logs from users of your app**.

## Installation

```javascript
npm i fitbit-logger
```

### Companion

Create an *index.js* file in the *companion* folder if you don't already have one.
Add the following code in this file :

```javascript
import fitlogger from 'fitbit-logger/companion'

options = {
  doConsoleLog: true,
  url: "https://example.com"
}
fitlogger.init(options)
```

### App

Add the following code in your *app/index.js* file

```javascript
import fitlogger from 'fitbit-logger/app'

options = {
  doConsoleLog: true
}
fitlogger.init(options)

fitlogger.log("The monkey ate my pajamas")

```

## API

### Companion
#### `fitlogger.init(options)`
Initializes fitbit-logger. Needs to be called first if you want to use the logger.
##### `options` **object**
Options for logger's behavior.
##### `options.doConsoleLog` **boolean**
False by default.
If true, each log from the device will also be logged in companion using console.log, in the following format:
`App [timestamp] [message]`

##### `options.url` **string**
Optional.
If any url is set, the companion will post every log to the given url via fetch, whereas the logged message will be encoded as a URL query string.

Example: https://example.com?data=nice%20log

### App
#### `fitlogger.init(options)`
Initializes fitbit-logger. Needs to be called first if you want to use the logger.
##### `options` **object**
Options for how this message should be handled. Currently, only `timeout` is supported.
##### `options.doConsoleLog` **boolean**
False by default.
If true, each log sent via fitlogger.send() will also be logged using console.log() on the device.

#### `fitlogger.log(message)`
Logs a timestamped message.
The message is appended to a file and at some moment sent to companion via file-transfer.
##### `message` **any**
The message to be logged. This can be any data type.






## API

* **companion.setup({ provider, apiKey})** : configure the provider / apiKey used to fetch the weather
* **app.fetch(maximumAge = 0)** : retrieve the weather, if given the parameter is the maximum age in milliseconds of a possible cached weather data that is acceptable to return. Default is `0`
* **app.get()** : returns immediately the last cached weather data (the value can be `undefined` when no data has been received)

## Example of result
```json
  {
    "temperatureC":15,
    "temperatureF":59,
    "location":"Castelnau-D'Estretefonds",
    "description":"Mostly Clear",
    "isDay":false,
    "conditionCode":0,
    "realConditionCode":"this is the real conditioncode returned by the provider",
    "sunrise":1507442496594,
    "sunset":1507483356594,
    "timestamp":1507496916594
  }
```

## Contribution

I'm not a javascript expert so every comment/code refactoring/best practice and especially BUG REPORTING is appreciated. Don't hesitate to make a PR and/or tell me what's wrong.