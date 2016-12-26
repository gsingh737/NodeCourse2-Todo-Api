const expect = require('expect');
const request = require('supertest');
const {ObjectID} =require('mongodb');

var {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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


describe('GET /users/me', ()=>{
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });
  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'password123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end((err) => {
      if(err) {
        return done(err);
      }
      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      });
    });
  });

  it('should return validation errors if request invalid', (done) => {
    var email = 'example@.com';
    var password = 'password123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist();
      // expect(res.body).toBe({});
    })
    .end(done);
  });


  it('should not create user if email in use', (done) => {
    var email = users[0].email;
    var password = 'password123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist();
      // expect(res.body).toBe({});
    })
    .end(done);
  });

});
