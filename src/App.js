import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
      navigate('/welcome');
    } else {
      setError('Invalid user. Please signup first.');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={handleLogin} className="form-button">Login</button>
      {error && <p className="error-message">{error}</p>}
      <p>Don't have an account? <a href="/signup">Signup here</a></p>
    </div>
  );
}

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    if (username && password) {
      localStorage.setItem('user', JSON.stringify({ username, password }));
      navigate('/');
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={handleSignup} className="form-button">Signup</button>
    </div>
  );
}

function Welcome() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [mail, setMail] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:8080/student')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
  };

  const handleAddOrUpdateStudent = () => {
    if (editMode) {
      axios.put(`http://localhost:8080/student/${currentStudentId}`, { name, age, mail })
        .then(() => {
          fetchStudents();
          setEditMode(false);
          setName('');
          setAge('');
          setMail('');
        })
        .catch(error => console.error('Error updating student:', error));
    } else {
      const newStudent = { name, age, mail };
      axios.post('http://localhost:8080/student', newStudent)
        .then(() => {
          fetchStudents();
          setName('');
          setAge('');
          setMail('');
        })
        .catch(error => console.error('Error adding student:', error));
    }
  };

  const handleEditStudent = (student) => {
    setEditMode(true);
    setCurrentStudentId(student.id);
    setName(student.name);
    setAge(student.age);
    setMail(student.mail);
  };

  const handleDeleteStudent = (id) => {
    axios.delete(`http://localhost:8080/student/${id}`)
      .then(() => fetchStudents())
      .catch(error => console.error('Error deleting student:', error));
  };

  return (
    <div className="welcome-container">
      <h2>Welcome to the Mental Illness Awareness Page</h2>
      <p>Your mental health is important. Take a moment to relax and focus on your well-being.</p>

      <h2>Student List</h2>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            {student.name} (Age: {student.age}, Email: {student.mail})
            <button onClick={() => handleEditStudent(student)} className="form-button">Edit</button>
            <button onClick={() => handleDeleteStudent(student.id)} className="form-button">Delete</button>
          </li>
        ))}
      </ul>

      <h2>{editMode ? 'Edit Student' : 'Add Student'}</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="input-field"
      />
      <input
        type="email"
        placeholder="Email"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        className="input-field"
      />
      <button onClick={handleAddOrUpdateStudent} className="form-button">
        {editMode ? 'Update Student' : 'Add Student'}
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
