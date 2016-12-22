const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  text: 'First test todo'
},
{
  text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
});

describe('Post /Todos', () => {
it('should create a new Todo', (done)=>{
  var text = 'Test todo text';
  request(app)
  .post('/todos')
  .send({text: text})
  .expect(200)
  .expect((res) => {
    expect(res.body.text).toBe(text);
  })
  .end((err, res) => {
    if(err){
      return done(err);
    }

    Todo.find({text}).then((todos) => {
      expect(todos.length).toBe(1);
      expect(todos[0].text).toBe(text);
      done();
    }).catch((error) => done(error));
    });

  });

  it('should not create todo with invalid data', (done) => {
    var text = '';
    request(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .expect((res) => expect(res.body.text).toNotBe(text))
    .end((err, res)  => {
      if(err){
          return done(err);
      }

      Todo.find().then((todos) => {
         expect(todos.length).toBe(2);
         done();
       }).catch((error) => done(error));
    });

  });
});

describe('GET /Todo', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  })
})
