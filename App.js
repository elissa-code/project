import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Authentication states
  const [isSignup, setIsSignup] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // CRUD states
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentClass, setCurrentClass] = useState(null); // for editing
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await fetch('http://localhost:2000/api/get');
      const data = await res.json();
      setClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  // Fetch report data
  const fetchReport = async () => {
    try {
      const res = await fetch('http://localhost:2000/api/report');
      const reportData = await res.json();
      console.log('Report Data:', reportData);
      alert(`Total Users: ${reportData.totalUsers}\nTotal Classes: ${reportData.totalClasses}`);
      // You can enhance this to display the report in the UI
    } catch (err) {
      console.error('Error fetching report:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchClasses();
    }
  }, [userId]);

  // Handle signup/login
  const handleAuth = async () => {
    const url = isSignup ? 'http://localhost:2000/api/signup' : 'http://localhost:2000/api/login';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.message) {
        setAuthMessage(data.message);
        if (data.userId) {
          setUserId(data.userId);
        }
      }
    } catch (err) {
      setAuthMessage('Server error');
    }
  };

  // CRUD operations for classes
  const handleAddClass = async () => {
    try {
      await fetch('http://localhost:2000/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age }),
      });
      fetchClasses();
      setName('');
      setAge('');
    } catch (err) {
      console.error('Add class error:', err);
    }
  };

  const handleUpdateClass = async () => {
    if (!currentClass) return;
    try {
      await fetch(`http://localhost:2000/api/put/${currentClass.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age }),
      });
      fetchClasses();
      setCurrentClass(null);
      setName('');
      setAge('');
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await fetch(`http://localhost:2000/api/delete/${id}`, {
        method: 'DELETE',
      });
      fetchClasses();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Logout
  const handleLogout = () => {
    setUserId(null);
    setAuthMessage('');
    setCurrentClass(null);
    setUsername('');
    setPassword('');
  };

  // Render login/signup form if not authenticated
  if (!userId) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuth();
          }}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <label>Username:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '8px', marginBottom: '10px' }}
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '8px', marginBottom: '10px' }}
          />
          <button type="submit" style={{ padding: '8px' }}>
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setAuthMessage('');
            }}
            style={{ marginLeft: '10px' }}
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
        {authMessage && <p style={{ color: 'red', textAlign: 'center' }}>{authMessage}</p>}
      </div>
    );
  }

  // Main authenticated UI
  return (
    <div style={{ maxWidth: '700px', margin: '20px auto' }}>
      <h2>Class Management</h2>
      <button onClick={() => { setCurrentClass(null); setName(''); setAge(''); }} style={{ marginBottom: '10px' }}>
        Add New Class
      </button>
      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
        <h3>{currentClass ? 'Edit Class' : 'Add Class'}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentClass) {
              handleUpdateClass();
            } else {
              handleAddClass();
            }
          }}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '8px' }}
          />
          <input
            placeholder="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '8px' }}
          />
          <button type="submit">{currentClass ? 'Update' : 'Add'} Class</button>
        </form>
      </div>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? (
            classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{cls.age}</td>
                <td>
                  <button
                    onClick={() => {
                      setCurrentClass(cls);
                      setName(cls.name);
                      setAge(cls.age);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClass(cls.id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No classes available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={fetchReport} style={{ marginRight: '10px' }}>Get Report</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;