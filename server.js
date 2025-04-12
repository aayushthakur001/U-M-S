const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;
const Joi = require('joi');

let students = [];
let id = 1;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Joi schema for validating student data
const studentSchema = Joi.object({
  name: Joi.string().min(3).required(),
  grade: Joi.string().min(1).required()
});

app.get('/api/students', (req, res) => res.json(students));

// ✅ POST with validation
app.post('/api/students', (req, res) => {
  const { error, value } = studentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const student = { id: id++, ...value };
  students.push(student);
  res.json(student);
});

// ✅ PUT with validation
app.put('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).send('Student not found');
  }

  const { error, value } = studentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  student.name = value.name;
  student.grade = value.grade;
  res.json(student);
});

app.delete('/api/students/:id', (req, res) => {
  students = students.filter(s => s.id !== parseInt(req.params.id));
  res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`School Management Website running at http://localhost:${PORT}`);
});
