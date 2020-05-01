const fs = require('fs')
const neatCsv = require('neat-csv');

async function readCsv(path) {
  fs.readFile(path, async (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(await neatCsv(data))
  })
}

module.exports = {
  readCsv
}