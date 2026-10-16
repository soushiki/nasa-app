import React from 'react'

export default function Main({data}) {
    if (data?.media_type === 'video') {
        // YouTube/Vimeo links come back as embed URLs; direct video files use <video>
        const isEmbed = !/\.(mp4|webm|ogg)(\?.*)?$/i.test(data?.url || '');
        return (
            <div className="imgContainer videoContainer">
                {isEmbed ? (
                    <iframe
                        className="bgVideo"
                        src={data?.url}
                        title={data?.title || 'APOD video'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video className="bgVideo" src={data?.url} controls autoPlay muted loop playsInline />
                )}
            </div>
        )
    }

    return (
        <div className="imgContainer" >
            <img className="bgImage" src={data?.hdurl || data?.url} alt={data?.title || 'bg-img' } />
        </div>
    )  
}
