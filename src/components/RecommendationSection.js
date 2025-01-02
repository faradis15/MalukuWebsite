import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendationSection.css';

const RecommendationSection = () => {
    const navigate = useNavigate();

    // Fungsi untuk menangani klik pada gambar
    const handleImageClick = (destination) => {
        console.log('Navigating to:', `/destination/${destination}`);
        navigate(`/destination/${destination}`); 
    };

    const recommendations = [
        {
            id: 'pantai-ora', 
            image: '/images/recomend1.png', 
            title: 'Pantai Ora', 
            team: 'Xperience Place', 
            readTime: 'Less than 1 min read', 
        },
        {
            id: 'banda-neira', 
            image: '/images/recomend2.png', 
            title: 'Banda Neira', 
            team: 'Xperience Place', 
            readTime: 'Less than 1 min read', 
        },
        {
            id: 'kei-island', 
            image: '/images/recomend3.png', 
            title: 'Kei Island', 
            team: 'Xperience Place', 
            readTime: 'Less than 1 min read', 
        },
        {
            id: 'gunung-binaiya', 
            image: '/images/recomend4.png', 
            title: 'Gunung Binaiya', 
            team: 'Xperience Place', 
            readTime: 'Less than 1 min read', 
        },
    ];    

    return (
        <div className="recommendation-section">
            <h2 className="section-title">Recommended Destinations</h2>
            <div className="image-container">
                {recommendations.map((item) => (
                    <div className="image-item" key={item.id} onClick={() => handleImageClick(item.id)}>
                        <img src={item.image} alt={item.title} className="recommendation-image" />
                        <div className="recommendation-content">
                            <h3 className="recommendation-title">{item.title}</h3>
                            <p className="recommendation-team">{item.team}</p>
                            <span className="recommendation-read-time">{item.readTime}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationSection;
