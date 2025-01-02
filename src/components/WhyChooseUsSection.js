import React from 'react';
import './WhyChooseUsSection.css';

const WhyChooseUsSection = () => {
  return (
    <div className="why-choose-us">
      <h2>Why prepared with Maluku Travel Mate?</h2>
      <div className="why-choose-us-items">
        <div className="why-item">
          <img src="/images/profile.png" alt="One place for all your needs" />
          <h3>One place for all your needs</h3>
          <p>Starting from flights, accommodation, to tourist attractions, just rely on us for the details of your trip.</p>
        </div>
        <div className="why-item">
          <img src="/images/date.png" alt="Flexible booking options" />
          <h3>Prepare your itinerary</h3>
          <p>Still confused about where to go in Maluku? All your answers are here.</p>
        </div>
        <div className="why-item">
          <img src="/images/money.png" alt="Secure & convenient payment" />
          <h3>The most flexible travel details</h3>
          <p>With details that are affordable, cheapest, and can reach all your dream destinations.</p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUsSection;
