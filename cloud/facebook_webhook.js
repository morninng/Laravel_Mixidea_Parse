

var express = require('express');
var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res) {
  console.log(req);
  res.send('It works!');
});


app.get('/test_save', function(req, res) {
  var Game = Parse.Object.extend("Game");
  var game_query = new Parse.Query(Game);
  game_query.get("ayoUOzhTcs", {
    success: function(game_obj){
      var aa = game_obj.get("motion");
      res.send(aa);
    },
    error: function(object, error) {
        res.send("error");  
    }
  });
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
  console.log('post Facebook webhook is called request 95');
/*
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
  console.log("user id is" + req.body.entry["0"].uid);
*/
  try{
    var user_id = req.body.entry["0"].uid;
  }catch(e){
    console.log("uid is not set");
    res.send(200);
    return;
  }
  console.log(typeof user_id);
  console.log(user_id);
  var user_query = new Parse.Query(Parse.User);
  user_query.equalTo("fb_id", user_id);
  user_query.find({
    success: function(user_obj_array) {
      console.log("find command succeed");
      console.log(user_obj_array);
      for(var i=0; i< user_obj_array.length; i++){
        var name = user_obj_array[i].get("FirstName");
        console.log(name);
      }
      res.send(200);
    },
    error: function(object, error) {
      console.log("user cannot be found");
      res.send(200);
    }
  });


});

app.listen();


