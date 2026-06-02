import React, { useState } from 'react';
import { useAuth } from './sky_auth'; // Import the custom hook we just made

export default function SkyLogin() {
  // Grab the 'login' function from our Auth Context
  const { login } = useAuth(); 

  const [employeeId, setEmployeeId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!employeeId || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      setLoading(true);
      
      // Mocking a backend check
      setTimeout(() => {
        if (employeeId.toUpperCase() === 'E001' && password === 'password123') {
          // Success! Send the user data to sky_auth
          login('E001', 'Super admin', 'John Doe');
          alert('Welcome Super Admin!');
        } else if (employeeId.toUpperCase() === 'E002' && password === 'password123') {
          // Success! Send the user data to sky_auth
          login('E002', 'user', 'Jane Smith');
          alert('Welcome User!');
        } else {
           setError('Invalid Employee ID or Password');
        }
        setLoading(false);
      }, 1000);

    } catch (err) {
      setError('An error occurred.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Login System</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Employee ID (e.g., E001)"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white' }}>
          {loading ? 'Processing...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}