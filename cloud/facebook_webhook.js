

var express = require('express');
var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res) {
  console.log(req);
  res.send('It works!');
});

/*
app.get('/facebook', function(req, res) {
	console.log("get facebook webhook called")
  console.log(req);
  if (
    req.param('hub.mode') == 'subscribe' &&
    req.param('hub.verify_token') == 'morninng'
  ) {
  	console.log(req.param('hub.challenge'));
    res.send(req.param('hub.challenge'));
  } else {
  	console.log('error is sent to facebook webhook');
    res.send(400);
  }
});
*/
app.get('/facebook', function(req, res) {
  console.log("facebook webhook get called 8");
  console.log(req); 
  var mode = req.param('hub.mode');
  var token = req.param('hub.verify_token');
  console.log(mode);
  console.log(token);
  method = req.method;
  console.log(method);

  if( mode == 'subscribe' && token == 'morninng') {
    var challenge = req.param('hub.challenge');
    console.log(challenge);
    res.send(challenge);
  } else {
    res.send(400);
  }

  for(key in req){
    console.log(key)
  }

});



app.post('/facebook', function(req, res) {
  console.log('post Facebook webhook is called request 88');

  console.log("body is " + req.body);
  
  if(req.body){
    var body = req.body;
    console.log("----body------");
    for(b_key in body){
      console.log("key " + b_key);
      console.log("value " + body[b_key]);
    }
    var entry = body.entry;
    if(entry){
      console.log("----entry------");
      for(e_key in entry){
        console.log("entry key " + e_key);
        console.log("entry value " + entry[e_key]);
        var num_obj = entry["0"];
        for(num_key in num_obj){
          console.log("num key " + num_key);
          console.log("num value " + num_obj[num_key]);
        }
      }
    }
  }
  console.log("------");
  console.log(req.body.entry["0"].uid);

  try{
    var user_id = req.body.entry["0"].uid;
  }catch(e){
    console.log("uid is not set");
    res.send(200);
    return;
  }


  var User = Parse.Object.extend("User");
  var user_query = new Parse.Query(User);
  user_query.equalTo("authData",user_id);
  user_query.find({
    success: function(user_obj_array) {
      var name = user_obj.get("FirstName")
    },
    error: function(object, error) {

    }
  });




  res.send(200);
  // Process the Facebook updates here

});

app.listen();


