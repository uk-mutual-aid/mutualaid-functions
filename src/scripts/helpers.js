const fs = require('fs')
const neatCsv = require('neat-csv');

function readCsv(path) {
  return new Promise((res,rej) => {
    fs.readFile(path, async (err, data) => {
      if (err) {
        return rej(err)
      }
      return res(await neatCsv(data))
    })
  })
}

module.exports = {
  readCsv
}