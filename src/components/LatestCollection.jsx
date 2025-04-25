import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const getProducts = async () => {
            try {
                const itemsRef = await getDocs(collection(db, 'products'))
                const items = itemsRef.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setProducts(items)
            } catch (err) {
                console.error('Error getting products:', err)
            }
        }

        getProducts()
    }, [])

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'LATEST'} text2={' PRODUCTS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Explore our complete range of items available in the store.
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    products.map((item) => (
                        <ProductItem
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            price={item.price}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller
