import React from 'react'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import HomePage from '../components/HomePage'
import { verifyCookie } from '../utils/authFunctions'
import { useNavigate } from 'react-router-dom'
const Home = () => {
    const [load, setLoad] = useState(true)
    const navigate = new useNavigate();
    useEffect(() => {
        setTimeout(() => {
            verifyCookie("/chat",setLoad,navigate,false);
        }, 500);
        setLoad(true)
    }, [])

    return (
        <>
            {load ? (<Loader />) : (
                <HomePage />
            )}
        </>
    )
}

export default Home

