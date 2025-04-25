import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase.js'

const Login = () => {

    const [currentState, setCurrentState] = useState('Sign up')
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUserName] = useState('')

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            //if sign up is valid, stores the email and username in the database
            const userCollection = collection(db, 'users')
            const userDocument = doc(userCollection, user.uid)
            const newContent = {
                email: user.email,
                username: username,
            }
            await setDoc(userDocument, newContent)
            await updateProfile(user, {
                displayName: username
            })
            navigate('/home')

        } catch (error) {
            //gives an error thrown by firebase
            console.log(error.code, error.message)
            alert(error.message)
        }
    };

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(`Welcome back, ${user.displayName}`)
            navigate('/home')
        } catch (error) {
            console.log(error.code, error.message)
        }
    }

    return (
        <>
            return (
            <form onSubmit={currentState === 'Sign up' ? handleSignUp : handleSignIn} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
                <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                    <p className='prata-regular text-3xl'>{currentState}</p>
                    <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
                </div>
                {currentState === 'Login' ? '' : <input type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/>}
                <input type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
                <input type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
                <div className='w-full flex justify-between text-sm mt-[-8px]'>
                    <p className=' cursor-pointer'>Forgot your password?</p>
                    {
                        currentState === 'Login'
                            ? <p onClick={()=>setCurrentState('Sign up')} className=' cursor-pointer'>Create acccount</p>
                            : <p onClick={()=>setCurrentState('Login')} className=' cursor-pointer'>Login here</p>
                    }
                </div>
                <button className='bg-black text-white font-light px-8 px-2 mt-4'>{currentState === 'Login' ? 'Sign in' : 'Sign up'}</button>
            </form>
            )
        </>
    );
};

export default Login;
