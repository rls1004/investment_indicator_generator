import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Card.css'

function Card({ name, link, exch, ticker }) {
    return (
        <div>
            <div className="result">
                <h3>{name}</h3>
                <p>{exch} | {ticker}</p>
            </div>
            <div className="confirm">
                <span className="right">right?</span>
                <Link
                    to={{
                        pathname: '/detail',
                        state: {name, link, exch, ticker},
                    }}
                >
                    <button className="next">
                        <span>Next</span>
                    </button>
                </Link>
            </div>
        </div>
    )
}

Card.propTypes = {
    link: PropTypes.string.isRequired
};

export default Card;