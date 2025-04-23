import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase.js'

const Login = () => {

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

        </>
    );
};

export default Login;
