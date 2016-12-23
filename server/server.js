require('./config/config.js');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var PORT = process.env.PORT;
var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
     res.send({todos});
   }, (e) => {
     res.status(400).send(e);
   });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send({});
  }
  Todo.findById(id).then((todo) => {
    if(!todo){
      return res.status(404).send({});
    }
    res.send({todo});
  }, (e) => {
    res.status(404).send({});
  });

});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send({});
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send({});
    }
    res.send({todo});
  }, (error) => {
    return res.status(404).send({});
  });
});

app.patch('/todos/:id', (req, res) => {

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
   Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
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
