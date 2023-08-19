import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyCookie } from '../utils/authFunctions';
import Loader from '../components/Loader';
const Chat = () => {
    const navigate = new useNavigate();
    const [load, setLoad] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            verifyCookie("/chat", setLoad, navigate, false,"/");
        }, 500);
        setLoad(true)
    }, [])
    return (
        <>
            {load ? (<Loader />) : (
                <div>
                    Chatting Here
                </div>
            )}
        </>
    )
}

export default Chat
