import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import { ShopContext } from '../context/ShopContext.jsx'
import { assets } from '../assets/assets'

const Navbar = () => {
    const { setShowSearch } = useContext(ShopContext)
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [cartCount, setCartCount] = useState(0)
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    // Listen for auth changes to update user state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    // Fetch cart count whenever user changes
    useEffect(() => {
        const authInstance = getAuth()
        const unsubscribe = onAuthStateChanged(authInstance, async currentUser => {
            if (!currentUser) {
                setCartCount(0)
                return
            }

            try {
                const cartCol = collection(db, 'users', currentUser.uid, 'cart')
                const snapshot = await getDocs(cartCol)
                // sum up quantities if needed, here we just count documents
                setCartCount(snapshot.size)
            } catch (err) {
                console.error('Failed to get cart count', err)
                setCartCount(0)
            }
        })
        return () => unsubscribe()
    }, [])

    const handleLogout = async () => {
        try {
            await signOut(auth)
            navigate('/')
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    const toggleDropdown = () => {
        setDropdownVisible(prev => !prev)
    }

    return (
        <div className="flex items-center justify-between py-5 font-medium px-4 sm:px-10 border-b border-gray-200 relative z-50 bg-white">
            {/* Logo */}
            <Link to="/"><img src={assets.logo} className="w-36" alt="Logo" /></Link>

            {/* Desktop Nav Links */}
            <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
                {['/', '/collection', '/about', '/contact'].map((path, idx) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'font-semibold text-black' : ''}`}
                    >
                        <p>{['HOME', 'COLLECTION', 'ABOUT', 'CONTACT'][idx]}</p>
                    </NavLink>
                ))}
            </ul>

            {/* Right Section */}
            <div className="flex items-center gap-6 text-sm text-gray-700">
                {/* Search */}
                <img
                    onClick={() => setShowSearch(true)}
                    src={assets.search_icon}
                    className="w-5 cursor-pointer"
                    alt="Search"
                />

                {/* User Name */}
                <p className="hidden sm:block">{user?.displayName || 'Guest'}</p>

                {/* Profile Dropdown */}
                <div className="relative">
                    {user ? (
                        <>
                            <img
                                onClick={toggleDropdown}
                                src={assets.profile_icon}
                                className="w-5 cursor-pointer"
                                alt="Profile"
                            />
                            {dropdownVisible && (
                                <div className="absolute right-0 mt-4 w-36 bg-slate-100 text-gray-500 py-3 px-5 rounded shadow-md flex flex-col gap-2 z-50">
                                    <p onClick={() => navigate('/accountpage')} className="cursor-pointer hover:text-black">
                                        My Profile
                                    </p>
                                    <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">
                                        Orders
                                    </p>
                                    <p onClick={handleLogout} className="cursor-pointer hover:text-black">
                                        Sign Out
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <button onClick={() => navigate('/login')}>Sign In</button>
                    )}
                </div>

                {/* Cart Icon */}
                <Link to="/cart" className="relative">
                    <img src={assets.cart_icon} className="w-5" alt="Cart" />
                    {user && (
                        <span className="absolute right-[-5px] bottom-[-5px] w-4 h-4 text-[8px] flex items-center justify-center bg-black text-white rounded-full">
              {cartCount}
            </span>
                    )}
                </Link>

                {/* Mobile Menu Button */}
                <img
                    onClick={() => setSidebarVisible(true)}
                    src={assets.menu_icon}
                    className="w-5 cursor-pointer sm:hidden"
                    alt="Menu"
                />
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 right-0 h-full bg-white z-50 shadow-md transition-all duration-300 ${sidebarVisible ? 'w-3/4 p-5' : 'w-0 overflow-hidden'}`}>
                <div className="flex flex-col gap-4 text-gray-600">
                    <div onClick={() => setSidebarVisible(false)} className="flex items-center gap-4 cursor-pointer">
                        <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="Back" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setSidebarVisible(false)} className="py-2 border-b" to="/">
                        HOME
                    </NavLink>
                    <NavLink onClick={() => setSidebarVisible(false)} className="py-2 border-b" to="/collection">
                        COLLECTION
                    </NavLink>
                    <NavLink onClick={() => setSidebarVisible(false)} className="py-2 border-b" to="/about">
                        ABOUT
                    </NavLink>
                    <NavLink onClick={() => setSidebarVisible(false)} className="py-2 border-b" to="/contact">
                        CONTACT
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar
