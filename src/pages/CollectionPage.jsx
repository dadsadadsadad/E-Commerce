import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.js';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';
import { assets } from '../assets/assets.js';

const CollectionPage = () => {
    const [selectedFilters, setSelectedFilters] = useState({})
    const [items, setItems] = useState([])
    const [sortType, setSortType] = useState('relevant')
    const [showFilter, setShowFilter] = useState(true)

    const filters = {
        size: ['XS', 'S', 'M', 'L', 'XL'],
        color: ['Red', 'Blue', 'Green', 'Black', 'White'],
        gender: ['Men', 'Women', 'Unisex'],
        category: ['Shorts', 'Shirt', 'Jacket', 'Pants', 'Shoes', 'Accessories'],
        availability: ['In Stock', 'Out of Stock'],
        price: ['₱0 - ₱500', '₱500 - ₱1000', '₱1000 - ₱2000', '₱2000+']
    }

    const toggleFilter = (category, value) => {
        setSelectedFilters(prev => {
            const prevCategory = prev[category] || []
            const isSelected = prevCategory.includes(value)
            const updatedCategory = isSelected
                ? prevCategory.filter(v => v !== value)
                : [...prevCategory, value]

            return {
                ...prev,
                [category]: updatedCategory
            }
        })
    }

    const getItems = async () => {
        let queries = []

        if (selectedFilters.size?.length) {
            queries.push(where('size', 'array-contains-any', selectedFilters.size))
        }
        if (selectedFilters.color?.length) {
            queries.push(where('color', 'in', selectedFilters.color))
        }
        if (selectedFilters.gender?.length) {
            queries.push(where('gender', 'in', selectedFilters.gender))
        }
        if (selectedFilters.category?.length) {
            queries.push(where('category', 'in', selectedFilters.category))
        }
        if (selectedFilters.availability?.length) {
            queries.push(where('inStock', '==', selectedFilters.availability.includes('In Stock')))
        }

        const q = query(collection(db, 'items'), ...queries)
        const snapshot = await getDocs(q)
        const results = []
        snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }))
        setItems(results)
    }

    useEffect(() => {
        getItems()
    }, [selectedFilters])

    const sortedItems = [...items].sort((a, b) => {
        if (sortType === 'low-high') return a.price - b.price
        if (sortType === 'high-low') return b.price - a.price
        return 0;
    })

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

            {/* Filter Options */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
                    FILTERS
                    <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="toggle" />
                </p>

                {Object.entries(filters).map(([category, values]) => (
                    <div key={category} className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                        <p className='mb-3 text-sm font-medium'>{category.toUpperCase()}</p>
                        <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                            {values.map(value => (
                                <label key={value} className='flex gap-2'>
                                    <input
                                        type="checkbox"
                                        className='w-3'
                                        checked={selectedFilters[category]?.includes(value) || false}
                                        onChange={() => toggleFilter(category, value)}
                                    />
                                    {value}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Side */}
            <div className='flex-1'>

                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'ALL'} text2={' COLLECTIONS'} />
                    <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
                        <option value="relevant">Sort by: Relevant</option>
                        <option value="low-high">Sort by: Low to high</option>
                        <option value="high-low">Sort by: High to low</option>
                    </select>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-4'>
                    {sortedItems.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item.id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionPage;
