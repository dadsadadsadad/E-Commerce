import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase.js'
import { ShopContext } from '../context/ShopContext.jsx'
import Title from '../components/Title.jsx'
import ProductItem from '../components/ProductItem.jsx'

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!user) {
        navigate('/no-access')
        return
      }
      try {
        const ordersCol = collection(db, 'users', user.uid, 'orders')
        const snapshot = await getDocs(ordersCol)
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setOrders(data)
      } catch (err) {
        console.error('Error fetching orders:', err)
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [navigate])

  if (loading) {
    return <p className="p-4 text-center">Loading your orders...</p>
  }

  return (
      <div className="border-t pt-16">
        <div className="text-2xl px-4">
          <Title text1={'MY'} text2={' ORDERS'} />
        </div>

        {orders.length === 0 ? (
            <p className="mt-6 text-center text-gray-600">You have no orders yet.</p>
        ) : (
            orders.map(order => (
                <div
                    key={order.id}
                    className="py-4 border-t border-b text-gray-700 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="flex items-start gap-6">
                    <ProductItem
                        id={order.productId}
                        name={order.name}
                        image={order.image}
                        price={order.price}
                    />
                    <div className="flex flex-col gap-1 text-sm">
                      <p>Quantity: {order.quantity}</p>
                      {order.size && <p>Size: {order.size}</p>}
                    </div>
                  </div>
                </div>
            ))
        )}
      </div>
  )
}

export default Orders
