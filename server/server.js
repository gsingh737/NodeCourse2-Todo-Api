require('./config/config.js');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');



var PORT = process.env.PORT;
var app = express();
app.use(bodyParser.json());

//POST USER
app.post('/users', (req, res) => {
      var body = _.pick(req.body, ['email', 'password']);
      var user = new User(body);

      user.save().then(()=>{
        return user.generateAuthToken();   //Rememver this fuction is returning a then i.e success
        //res.send(user)
      }).then((token) => {
        res.header('x-auth', token).send(user);
      }).catch((err)=> {
        res.status(400).send();
      });
});

app.get('/users/me', authenticate,  (req, res) => {
  //you will not even be here if user wasnt found as on catch e we are not calling next in middleware authenticate
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findbyCredential(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token)=> {
      res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
  });

  app.delete('/users/me/token', authenticate, (req, res) => {
      req.user.removeToken(req.token).then(() => {
        res.status(200).send();
      }, ()=> {
        res.status(400).send();
      });
  });

  app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
    });
    todo.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  });

app.get('/todos', authenticate, (req, res) => {
   Todo.find({
     _creator: req.user._id
   }).then((todos) => {
     res.send({todos});
   }, (e) => {
     res.status(400).send(e);
   });
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send({});
  }
  Todo.findOne({_id: id, _creator: req.user._id}).then((todo) => {
    if(!todo){
      return res.status(404).send({});
    }
    res.send({todo});
  }, (e) => {
    res.status(404).send({});
  });

});

app.delete('/todos/:id', authenticate,(req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send({});
  }

  Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then((todo) => {
    if(!todo) {
      return res.status(404).send({});
    }
    res.send({todo});
  }, (error) => {
    return res.status(404).send({});
  });
});

app.patch('/todos/:id', authenticate,(req, res) => {

   var id = req.params.id;
   var body = _.pick(req.body, ['text', 'completed']);
   if(!ObjectID.isValid(id)){
     return res.status(404).send({});
   }
   if(_.isBoolean(body.completed) && body.completed){
     body.completedAt = new Date().getTime();
   }
   else {
      body.completed = false;
      body.completedAt = null;
   }
   Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
     if(!todo){
       return res.status(404).send();
     }
     res.send({todo});
   }).catch((e) => {
     res.status(400).send();
   });
});




app.listen(PORT, () => {
  console.log(`Started on port ${PORT}`);
});

module.exports = {app};
// var newTodo = new Todo({
//   text: 'Cook Dinner'
// });
//
// newTodo.save().then((doc) => {
//   console.log('Saved Todo', doc);
// }, (e) => {
//   console.log('Unable to save to do');
// });
//
// var newTodo2 = new Todo({text: 'Go gym', completed: true, completedAt: 5});
// newTodo2.save().then((result) => {
//   console.log(result);
// }, (error) => {
//   console.log('Unable to save to do');
// });

//User
//email - require - trim string mil length 1


// var user = new User({email : 'ssgurpreetsingh@gmail.com '});
// user.save().then((doc) => {
//   console.log(doc);
// },(err) => {
//   console.log('Unable to save user', err);
// });
