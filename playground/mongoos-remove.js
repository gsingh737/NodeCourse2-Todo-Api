const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });


// Todo.findOneAndRemove()
Todo.findOneAndRemove({_id: '585c99312f11d8ba0ab582d1' }).then((doc) => {
  console.log(doc);
})
//Todo.findByIdAndRemove
Todo.findByIdAndRemove('585c99312f11d8ba0ab582d1').then((doc) => {
  console.log(doc);
});
