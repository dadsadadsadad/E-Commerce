import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    getAuth,
    updateProfile,
    updateEmail,
    updatePassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'
import {
    collection,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    deleteDoc
} from 'firebase/firestore'
import { auth, db } from '../../firebase'

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('account')
    const [user, setUser] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userProducts, setUserProducts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const auth = getAuth()
        const unsub = onAuthStateChanged(auth, user => {
            if (!user)
                navigate('/no-access')
            else
                setUser(user)
        })
        return () => unsub()
    }, [navigate])

    useEffect(() => {
        if (activeTab !== 'products' || !user)
            return
        const getUserProducts = async () => {
            const q = query(
                collection(db, 'products'),
                where('userId', '==', user.uid)
            )
            const snap = await getDocs(q)
            const prods = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            setUserProducts(prods)
        }
        getUserProducts()
    }, [activeTab, user])

    const handleProductChange = (idx, field, value) => {
        const updated = [...userProducts]
        updated[idx][field] = value
        setUserProducts(updated)
    }

    const handleUpdateProduct = async idx => {
        const prod = userProducts[idx]
        const ref = doc(db, 'products', prod.id)
        const payload = {
            name: prod.name,
            description: prod.description,
            price: parseFloat(prod.price),
            category: prod.category,
            gender: prod.gender,
            color: prod.color,
            sizes: prod.sizes || [],
            stockBySize: prod.stockBySize || {}
        }
        await updateDoc(ref, payload)
        alert('Product updated')
    }

    const handleDeleteProduct = async idx => {
        const prod = userProducts[idx]
        const ref = doc(db, 'products', prod.id)
        await deleteDoc(ref)
        const updated = [...userProducts]
        updated.splice(idx, 1)
        setUserProducts(updated)
        alert('Product removed')
    }

    const handleNameChange = async () => {
        try {
            await updateProfile(user, { displayName: name })
            alert('Name updated!')
        } catch (error) {
            alert(error.message)
        }
    }

    const handleEmailChange = async () => {
        try {
            await updateEmail(user, email)
            alert('Email updated!')
        } catch (error) {
            alert(error.message)
        }
    }

    const handlePasswordChange = async () => {
        try {
            await updatePassword(user, password)
            alert('Password updated!')
        } catch (error) {
            alert(error.message)
        }
    }

    const handleLogout = async () => {
        await signOut(auth)
        window.location.reload()
    }

    return (
        <div className="flex flex-col sm:flex-row p-6 gap-6">
            <div className="w-full sm:w-60 border-r">
                <button onClick={() => setActiveTab('account')} className="block w-full text-left py-2 hover:font-bold">
                    Account Settings
                </button>
                <button onClick={() => setActiveTab('products')} className="block w-full text-left py-2 hover:font-bold">
                    My Products
                </button>
            </div>

            <div className="flex-1">
                {activeTab === 'account' && user && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-2">Account Settings</h2>

                        <div>
                            <label className="block mb-1">Display Name - {user.displayName}</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border px-2 py-1"
                            />
                            <button onClick={handleNameChange} className="ml-2 px-2 py-1 bg-blue-500 text-white">Change</button>
                        </div>

                        <div>
                            <label className="block mb-1">Email - {user.email}</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border px-2 py-1"
                            />
                            <button onClick={handleEmailChange} className="ml-2 px-2 py-1 bg-blue-500 text-white">Change</button>
                        </div>

                        <div>
                            <label className="block mb-1">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border px-2 py-1"
                            />
                            <button onClick={handlePasswordChange} className="ml-2 px-2 py-1 bg-blue-500 text-white">Change</button>
                        </div>

                        <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white">Log Out</button>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-2">My Products</h2>
                        {userProducts.length === 0 ? (
                            <p>No products found</p>
                        ) : (
                            userProducts.map((prod, idx) => (
                                <div key={prod.id} className="border p-4 rounded space-y-4">
                                    <input
                                        type="text"
                                        value={prod.name}
                                        onChange={e => handleProductChange(idx, 'name', e.target.value)}
                                        placeholder="Product Name"
                                        className="w-full border px-3 py-2"
                                    />
                                    <textarea
                                        value={prod.description}
                                        onChange={e => handleProductChange(idx, 'description', e.target.value)}
                                        placeholder="Description"
                                        className="w-full border px-3 py-2"
                                        rows={3}
                                    />
                                    <input
                                        type="number"
                                        value={prod.price}
                                        onChange={e => handleProductChange(idx, 'price', e.target.value)}
                                        placeholder="Price"
                                        className="w-full border px-3 py-2"
                                    />
                                    <select
                                        value={prod.category}
                                        onChange={e => handleProductChange(idx, 'category', e.target.value)}
                                        className="w-full border px-3 py-2"
                                    >
                                        <option value="">Select Category</option>
                                        <option>Shirt</option>
                                        <option>Pants</option>
                                        <option>Hoodie</option>
                                        <option>Jacket</option>
                                    </select>
                                    <select
                                        value={prod.gender}
                                        onChange={e => handleProductChange(idx, 'gender', e.target.value)}
                                        className="w-full border px-3 py-2"
                                    >
                                        <option value="">Select Gender</option>
                                        <option>Men</option>
                                        <option>Women</option>
                                        <option>Unisex</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={prod.color}
                                        onChange={e => handleProductChange(idx, 'color', e.target.value)}
                                        placeholder="Color"
                                        className="w-full border px-3 py-2"
                                    />
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleUpdateProduct(idx)}
                                            className="bg-black text-white px-4 py-2 rounded"
                                        >
                                            Update Product
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(idx)}
                                            className="bg-red-600 text-white px-4 py-2 rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage
