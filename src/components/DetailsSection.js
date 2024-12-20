import React from 'react';
import './DetailsSection.css';

const DetailsSection = ({ details }) => {
    return (
        <div className="details-section">
            <h3>Rincian Perjalanan</h3>
            {details.map((detail, index) => (
                <div key={index} className="detail-item">
                    <span>{detail.label}</span>
                    <span>{detail.cost}</span>
                </div>
            ))}
        </div>
    );
};

export default DetailsSection;