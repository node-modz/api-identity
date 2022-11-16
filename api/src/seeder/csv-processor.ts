import fs from "fs";
import csv from "csv-parser";
import Logger from "../lib/Logger";

const logger = Logger(module)

export class CsvProcessor {

    loadCSV = async (
        file: string,
        fieldMap: any,
        callback: (obj: any) => Promise<any>
      ) => {
        let keys = Object.keys(fieldMap);
        let prop = fieldMap[keys[0]];
        const dataList: any[] = [];
      
        const promise = new Promise((resolve, _) => {
          logger.info("Loading file:", file);
          fs.createReadStream(file)
            .pipe(csv({}))
            .on("data", async (data: any) => {
              if (data[prop] === prop) {
                // header line
              } else {
                let obj: any = {};
                for (var i = 0; i < keys.length; i++) {
                  var key = keys[i]; //ShortName, Description
                  var propMap = fieldMap[key]; //name, description
                  obj[propMap] = data[key];
                }
                dataList.push(obj);
              }
            })
            .on("end", async () => {
              //TODO: this goes off async.. need to really figure out the async/await model of node.
              for (var obj of dataList) {
                await callback(obj);
              }
              resolve("completed");
            });
        }).then((val) => {
          logger.info("Loading file:", file, ": ", val);
        });
      
        // TODO: neither of the following seem to wait for promise to finish
        // await promise;
        // console.log("promise: done:", file);      
        return promise
      };
}