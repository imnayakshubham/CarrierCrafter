import { Button } from "@chakra-ui/react";
import "./NoPageFound.css";
import { Link } from "react-router-dom";

export const NoPageFound = () => {

    return (
        <div className='no__page__found'>
            <span className="no__page__found__error">404</span>
            <p className="no__page__found__info">PAGE NOT FOUND</p>
            <p className="no__page__found__sub__info">Look like you're lost</p>
            <Link to={"/"} className="link">BACK TO HOME</Link>
        </div>
    )
}
