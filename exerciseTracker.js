const express = require('express')
const app = express()
const mongoose = require('mongoose');

// Schemas and Models
mongoose.connect(process.env.MONGODB_URI);
const exerciseSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: String
})

const exerciseModel = mongoose.model('exercise', exerciseSchema);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }
});

const userModel = mongoose.model('user', userSchema);

// New User
app.post('/api/users', function(req,res){
  if(!req.body) return res.status(400).json({ error: 'error'})
  
  let model = new userModel(req.body);

  model.save()
    .then(doc=>{
      if(!doc || doc.length == 0){
        return res.status(500).send(doc);
      };

      res.status(201).json({ 
        username: req.body.username,
        _id: doc._id
      });
      
    })
    .catch(err=>{
      res.status(500).json(err);
    })
});

// GETs all users.
app.get('/api/users', function(req,res){
  userModel.find({},{username:1,_id:1})
    .then(result=>{
      res.send(result);
    })
    .catch(err=>{
      console.error(err)
      res.status(500).json(err);
    })
});

// POST for 'exercises'.
app.post('/api/users/:_id/exercises', function(req,res){
  
  // handle 'date':
  var date;
  if(req.body.date == '' || !req.body.date){
    // if blank, it will set date as the current date
    var currentdate = new Date();
    date = currentdate.toDateString();
  }else if(new Date(req.body.date) == 'Invalid Date'){
    // errors out if new date can't be created from provided input.
    return res.status(400).json({ error: 'Invalid Date' })
  }else{
    // else, format input string & set date
    var currentdate = new Date(req.body.date);
    date = currentdate.toDateString();
  }

  userModel.findById(req.params._id,(err,data)=>{
    if(err) return res.status(500).json(err)
    if(data == null) return res.status(400).json({
      error: 'user not found'
    })

    let { description, duration } = req.body;

    const newLog = new exerciseModel({user_id:req.params._id,description,duration,date})

    newLog.save()
      .then(doc=>{
        if(!doc || doc.length == 0){
          return res.status(500).send(doc);
        };

        res.status(201).json({
          username: data.username,
          description: description,
          duration: parseInt(duration),
          date: date,
          _id: data._id,
          
        })
      })
      .catch(err=>{
        console.error(err);
        res.status(500).json(err)
      })
  })


})

// GET a user's 'logs'.  
app.get('/api/users/:_id/logs', function(req,res){

  userModel.findById(req.params._id, (err,user)=>{
    if(err) return res.send('Error');
    if(!user) return res.send('Unknown User');
    
    exerciseModel.find({user_id:req.params._id},{_id:0,user_id:0,__v:0}, (err,log)=>{
      
      // if 'from' & 'to' query exist, format array.
      if(req.query.from && req.query.to){
        log = log.filter(e=> new Date(e.date) >= new Date(req.query.from) && new Date(e.date) <= new Date(req.query.to))
      }

      // if 'limit' query exist, format array.
      if(req.query.limit){
        log = log.splice(0,req.query.limit)
      }

      res.json({
        username: user.username,
        count: log.length,
        _id: user._id,
        log: log
      })
    })
  })

})

app.listen(3000)