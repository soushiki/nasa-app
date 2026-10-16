import React from 'react'

export default function Main({data}) {
    if (data?.media_type === 'video' && data?.videoUrl) {
        return (
            <div className="imgContainer videoContainer">
                {data.videoKind === 'embed' ? (
                    <iframe
                        className="bgVideo"
                        src={data.videoUrl}
                        title={data?.title || 'APOD video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video className="bgVideo" src={data.videoUrl} poster={data?.hdurl} controls autoPlay muted loop playsInline />
                )}
            </div>
        )
    }

    return (
        <div className="imgContainer" >
            <img className="bgImage" src={data?.hdurl} alt={data?.alt || data?.title || 'bg-img' } />
        </div>
    )  
}
