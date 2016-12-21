const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error){
       return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Conected to MongoDB Server')
    //deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) =>
    // {
    //   console.log(result);
    // });
    //deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //   console.log(result);
    // });
    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((doc) => {
    //   console.log(doc);

    db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
      console.log(result);
    });

    db.collection('Todos').findOneAndDelete({_id: new ObjectID("5858a9fe40694f27d0164c60")}).then((doc) => {
      console.log(doc);
    });

  // db.close();
});
