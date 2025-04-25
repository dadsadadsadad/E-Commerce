import React, { useState, useEffect } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from '../../firebase.js'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'

const CollectionPage = () => {
    const [items, setItems] = useState([])
    const [sortType, setSortType] = useState('relevant')

    const getItems = async () => {
        try {
            const q = query(collection(db, 'products'))
            const snapshot = await getDocs(q)
            let results = []
            snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }))
            setItems(results)
        } catch (error) {
            console.error('Error getting items:', error)
        }
    }

    useEffect(() => {
        getItems()
    }, [])

    const sortedItems = [...items].sort((a, b) => {
        if (sortType === 'low-high') return a.price - b.price
        if (sortType === 'high-low') return b.price - a.price
        return 0
    })

    return (
        <div className='pt-10 border-t'>
            <div className='flex justify-between text-base sm:text-2xl mb-4'>
                <Title text1={'ALL'} text2={' COLLECTIONS'} />
                <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
                    <option value="relevant">Sort by: Relevant</option>
                    <option value="low-high">Sort by: Low to high</option>
                    <option value="high-low">Sort by: High to low</option>
                </select>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4'>
                {sortedItems.length === 0 ? (
                    <p>No items available</p>
                ) : (
                    sortedItems.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item.id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default CollectionPage
