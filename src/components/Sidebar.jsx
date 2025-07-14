import React from 'react'

export default function Sidebar({showModal, data}) {
    return (
        <div className="sidebar">
            <div onClick={showModal}className="bgOverlay"></div>
                <div className="sidebarContents">
                    <h2>{data?.title}</h2>
                    <div className="descriptionContainer">
                        <p className="descriptionTitle">{data?.date}</p>
                        <p>{data?.explanation}</p>
                    </div>
                    <button onClick={showModal}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
            </div>
        </div>
    )
}
