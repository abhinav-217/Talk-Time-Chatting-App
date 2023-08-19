import React from 'react'
import { Link } from 'react-router-dom'
import Heading from './Heading'
const HomePage = () => {
    return (
        <div className='h-screen flex justify-center items-center flex-col bg-gradient-to-r from-blue-500 to-red-900'>
            <Heading/>
            <div className="sm:text-1xl sm:mx-5 md:mx-5 md:text-3xl lg:text-2xl mb-10 font-extrabold flex flex-col">
                <span className="transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 sm:mb-5 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-100 cursor-pointer">
                    Connect, Chat, and Explore: Welcome to Our Vibrant Community!
                </span>
                <span className="transition ease-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 bg-clip-text text-transparent bg-gradient-to-r from-red-100 to-blue-500 cursor-pointer">
                    Embrace Connection: Join Our Chat Community Today!
                </span>
            </div>
            <div className='flex flex-row'>
                <Link to="/auth/login"
                    id="submit-btn"
                    className="mx-5 sm:h-40 sm:w-40 md:h-24 md:w-24 lg:h-12 lg:w-40 text-white block w-full rounded-full transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 px-12 py-3  bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"
                >
                    Login
                </Link>
                <Link to="/auth/register" 
                    id="submit-btn"
                    className="text-white sm:h-40 sm:w-40 md:h-24 md:w-24 lg:h-12 lg:w-40 block w-full rounded-full transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 px-12 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500"
                >
                    Register
                </Link>
            </div>
        </div>
    )
}

export default HomePage
