import { openSync, closeSync, writeSync } from "fs";
import { outbox } from "file-transfer";

// log something
// append it to file
// at some point send it as file transfer

var fileName = "fitbit-logger"
var logFileEmpty = true
var doConsoleLog = false

const init = (options) => {
  options = options || {}

  if (options.doConsoleLog) {
    doConsoleLog = true
  }

  clearLogFile()

  if (options.automaticInterval > 0) {
    setInterval(() => {
      if (!logFileEmpty) {
        sendLogFileToCompanion()
      }
    }, options.automaticInterval);
  }
}

const log = (value) => {
  if (doConsoleLog) {
    console.log(value)
  }

  logFileEmpty = false
  var file = openSync(fileName, "a")

  value = "App " + Date.now() + " " + value
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
      console.log("fitbit-logger: send to companion failed " + error);
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