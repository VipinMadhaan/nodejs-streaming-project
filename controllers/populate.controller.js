const fs = require("fs");
const fastcsv = require("fast-csv");
//const fetch = require("node-fetch");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const mysql = require("../helpers/db.mysql");

module.exports = async (req, res, next) => {
  console.log('in populate.controller.js');
  try {
    const url = "https://jsonplaceholder.typicode.com/comments";
    const csvUrl = "http://console.mbwebportal.com/deepak/csvdata.csv";

    const [comments, csvData] = await Promise.all([
      fetch(url).then(res => res.json()),
      fetch(csvUrl).then(res => res.text()),
    ]);

    if (comments) {
      const urlDataJsonArray = comments.map((item) => [item.postId, item.id, item.name, item.email, item.body.replace(/[\n\r]/g, ' ')]);
      const result = await mysql.query("INSERT INTO posts (postId, id, name, email, body) VALUES ?", [urlDataJsonArray]);
      console.log(result);
    }

    if (csvData) {
      //get large csv file from url and save the csv file locally
      const filePath = "./csvdata.csv";
      const fileStream = fs.createWriteStream(filePath);
      fileStream.write(csvData);
      fileStream.end();

      //read csv file and insert data into mysql
      const csvReadStream = fs.createReadStream(filePath);
      const csvReadStreamCsvParse = fastcsv
        .parse({ headers: true })
        .on("data", async (data) => {
          console.log("data", data);
          const { postid, id, name, email, body } = data;
          const qurResult = await mysql.query(
            "INSERT INTO posts (postId, id, name, email, body) VALUES (?, ?, ?, ?, ?)",
            [postid, id, name, email, body]
          );
          console.log("result", qurResult);
        })
        .on("end", () => {
          console.log("CSV file successfully processed");
        });
      csvReadStream.pipe(csvReadStreamCsvParse);
    }

    res.status(200);
    res.send({
      status: 200,
      statusText: 'success',
      message: 'data fetched successfully',
    });
      
  } catch (err) {
    console.log('try catch error - ',err);
    res.status(err.status || 500);
    res.send({
      status: err.status || 500,
      statusText: 'Failure',
      message: err.message,
    });
  }
};
