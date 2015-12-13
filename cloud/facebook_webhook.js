

var express = require('express');
var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res) {
  console.log(req);
  res.send('It works!');
});


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
  console.log('post Facebook webhook is called request 97');
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
  Parse.Cloud.useMasterKey();
  var user_query = new Parse.Query(Parse.User);
  user_query.equalTo("fb_id", user_id);
  user_query.include("ext_data");
  user_query.find({
    success: function(user_obj_array) {
      console.log("find command succeed");
      console.log(user_obj_array);
      for(var i=0; i< user_obj_array.length; i++){
        RetrieveUpdatedData(user_obj_array[i], res, "fb_webhook");
      }
    },
    error: function(object, error) {
      console.log("user cannot be found");
      res.send(200);
    }
  });
});

app.listen();


function RetrieveUpdatedData(user_obj, res, type){


  console.log("RetrieveUpdatedData is called");

  var auth_data = user_obj.get("authData");
  var facebook_auth_data = auth_data.facebook;
  if(!facebook_auth_data){
    console.log("facebook auth data do not exist")
    return;
  }
  var token = facebook_auth_data.access_token;

  console.log("call graph api with token" +  token);
  Parse.Cloud.httpRequest({
    url: 'https://graph.facebook.com/v2.1/me?fields=picture,first_name,last_name,email,timezone,link&access_token=' + token
  }).then(function(httpResponse){

    console.log("graph api has been called");

    var responseData = httpResponse.data;
    var first_name = responseData.first_name;
    var last_name = responseData.last_name;
    var profile_picture = responseData.picture.data.url;
    var email = responseData.email;
    var link = responseData.link;
    var timezone = responseData.timezone;
    fb_id = responseData.id;

    user_obj.set("FirstName",first_name);
    user_obj.set("LastName",last_name);
    user_obj.set("Profile_picture",profile_picture);
    user_obj.set("fb_id",fb_id);

    var ext_data_obj = user_obj.get("ext_data");
    if(!ext_data_obj){
      var User_Extension = Parse.Object.extend("User_Extension");
      ext_data_obj = new User_Extension();
    }
    ext_data_obj.set("email", email);
    ext_data_obj.set("link", link);
    ext_data_obj.set("timezone", timezone);
    ext_data_obj.set("user_obj", user_obj);
    user_obj.set("ext_data",ext_data_obj);
    return user_obj.save();

  }).then(function(obj) {
    console.log("saving user object succeeded");
    switch(type){
      case "parse_cloud":
        res.success("updating user data succeed");
      break;
      case "fb_webhook":
        res.send(200);
      break;
    }

  },function(httpResponse){
    console.error("error" + httpResponse.status + " " + httpResponse.text);
    switch(type){
      case "parse_cloud":
        res.error("updating user data failed");
      break;
      case "fb_webhook":
        res.send(200);
      break;
    }
  });
}



Parse.Cloud.define("update_user_data", function(request, response) {

  console.log("update_user_data has been called");
  var user_id = request.params.user_id;

  Parse.Cloud.useMasterKey();
  var user_query = new Parse.Query(Parse.User);
  user_query.include("ext_data");
  user_query.get(user_id, {
    success: function(user_obj) {
      RetrieveUpdatedData(user_obj, response, "parse_cloud");
      console.log("after get" + user_obj.id);
    },
    error: function(obj, error){
      console.log("error" + error);
    }
  });

});


Parse.Cloud.define("RetrieveUserId", function(request, response) {

  var user_query = new Parse.Query(Parse.User);
  user_query.find({
    success: function(user_obj_array) {
      var user_id_array = new Array();
      for(var i=0; i< user_obj_array.length; i++){
        user_id_array.push(user_obj_array[i].id);
      }
      response.success(user_id_array);
    },
    error: function(obj, error){
      response.error("updating user data failed");
    }
  });

});

