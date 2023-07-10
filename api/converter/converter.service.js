const xml2json = require("xml2js").parseString;
const json2csv = require("json2csv").parse;
/** Standardize input file format to json */
const convertToJson = async ({ format, value }) => {
  return await new Promise((resolve) => {
    try {
      if (format === "csv") {
        const temp = [];
        const lines = value.split("\n");
        const headers = lines[0].split(",");
        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split(",");
          const jsonEntry = {};

          for (let j = 0; j < headers.length; j++) {
            jsonEntry[headers[j]] = currentLine[j];
          }

          temp.push(jsonEntry);
        }
        resolve({
          result: temp,
        });
      }

      if (format === "xml") {
        xml2json(value, { explicitArray: false }, (err, result) => {
          if (err) {
            const e = new Error("Input is not xml");
            e.name = "CONVERSION_ISSUE";
            throw e;
          } else {
            resolve({
              result: result,
            });
          }
        });
      }
    } catch (err) {
      throw err;
    }
  });
};

const convertJsonToXML = (jsonData) => {
  try {
    let xml = "";

    for (let key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        if (typeof jsonData[key] === "object" && jsonData[key] !== null) {
          xml += `<${key}>${convertJsonToXML(jsonData[key])}</${key}>`;
        } else {
          xml += `<${key}>${jsonData[key]}</${key}>`;
        }
      }
    }

    return xml;
  } catch (err) {
    console.error(err);
    const e = new Error("Error converting to xml");
    e.name = "CONVERSION_ISSUE";
    throw e;
  }
};

const convertJsonToCSV = (jsonData) => {
  try {
    const result = json2csv(jsonData.result);
    return result;
  } catch (err) {
    console.error(err);
    const e = new Error("Error converting to csv");
    e.name = "CONVERSION_ISSUE";
    throw e;
  }
};

const convertTo = (output, data) => {
  let result;
  switch (output) {
    case "xml":
      result = convertJsonToXML(data);
      break;
    case "csv":
      result = convertJsonToCSV(data);
      break;
    default:
      result = data;
  }
  return result;
};

const setFilterKey = (arr, jsonData) => {
  arr = arr.split(",");
  for (const k of arr) {
    delete jsonData[k];
  }
  return jsonData;
};

/**
 * modify existing key to new key
 * @param {string} input { update: [{existingKey,newKey}] }
 * @param {*} jsonData
 */
const setModifyKey = (input, jsonData) => {
  const obj = JSON.parse(input);
  const arr = obj.update;
  for (const k of arr) {
    const { existingKey, newKey } = k;
    if (jsonData.hasOwnProperty(existingKey)) {
      const value = jsonData[existingKey];
      delete jsonData[existingKey];
      jsonData[newKey] = value;
    }
  }
  return jsonData;
};

const detectDataType = (data) => {
  try {
    JSON.parse(data);
    return "JSON";
  } catch (error) {}

  if (data.includes("<") && data.includes(">")) {
    return "XML";
  }

  const lines = data.split("\n");
  if (lines.length > 1 && lines[0].includes(",") && lines[1].includes(",")) {
    return "CSV";
  }

  return "Unknown";
};

module.exports = {
  convertTo,
  convertToJson,
  convertJsonToXML,
  convertJsonToCSV,
  setModifyKey,
  setFilterKey,
};
