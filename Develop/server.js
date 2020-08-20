const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require('path');

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  });

/// html routes

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname, './public/stats.html'));
});
app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname, './public/exercise.html'));
});


/// api routes

app.get('/api/workouts', (req, res) => {
  db.Workout.find({}).then((data) => {
    res.json(data);
  });
});

app.put('/api/workouts/:id', (req, res) => {
  db.Workout.findByIdAndUpdate(req.params.id, {exercises: req.body}).then((data)=>{res.json(data)});
});

app.post('/api/workouts', (req, res) => {
  db.Workout.create({}).then((data) => {res.json(data)});
});

app.get('/api/workouts/range', (req, res) => {
  db.Workout.find({}).sort({day: -1}).limit(10).then((data) => {
    res.json(data);
  });
  
})


// db.Workout.create({ name: "Ernest Hemingway" })
//   .then(dbWorkout => {
//     console.log(dbWorkout);
//   })
//   .catch(({ message }) => {
//     console.log(message);
//   });

// app.get("/notes", (req, res) => {
//   db.Note.find({})
//     .then(dbNote => {
//       res.json(dbNote);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

// app.get("/Workout", (req, res) => {
//   db.Workout.find({})
//     .then(dbWorkout => {
//       res.json(dbWorkout);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

// app.post("/submit", ({ body }, res) => {
//   db.Note.create(body)
//     .then(({ _id }) => db.Workout.findOneAndUpdate({}, { $push: { notes: _id } }, { new: true }))
//     .then(dbWorkout => {
//       res.json(dbWorkout);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

// app.get("/populatedWorkout", (req, res) => {
//   db.Workout.find({})
//     .populate("notes")
//     .then(dbWorkout => {
//       res.json(dbWorkout);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
