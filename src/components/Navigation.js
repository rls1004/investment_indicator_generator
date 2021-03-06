import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
    return (
        <div className="nav">
            <Link to="/" className='menu'>Home</Link>
            <Link to="/gen" className='menu'>Gen</Link>
        </div>
    );
}

export default Navigation;