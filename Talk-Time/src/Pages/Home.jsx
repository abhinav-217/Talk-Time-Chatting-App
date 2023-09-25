import React from 'react'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import HomePage from '../components/HomePage'
import { verifyCookie,currentUseremail,currentUsername,currentUserid } from '../utils/authFunctions'
import { useNavigate } from 'react-router-dom'
const Home = () => {
    const [load, setLoad] = useState(true)
    const navigate = new useNavigate();
    // console.log("Username is: ",currentUsername)
    // console.log("UserEmail is: ",currentUseremail)
    // console.log("User id:- ",currentUserid)
    useEffect(() => {
        setTimeout(() => {
            verifyCookie("/chat",setLoad,navigate,true);
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

