import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Bot } from '../../public/Bot'
import './SignInPage.css';

const SignInPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Perform sign-in logic here
    alert(`Username: ${username}, Password: ${password}`);
  };

  return (
    <div className='parent'>
        <div className="canvas-container">
            <Canvas>
                <ambientLight />
                <OrbitControls enableZoom={false} />
                <Suspense fallback={null}>
                <Bot />
                </Suspense>
            </Canvas>
        </div>
        <div className="container">
            <div className="login-image">
                <img src="/public/login.png" alt="img" />
            </div>
            <div className="login-form">
                <h2>Sign In</h2>
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
                <button onClick={handleSignIn}>Sign In</button>
            </div>
        </div>
    </div>
  );
};

export default SignInPage;
