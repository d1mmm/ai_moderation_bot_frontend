import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../matrixStyles.css';

const LoginPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setShowForm(true);
        }, 4000);
    }, []);

    const handleRegisterClick = async () => {
        navigate('/register');
    };

    const handleLoginClick = async () => {
        let hasError = false;

        if (username.trim() === '') {
            setError('Username cannot be empty.');
            hasError = true;
        } else if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setError('');
        try {
          const response = await fetch("http://127.0.0.1:8000/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          if (!response.ok) {
              throw new Error(data.detail || "Registration failed");
          }
          
          localStorage.setItem("Token", data.token)

          if(data.role === 'admin')
          {
            // alert('Welcome to admin page')
            navigate('/admin')
          }

          if(data.role === 'user')
          {
            // alert('Welcome to user page')
            navigate('/user')
          }
      } catch (err) {
          setError(err.message);
      }
    };

    return (
        <div className="container">
            <div className="welcome-text">
                Welcome to the portal
            </div>
            {showForm && (
                <div className="form-container">
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
                    <div>
                        <button onClick={handleLoginClick}>Login</button>
                        <button onClick={handleRegisterClick}>Register</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
