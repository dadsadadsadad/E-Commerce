import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase.js'
import { ShopContext } from '../context/ShopContext.jsx'
import Title from '../components/Title.jsx'
import ProductItem from '../components/ProductItem.jsx'
import {products} from "../assets/assets.js";

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
        const itemsCol = collection(db, 'products')
        const itemsSnapshot = await getDocs(itemsCol)

        const productsMap = {}
        itemsSnapshot.docs.forEach(doc => {
          productsMap[doc.id] = doc.data()
        })

        const data = snapshot.docs.map(doc => {
          const orderData = doc.data()
          const product = productsMap[orderData.productId] || {}
          const image = Array.isArray(product.image) ? product.image[0] : product.image

          return {
            id: doc.id,
            ...orderData,
            image
          }
        })

        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders with product images:', error)
      }
      finally {
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
