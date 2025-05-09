import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import CollectionPage from './pages/CollectionPage.jsx'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SellButton from './components/SellButton'
import AddProduct from "./pages/AddProduct.jsx";
import Search from "./pages/Search.jsx";
import SearchBar from "./components/SearchBar.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import NoAccess from "./pages/NoAccess.jsx";


const App = () => {
    return (
        <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
            <Navbar />
            <SearchBar/>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/collection' element={<CollectionPage/>} />
                <Route path='/about' element={<About/>} />
                <Route path='/contact' element={<Contact/>} />
                <Route path='/product/:productId' element={<Product/>} />
                <Route path='/cart' element={<Cart/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/place-order' element={<PlaceOrder/>} />
                <Route path='/orders' element={<Orders/>} />
                <Route path='/add-product' element={<AddProduct/>} />
                <Route path='search' element={<Search/>} />
                <Route path='accountpage' element={<AccountPage/>} />
                <Route path='no-access' element={<NoAccess/>} />
            </Routes>
            <Footer/>
            <SellButton/>
        </div>
  )           
}                       

export default App
