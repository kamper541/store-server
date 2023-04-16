require('dotenv').config()
if (process.env.NODE_ENV == 'production'){
  module.exports = {
    mongoURI: "mongodb+srv://databaseadmin:IeVUK3sODZUxgNAk@cluster0.sqbkxcd.mongodb.net/test",
    secret: "yoursecret",
  };
}else{
  module.exports = {
    mongoURI: "mongodb://localhost:27017/store-manager",
    secret: "yoursecret",
  };

}
