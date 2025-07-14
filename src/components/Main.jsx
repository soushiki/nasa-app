import React from 'react'

export default function Main({data}) {
    return (
        <div className="imgContainer" >
            <img className="bgImage" src={data?.hdurl} alt={data?.title || 'bg-img' } />
        </div>
    )  
}
