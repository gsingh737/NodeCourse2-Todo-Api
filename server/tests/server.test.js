const expect = require('expect');
const request = require('supertest');
const {ObjectID} =require('mongodb');

var {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},
{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
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
});


describe ('GET /Todo:id', () => {
  it('should return todo doc', (done) => {
     request(app)
     .get(`/todos/${todos[0]._id.toHexString()}`)
     .expect(200)
     .expect((res) => {
       expect(res.body.todo.text).toBe(todos[0].text)
     })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
     request(app)
     .get(`/todos/${new ObjectID('585a034e76940e15c0212693').toHexString()}`)
     .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
     request(app)
     .get(`/todos/123`)
     .expect(404)
    .end(done);
  });

});

describe('DELETE /Todo:id', ()=> {

  it('should remove a todo', (done) => {
  request(app)
  .delete(`/todos/${todos[0]._id.toHexString()}`)
  .expect(200)
  .expect((res) => {
    expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
  })
  .end((err, res) => {
    if(err){
      return done(err);
    }
    Todo.findById(res.body.todo._id).then((result) => {
      expect(result).toNotExist();
      done();
    }).catch((e) => done(e));
  });
});


it('should remove a 404 if nothing was found', (done) => {
  request(app)
  .delete(`/todos/${new ObjectID('585a034e76940e15c0212693').toHexString()}`)
  .expect(404)
  .end(done);
});

it('should remove a 404 if object id is invalid', (done) => {
  request(app)
  .delete('/todos/123')
  .expect(404)
  .end(done);

});

});


describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .send({
            text : "Updated text",
            completed: true
          })
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.text).toBe("Updated text");
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }
          done();
        });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    request(app)
    .patch(`/todos/${todos[1]._id.toHexString()}`)
    .send({
        text : "Updated text2",
        completed: false
      })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.text).toBe("Updated text2");
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }
      done();
    });

  });
  });
