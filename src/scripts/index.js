const { readCsv } = require('./helpers')

const inputPath = '../tmp/data/1may.csv'

async function main() {
  const records = await readCsv(inputPath)
  console.log(records)
}

main()