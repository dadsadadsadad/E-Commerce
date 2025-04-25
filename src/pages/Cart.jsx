import React, { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, async user => {
            if (!user) {
                setCartItems([])
                setLoading(false)
                return
            }
            try {
                const cartCol = collection(db, 'users', user.uid, 'cart')
                const snapshot = await getDocs(cartCol)
                const detailed = await Promise.all(
                    snapshot.docs.map(async docSnap => {
                        const d = docSnap.data()
                        const prodRef = doc(db, 'products', d.productId)
                        const prodSnap = await getDoc(prodRef)
                        const prod = prodSnap.exists() ? prodSnap.data() : {}
                        return {
                            id: docSnap.id,
                            productId: d.productId,
                            size: d.size,
                            quantity: d.quantity,
                            name: prod.name,
                            price: prod.price,
                            image: Array.isArray(prod.image) ? prod.image[0] : prod.image
                        }
                    })
                )
                setCartItems(detailed)
            } catch (err) {
                console.error('Error fetching cart items', err)
            } finally {
                setLoading(false)
            }
        })
        return () => unsubscribe()
    }, [])

    if (loading) return <p>Loading cart...</p>

    const handleQuantityChange = async (index, newQty) => {
        if (newQty < 1) return
        const item = cartItems[index]
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) return
        const cartDocRef = doc(db, 'users', user.uid, 'cart', item.id)
        try {
            await updateDoc(cartDocRef, { quantity: newQty })
            const updated = [...cartItems]
            updated[index].quantity = newQty
            setCartItems(updated)
        } catch (err) {
            console.error('Failed to update quantity', err)
        }
    }

    const handleRemoveItem = async index => {
        const item = cartItems[index]
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) return
        const cartDocRef = doc(db, 'users', user.uid, 'cart', item.id)
        try {
            await deleteDoc(cartDocRef)
            const updated = [...cartItems]
            updated.splice(index, 1)
            setCartItems(updated)
        } catch (err) {
            console.error('Failed to remove item', err)
        }
    }

    return (
        <div className="border-t pt-14">
            <div className="text-2xl mb-3">
                <Title text1={'YOUR'} text2={' CART'} />
            </div>
            <div>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    cartItems.map((item, idx) => (
                        <div key={item.id} className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
                            <div className="flex items-start gap-6">
                                <img className="w-16 sm:w-20" src={item.image} alt={item.name} />
                                <div>
                                    <p className="text-xs sm:text-lg font-medium">{item.name}</p>
                                    <div className="flex items-center gap-5 mt-2">
                                        <p>₱{item.price}</p>
                                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                                    </div>
                                </div>
                            </div>
                            <input
                                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={e => handleQuantityChange(idx, parseInt(e.target.value))}
                            />
                            <img
                                className="w-4 mr-4 sm:w-5 cursor-pointer"
                                src={assets.bin_icon}
                                alt="remove"
                                onClick={() => handleRemoveItem(idx)}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Cart
