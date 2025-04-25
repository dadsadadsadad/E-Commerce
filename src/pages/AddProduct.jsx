import React, {useEffect, useState} from 'react'
import { db } from '../../firebase.js'
import { collection, addDoc } from 'firebase/firestore'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {useNavigate} from "react-router-dom";

export default function AddProduct() {

    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/no-access")
            }
        })

        return () => unsubscribe()
    }, [navigate])

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        gender: '',
        color: '',
    })
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [selectedSizes, setSelectedSizes] = useState([])
    const [stockBySize, setStockBySize] = useState({})

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const toggleSize = size => {
        setSelectedSizes(prev => {
            const newSizes = prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]

            setStockBySize(prevStock => ({
                ...prevStock,
                [size]: prev.includes(size) ? 0 : (prevStock[size] || 0),
            }))

            return newSizes
        })
    }

    const handleStockChange = (size, value) => {
        setStockBySize(prev => ({
            ...prev,
            [size]: value ? parseInt(value) : 0,
        }))
    }

    const uploadImageToCloudinary = async (image) => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'upload_preset')

        const res = await fetch('https://api.cloudinary.com/v1_1/dkunxxs0h/image/upload', {
            method: 'POST',
            body: data,
        })

        const json = await res.json()
        return json.secure_url
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!imageFile) return alert("Please upload an image")
        setLoading(true)

        const auth = getAuth()
        const user = auth.currentUser

        if (!user) {
            alert("No user logged in!")
            setLoading(false)
            return
        }

        const userId = user.uid

        try {
            const imageUrl = await uploadImageToCloudinary(imageFile)

            const productData = {
                ...form,
                price: parseFloat(form.price),
                size: selectedSizes,
                stockBySize,
                image: imageUrl,
                userId,
                createdAt: new Date().toISOString(),
            }

            await addDoc(collection(db, 'products'), productData)

            alert("Product added!")

            setForm({
                name: '',
                description: '',
                price: '',
                category: '',
                gender: '',
                color: ''
            })
            setImageFile(null)
            setSelectedSizes([])
            setStockBySize({})
        } catch (err) {
            console.error(err)
            alert("Error uploading product")
        }
        setLoading(false)
    }

    return (
        <div className='max-w-2xl mx-auto p-4'>
            <h2 className='text-xl font-semibold mb-4'>Add Product</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <input type='text' name='name' value={form.name} onChange={handleChange} placeholder='Product Name' className='w-full border rounded px-3 py-2' required autoComplete="off" />
                <textarea name='description' value={form.description} onChange={handleChange} placeholder='Product Description' className='w-full border rounded px-3 py-2' rows='3' required autoComplete="off" />
                <input type='number' name='price' value={form.price} onChange={handleChange} placeholder='Price' className='w-full border rounded px-3 py-2' required autoComplete="off" />

                <select name='category' value={form.category} onChange={handleChange} className='w-full border rounded px-3 py-2' required autoComplete="off">
                    <option value=''>Select Category</option>
                    <option value='Shirt'>Shirt</option>
                    <option value='Pants'>Pants</option>
                    <option value='Hoodie'>Hoodie</option>
                    <option value='Jacket'>Jacket</option>
                </select>

                <select name='gender' value={form.gender} onChange={handleChange} className='w-full border rounded px-3 py-2' required autoComplete="off">
                    <option value=''>Select Gender</option>
                    <option value='Men'>Men</option>
                    <option value='Women'>Women</option>
                    <option value='Unisex'>Unisex</option>
                </select>

                <input type='text' name='color' value={form.color} onChange={handleChange} placeholder='Color (e.g., Red, Blue)' className='w-full border rounded px-3 py-2' required autoComplete="off" />

                <div>
                    <label className='block mb-1'>Sizes</label>
                    <div className='flex flex-wrap gap-2'>
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <button
                                type='button'
                                key={size}
                                onClick={() => toggleSize(size)}
                                className={`px-3 py-1 border rounded ${selectedSizes.includes(size) ? 'bg-black text-white' : 'bg-white'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedSizes.length > 0 && (
                    <div className='mt-4'>
                        {selectedSizes.map(size => (
                            <div key={size} className='flex items-center mb-2'>
                                <label className='w-20'>{size} Stock:</label>
                                <input
                                    type='number'
                                    value={stockBySize[size] || 1}
                                    onChange={e => handleStockChange(size, e.target.value)}
                                    className='w-full border rounded px-3 py-2'
                                    min='1'
                                />
                            </div>
                        ))}
                    </div>
                )}

                <input type='file' accept='image/*' onChange={e => setImageFile(e.target.files[0])} className='w-full border rounded px-3 py-2' required />

                <button type='submit' disabled={loading} className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800'>
                    {loading ? 'Uploading...' : 'Add Product'}
                </button>
            </form>
        </div>
    )
}
