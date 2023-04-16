var MongoClient = require('mongodb').MongoClient;
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");

var url = process.env.MONGO_URL || "mongodb://admin:password@localhost:27017/";

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/test',function(req,res){
	console.log('testing....');
	MongoClient.connect(url, function(err, db) {
     console.log('Connected..',db,err);
     var dbo = db.db("mydb");
     dbo.createCollection("employee", function(err, res) {
    	if (err) throw err;
    	console.log("Employee Collection created!");
    	db.close();
  	}); 
  })
})

app.get('/api/emps', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("employee").find().toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
      res.send(result);
    });
  });
});

app.post('/api/emp', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { name: req.body.val };
    debugger;
    console.log('request',req.body)
    dbo.collection("employee").insertOne(myobj, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      res.send("Successfully added item!");
    });
  });
});

app.listen(9000);
