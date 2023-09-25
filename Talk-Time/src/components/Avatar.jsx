import React from 'react'
import { useState,useEffect } from 'react';
const Avatar = ({ userid,online }) => {
    const makeColorCode = (userid) => {
        const hexString = userid;

        // Convert hexadecimal to decimal
        const decimalNumber = parseInt(hexString, 16);

        // Scale the decimal number to the range 500-900
        const scaledNumber = ((decimalNumber % 401) + 500);
        const ans = Math.round(scaledNumber / 100) * 100;
        // console.log(ans);
        setcolorCode(ans);
        // return scaledNumber;
    }
    useEffect(()=>{
        makeColorCode(userid)
    },[])
    const [colorCode, setcolorCode] = useState("200")
    return (
        <div className={'w-8 h-8 relative rounded-full bg-rose-600'}>
            {
                online && <div className='absolute w-3 h-3 bg-lime-600 rounded-full border border-white'></div>
            }
        </div>
    )
}
export default Avatar