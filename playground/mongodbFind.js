// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
//
// console.log(obj);




MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error){
       return console.log('Unable to connect to MongoDB Server');
    }
    console.log('Conected to MongoDB Server')
    // db.collection('Todos').find({
    //   _id: new ObjectID('5858a9fe40694f27d0164c60')
    //   }).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log('Unable to fetch todos', err);
    // });
    db.collection('Todos').find().count().then((count)=>{
        console.log(`Todos count: ${count} `);
    }, (err) => {
      console.log('Unable to fetch todos', err);
    });

    db.collection('Users').find({name: 'Gurpreet'}).toArray().then((docs) => {
      console.log(JSON.stringify(docs, undefined, 2));
    }, (error) => {
      console.log('Unable to fetch user', error);
    });


    // db.collection('Todos').insertOne({
    //     text : 'Something to do',
    //     completed: false
    // },(err, result) => {
    //   if(err){
    //     return console.log('Unable to insert todo', err);
    //   }
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({ name: 'Gurpreet', age: '28', location: 'Ottawa'}, (error, result) => {
    //   if(error){
    //     return console.log('unable to insert Users', err);
    //   }
    //   console.log(result.ops[0]._id.getTimeStamp());
    //   // console.log(JSON.stringify(result.ops, undefined, 2));
    // });

  // db.close();
});
