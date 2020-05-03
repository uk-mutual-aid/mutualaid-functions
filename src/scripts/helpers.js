const fs = require('fs')
const neatCsv = require('neat-csv');
const axios = require('axios');
const { POSTCODE_LOOKUP_URL } = process.env

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

function chunk (arr, len) {
  var chunks = [],
      i = 0,
      n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }

  return chunks;
}

function parseBulkPostcodeIo(queryResult) {
  const { query, result } = queryResult
  if (result !== null) {
    const { latitude: lat, longitude: lng } = result
    return ({ [query]: { lat, lng } })
  } else {
    return ({ [query]: { lat: 0, lng: 0 } })
  }
}

async function bulkPostcodeIo(postcodes) {
  const payload = { postcodes }
  try {
    const response = (await axios.post(POSTCODE_LOOKUP_URL, payload)).data
    const { result } = response
    const parsed = result.map(parseBulkPostcodeIo)
    return parsed
  } catch(e) {
    console.error(e)
  }
}

async function batchLookUpPostcodes(postcodes) {
  const uniques = Array.from(new Set(postcodes))
  const size = 100
  const chunks = chunk(uniques, size)
  const chunkedLookups = await Promise.all(chunks.map(chunk => bulkPostcodeIo(chunk)))
  return [].concat(...chunkedLookups)
}

function batchLookUpAccessor(map, postcode) {
  return map[postcode] || ({ lat: 0, lng: 0 })// return ({ lat, lng  })
}

module.exports = {
  batchLookUpPostcodes,
  batchLookUpAccessor,
  readCsv
}