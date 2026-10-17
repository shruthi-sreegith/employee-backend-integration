// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname + '/dist/FrontEnd')));

// Task2: create mongoDB connection
mongoose.connect('mongodb+srv://shruthi225084_db_user:6L21v4H5bSFVdQ0f@cluster0.tjpwqmg.mongodb.net/')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Connection error:', err));

// Employee Schema and Model
const employeeSchema = new mongoose.Schema({
  name: String,
  location: String,
  position: String,
  salary: Number
});

const Employee = mongoose.model('employee', employeeSchema);


// Task 2 : write api with error handling and appropriate api mentioned in the TODO below

// TODO: get data from db using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
  try {
    const data = await Employee.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TODO: get single data from db using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
  try {
    const data = await Employee.findById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TODO: send data from db using api '/api/employeelist'
app.post('/api/employeelist', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TODO: update a row in db using api '/api/employeelist' or '/api/employeelist/:id'
app.put('/api/employeelist/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// TODO: delete a row from db using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve frontend for all other routes
app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/FrontEnd/index.html'));
});

// Listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});