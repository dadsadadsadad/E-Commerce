import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase.js';

const Login = () => {
    const [currentState, setCurrentState] = useState('Sign up');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/")
            }
        })
        return () => unsubscribe()
    }, [navigate])

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userCollection = collection(db, 'users');
            const userDocument = doc(userCollection, user.uid);
            const newContent = {
                email: user.email,
                username: username,
            };
            await setDoc(userDocument, newContent);
            //update display name for use
            await updateProfile(user, {
                displayName: username,
            });
            //after creating the account and is put in the db, go to the main page
            navigate('/');
        } catch (error) {
            console.log(error.code, error.message);
            alert(error.message);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            //go to main page if successful sign in, else give an error
            navigate('/');
        } catch (error) {
            console.log(error.code, error.message);
            alert(error.message);
        }
    };

    return (
        <form
            onSubmit={currentState === 'Sign up' ? handleSignUp : handleSignIn}
            className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
        >
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{currentState}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>

            {currentState === 'Login' ? null : (
                <input
                    type='text'
                    className='w-full px-3 py-2 border border-gray-800'
                    placeholder='Name'
                    required
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
            )}

            <input
                type='email'
                className='w-full px-3 py-2 border border-gray-800'
                placeholder='Email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type='password'
                className='w-full px-3 py-2 border border-gray-800'
                placeholder='Password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <p className='cursor-pointer'>Forgot your password?</p>
                {currentState === 'Login' ? (
                    <p onClick={() => setCurrentState('Sign up')} className='cursor-pointer'>
                        Create account
                    </p>
                ) : (
                    <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>
                        Login here
                    </p>
                )}
            </div>

            <button className='bg-black text-white font-light px-8 py-2 mt-4'>
                {currentState === 'Login' ? 'Sign in' : 'Sign up'}
            </button>
        </form>
    );
};

export default Login;
