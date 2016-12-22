const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

// var id = '585b55ab7e40841048ebb8af11';
// if(!ObjectID.isValid(id)){
//   console.log('Id not valid');
// }
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((e) => console.log(e));


User.findById('585a034e76940e15c0212693').then((user) => {
  if(!user){
    return console.log('User not found');
  }
  console.log(user);
}).catch((e) => console.log(e));
