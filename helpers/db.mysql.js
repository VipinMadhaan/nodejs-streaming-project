const mysql = require('mysql2');

let dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

const connection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      console.log("MySQL pool connection Error " + err);
      if (err) reject(err);
      console.log("MySQL pool connected: threadId " + connection.threadId);
      const query = (sql, binding) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, result) => {
            if (err) reject([err, null]);
            resolve([null, result]);
          });
        });
      };
      const release = () => {
        return new Promise((resolve, reject) => {
          if (err) reject(err);
          console.log('MySQL pool released: threadId ' + connection.threadId);
          resolve(connection.release());
        });
      };
      resolve({ query, release });
    });
  });
};

const query = async (sql, binding) => {
  return new Promise(async (resolve, reject) => {
    const conn = await connection();
    try {
      const [err, result] = await conn.query(sql, binding);
      if (err) reject(err);
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      await conn.release();
    }
  });
};

module.exports = { connection, query };
