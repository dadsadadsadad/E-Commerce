import React, { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useParams } from 'react-router-dom'

export default function ProductDetail() {
  const { productId } = useParams()
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const currency = '₱'

  // Fetch product data
  useEffect(() => {
    const getProduct = async () => {
      try {
        const productRef = doc(db, 'products', productId)
        const document = await getDoc(productRef)
        if (document.exists()) {
          setProductData({ id: document.id, ...document.data() })
          console.log(document.data())
        } else {
          console.log('Product not found')
        }
      } catch (err) {
        console.error('Error fetching product: ', err)
      } finally {
        setLoading(false)
      }
    }
    getProduct()
  }, [productId])

  // Check if product already in cart
  useEffect(() => {
    const checkIfInCart = async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user || !productData) return
      const cartRef = doc(db, 'users', user.uid, 'cart', productData.id)
      const cartItem = await getDoc(cartRef)
      if (cartItem.exists()) setAddedToCart(true)
    }
    checkIfInCart()
  }, [productData])

  const handleAddToCart = async () => {
    if (addedToCart) return
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return console.log('No user logged in')

    const userCartRef = doc(db, 'users', user.uid, 'cart', productData.id)
    try {
      await setDoc(userCartRef, {
        productId: productData.id,
        name: productData.name,
        price: productData.price,
        size,
        quantity
      })
      setAddedToCart(true)
      console.log('Added product to cart')
    } catch (error) {
      console.error('Error adding product to cart: ', error)
    }
  }

  const handleBuyNow = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return console.log('No user logged in')

    const userOrdersRef = doc(db, 'users', user.uid, 'orders', productData.id)
    try {
      await setDoc(userOrdersRef, {
        productId: productData.id,
        name: productData.name,
        price: productData.price,
        size: productData.size,
        quantity
      })
      console.log('Product ordered')
    } catch (error) {
      console.error('Error ordering product: ', error)
    }
    console.log('Proceeding to checkout with selected product')
  }

  if (loading) return <p>Loading product details...</p>
  if (!productData) return <p>Product not found</p>

  return (
      <div className="border-t-2 p-10 transition-opacity ease-in duration-500 opacity-100">
        <div className="flex flex-col sm:flex-row gap-12">
          {/* Images Section */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
              <img
                  src={productData.image}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt="Thumbnail"
                  onClick={() => { /* could set main image */ }}
              />
            </div>
            <div className="w-full sm:w-[80%]">
              <img className="w-full h-auto" src={productData.image} alt={productData.name} />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <h1 className="text-2xl font-medium mb-2">{productData.name}</h1>
            <p className="text-3xl font-semibold mb-4">{currency}{productData.price}</p>
            <p className="text-gray-500 mb-6">{productData.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <p className="mb-2 font-medium">Select Size:</p>
              <div className="flex gap-2 flex-wrap">
                {productData.size.map((s, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`px-4 py-2 border rounded ${size === s ? 'bg-black text-white' : 'bg-white'}`}
                    >
                      {s}
                    </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6 flex items-center gap-2">
              <p className="font-medium">Quantity:</p>
              <input
                  type="number"
                  value={quantity}
                  min={1}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-16 text-center border rounded px-2 py-1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`px-6 py-3 rounded text-white ${addedToCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
              >
                {addedToCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
              <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}
