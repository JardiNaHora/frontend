import React from 'react';
import {BsFillBellFill, BsPersonCircle, BsSearch, BsJustify, BsFillEnvelopeFill} from "react-icons/bs";

import "./styles.css";

export const Header = ({OpenDrawer}) => {
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenDrawer}/>
        </div>
        <div className='header-left'>
            <BsSearch className='icon'/>
        </div>
        <div className='header-right'>
            <BsFillBellFill className='icon'/>
            <BsFillEnvelopeFill className='icon'/>
            <BsPersonCircle className='icon'/>
        </div>
    </header>
  )
};