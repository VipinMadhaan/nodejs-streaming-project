const mysql = require('../helpers/db.mysql');

module.exports = async (req, res, next) => {
  try{
    let data = req.body;
    let name = data.name || '';
    let email = data.email || '';
    let body = data.body || '';
    let limit = data.limit || 0;
    let result = '';

    if(name != '' || email != '' || body != ''){
      result = await mysql.query(
        "SELECT * FROM posts WHERE name = ? OR email = ? OR body = ? order by name limit ?,?",
        [name, email, body, limit, 100]
      );
      console.log(result);
    }else{
      result = await mysql.query(
        "SELECT * FROM posts order by name limit ?,?",
        [limit, 100]
      );
      console.log(result);
    }
    res.status(200);
    res.send({
      status: 200,
      statusText: 'success',
      posts: result,
    });

  }catch(err){
    res.status(err.status || 500);
    res.send({
      status: err.status || 500,
      statusText: 'Failure',
      message: err.message,
    });
  }
}