import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase.js'

const FloatingAddButton = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    //check to see if signed in or not to navigate to add product or to sign in page
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        });

        return () => unsubscribe()
    }, [])

    const handleClick = () => {
        if (user) {
            navigate('/addproduct')
        } else {
            console.log('Not logged in')
        }
    }

    return (
        <div className="fixed bottom-16 right-0 z-50 group">
            <button
                onClick={handleClick}
                className="w-36 group-hover:w-72 h-24 bg-black text-white rounded-s-full shadow-lg
                 transition-all duration-300 ease-in-out flex items-center justify-center px-8 overflow-hidden"
            >
                <span className="text-6xl group-hover:hidden">+</span>
                <span className="hidden group-hover:inline text-xl whitespace-nowrap">Sell a Product</span>
            </button>
        </div>
    );
}

export default FloatingAddButton;