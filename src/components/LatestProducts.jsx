import React, { useEffect, useState } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'
import { db } from '../../firebase'
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"

const LatestProducts = () => {
    const [latestProducts, setLatestProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                // query to get the latest 5 products by createdAt descending
                const q = query(
                    collection(db, 'products'),
                    orderBy('createdAt', 'desc'),
                    limit(5)
                )
                const querySnapshot = await getDocs(q)
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                //put the result of the query into latestproducts
                setLatestProducts(productsData)
            } catch (error) {
                console.error("Error fetching products: ", error)
            } finally {
                setLoading(false)
            }
        }

        fetchLatestProducts()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'LATEST'} text2={' PRODUCTS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam repellat adipisci, perspiciatis in consequatur ab maiores odio. Molestias dolor, hic, eaque blanditiis excepturi odio, consequatur mollitia in placeat nisi necessitatibus.
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {latestProducts.map(item => (
                    <ProductItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        image={item.image}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    )
}

export default LatestProducts
