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

This will result in

## API

### Companion
#### `fitlogger.init(options)`
Initializes fitbit-logger. Needs to be called first if you want to use the logger.
##### `options` **object**
Options for logger's behavior on the companion.
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
Options for logger's behavior on the device.
##### `options.doConsoleLog` **boolean**
False by default.
If true, each log sent via fitlogger.send() will also be logged using console.log() on the device.
##### `options.automaticInterval` **number**
Optional
If set to any number larger than 0, sending logs to companion via file-transfer will happen automatically, with an interval of your choice.

If unset, call fitlogger.sendLogFileToCompanion() to send the logfile manually at any moment.

#### `fitlogger.sendLogFileToCompanion(message)`
Trigger sending logfile from device to companion

#### `fitlogger.log(message)`
Logs a timestamped message.
The message is appended to a file and at some moment sent to companion via file-transfer.
##### `message` **any**
The message to be logged. This can be any data type.


## Contribution

I'm not a javascript expert so every comment/code refactoring/best practice and especially BUG REPORTING is appreciated. Don't hesitate to make a PR and/or tell me what's wrong.