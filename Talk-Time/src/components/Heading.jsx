import React from 'react'

const Heading = ({heading}) => {
    return (
        <>
            <div className="sm:text-1xl md:text-3xl lg:text-4xl mb-10 font-extrabold ...">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-500">
                    Welcome To TalkTime <br/>
                    {heading}
                </span>
            </div>
        </>
    )
}

export default Heading
