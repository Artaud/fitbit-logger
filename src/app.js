import { openSync, closeSync, writeSync } from "fs";
import { outbox } from "file-transfer";

// log something
// append it to file
// at some point send it as file transfer

var fileName = "fitbit-logger"
var logFileEmpty = true
var doConsoleLog = false
var defaultConsole = {}
var replaceConsole = false
var prefix = 'App'

const init = (options) => {
  options = options || {}

  if (options.doConsoleLog) {
    doConsoleLog = true
  }

  if (options.replaceConsole) {
    replaceConsole = true
  }

  ['error', 'info', 'log', 'trace', 'warn'].forEach(type => {
    defaultConsole[type] = console[type];
    console[type] = (...args) => {
      defaultConsole[type](...args);

      if (replaceConsole) {
        args.forEach(arg => writeLogToFile(`${type.toUpperCase()}: ${arg}`))
      }
    }
  });

  clearLogFile()

  if (options.automaticInterval > 0) {
    setInterval(() => {
      if (!logFileEmpty) {
        sendLogFileToCompanion()
      }
    }, options.automaticInterval);
  }

  if (options.prefix) {
    prefix = options.prefix
  }
}

const log = (value) => {
  if (doConsoleLog) {
    defaultConsole.log(value)
  }

  writeLogToFile(value)
}

const writeLogToFile = (value) => {
  logFileEmpty = false
  var file = openSync(fileName, "a")

  value = prefix + " " + Date.now() + " " + value + '\n'
  var buffer = encodeToArrayBuffer(value)
  writeSync(file, buffer)
  closeSync(file)
}

const sendLogFileToCompanion = () => {
  outbox
    .enqueueFile(fileName)
    .then((ft) => {
      clearLogFile()
    })
    .catch((error) => {
      defaultConsole.log(`fitbit-logger: send to companion failed ${error}`);
    })
}

const clearLogFile = () => {
  var file = openSync(fileName, "w")
  closeSync(file)
  logFileEmpty = true
}

const encodeToArrayBuffer = (str) => {
  var binstr = unescape(encodeURIComponent(str))
  var arr = new Uint8Array(binstr.length);
  const split = binstr.split('');
  for (let i = 0; i < split.length; i++) {
    arr[i] = split[i].charCodeAt(0);
  }
  return arr;
};

const fitlogger = {
  init: init,
  log: log
}

export default fitlogger
