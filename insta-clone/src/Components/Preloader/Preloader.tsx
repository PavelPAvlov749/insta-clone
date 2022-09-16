import React from "react";
import loader from "../../Media/6.gif"
import styles from "../../Styles/Preloader.module.css"

export const Preloader = ()=>{
    return (
        <>
            <img src={loader} alt="#" className={styles.loader}></img>
        </>
    )
}