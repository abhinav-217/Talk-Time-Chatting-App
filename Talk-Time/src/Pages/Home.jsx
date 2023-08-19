import React from 'react'
import { useEffect,useState } from 'react'
import Loader from '../components/Loader'
import HomePage from '../components/HomePage'
const Home = () => {
    const [load, setLoad] = useState(true)
    useEffect(() => {
        // check here that user is logged in or not if yes redirect him to main chat page else here
        setTimeout(() => {
            setLoad(false);
        }, 4000);
    }, [])
    
  return (
    <>
        {load ? (<Loader/>):(
            <HomePage/>
        )}
    </>
  )
}

export default Home

