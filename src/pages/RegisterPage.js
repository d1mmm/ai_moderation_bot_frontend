import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../matrixStyles.css';

const RegisterPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setShowForm(true);
        }, 4000);
    }, []);

    const handleRegisterClick = async () => {
        if (name.trim() === '') {
            setError('Name cannot be empty.');
            return;
        }

        if (username.trim() === '') {
            setError('Username cannot be empty.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setError('');
        try {
          const response = await fetch("http://127.0.0.1:8000/register", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, username, password, role }),
          });

          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.detail || "Registration failed");
          }

          alert("User registered successfully");
          navigate('/login');
      } catch (err) {
          setError(err.message);
      }
    };

    return (
        <div className="container">
            <div className="welcome-text">
                Register
            </div>
            {showForm && (
                <div className="form-container">
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    {error && <p className="error-message">{error}</p>}
                    
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    
                    <button onClick={handleRegisterClick}>Register</button>
                </div>
            )}
        </div>
    );
};

export default RegisterPage;
