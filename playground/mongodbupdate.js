const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error){
       return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Conected to MongoDB Server')

    db.collection('Todos').findOneAndUpdate({_id : new ObjectID("5859e0b9521a2875f537dca2")},
                                            {$set: {
                                              completed: true
                                            }
                                          }, {returnOriginal: false}).then((result) => {
                                            console.log(result);
                                          });
  db.collection('Users').findOneAndUpdate({name: 'Onkar'},
                                          {$set :
                                          {
                                            name: 'Gurpreet'
                                          }, $inc:
                                          {
                                            age: 1
                                          }} ,
                                          {
                                             returnOriginal: false
                                           }).then((result) => {
                                             console.log(result);
                                           });

  // db.close();
});
