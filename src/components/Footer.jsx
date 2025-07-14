import React from "react";

export default function Footer({showModal, data}) {

    return (
        <footer>
            <div>
                <h1>APOD Project</h1>
                <h2>{data?.title}</h2>
            </div>
            <button onClick={showModal}>
                <i className="fa-solid fa-circle-info"></i>
            </button>
            <div className="bgGradient"></div>
        </footer>
    );
}
