//trandforms the data generically. This has nothing to do with our CDP format. The CSV is converted to a json format for processing purposes.
import { parse } from "csv-parse/sync";

export function convertCsvToJson(csv) {
  let records = parse(csv, { columns: true });
  return records;
}

export function convertJsonArrayToText(jsonArray = []) {
  let jsonArrayText = "";
  for (let ii = 0; ii < jsonArray.length; ii++) {
    let jsonText = JSON.stringify(jsonArray[ii]);
    jsonArrayText += jsonText;
    if (ii !== jsonArray.length - 1) {
      jsonArrayText += "\n";
    }
  }
  return jsonArrayText;
}
