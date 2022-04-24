const { connect } = require('mongoose');

const uri = process.env.DB_NAME;

const mongoref=connect(uri, { useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log('Success');
}); 

exports.mongoref=mongoref;

exports.uri=uri;

