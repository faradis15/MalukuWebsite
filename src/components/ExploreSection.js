import React, { useState, useEffect, useRef } from 'react';
import './ExploreSection.css';

const ExploreSection = ({ destination, onExplore, onAddList }) => {
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState('');
    const [details, setDetails] = useState(null);
    const [totalCost, setTotalCost] = useState(0);
    const [notFound, setNotFound] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const exploreRef = useRef(null); // Ref untuk mendeteksi klik di luar elemen

    const options = ["Surabaya", "Jakarta", "Yogyakarta"];

    const isValidDestination = (dest) => {
        const validDestinations = ['banda neira', 'pantai ora', 'kei island', 'gunung binaiya'];
        return validDestinations.includes(dest.toLowerCase());
    };

    const getFlightDetails = (location) => {
        switch (location.toLowerCase()) {
            case 'yogyakarta':
                return { label: 'Yogyakarta (YIA)', cost: 'Rp. 2.765.999' };
            case 'surabaya':
                return { label: 'Surabaya (SUB)', cost: 'Rp. 2.017.900' };
            default:
                return { label: 'Jakarta (CGK)', cost: 'Rp. 1.832.700' };
        }
    };

    const handleExplore = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (!isValidDestination(destination)) {
                setNotFound(true);
                setDetails(null);
                setTotalCost(0);
                return;
            }

            setNotFound(false);
            const flight = getFlightDetails(location);

            let costDetails = [
                { label: 'Destinasi', cost: destination },
                { label: `Tiket Pesawat ${flight.label} - Ambon (AMQ)`, cost: flight.cost },
            ];

            if (destination.toLowerCase() === 'pantai ora') {
                costDetails = [
                    ...costDetails,
                    { label: 'Transportasi Darat di Ambon (dari Bandara ke Pelabuhan Tulehu)', cost: 'Rp. 250.000' },
                    { label: 'Tiket Kapal Laut', cost: 'Rp. 150.000' },
                    { label: 'Transportasi Darat (dari pelabuhan ke Desa Saleman)', cost: 'Rp. 300.000' },
                    { label: 'Penyebrangan Desa Saleman ke Ora Resort', cost: 'Rp. 25.000' },
                ];
            } else if (destination.toLowerCase() === 'kei island') {
                costDetails = [
                    ...costDetails,
                    { label: 'Transportasi Darat (dari Bandara ke Pelabuhan Yosuedarso)', cost: 'Rp. 250.000' },
                    { label: 'Tiket Kapal Pelni Ambon (AMQ) - Langgur (LUV)', cost: 'Rp. 325.500' },
                    { label: 'Transportasi Darat (dari Pelabuhan ke Penginapan)', cost: 'Rp. 25.000' },
                ];
            } else if (destination.toLowerCase() === 'gunung binaiya') {
                costDetails = [
                    ...costDetails,
                    { label: 'Transportasi Darat (dari Bandara ke Pelabuhan Tulehu)', cost: 'Rp. 250.000' },
                    { label: 'Tiket Kapal Laut (Tulehu - Masohi)', cost: 'Rp. 150.000' },
                    { label: 'Transportasi Darat (dari Pelabuhan Masohi ke Desa Tehoru)', cost: 'Rp. 250.000' },
                ];
            } else {
                costDetails = [
                    ...costDetails,
                    { label: 'Transportasi Darat (dari Bandara ke Pelabuhan Tulehu)', cost: 'Rp. 250.000' },
                    { label: 'Tiket Kapal Laut', cost: 'Rp. 500.000' },
                    { label: 'Transportasi Darat (dari pelabuhan ke penginapan)', cost: 'Rp. 10.000' },
                ];
            }

            setDetails(costDetails);
            const total = costDetails.reduce((sum, item) => {
                const numericValue = parseInt(item.cost.replace(/[^\d]/g, ''), 10) || 0;
                return sum + numericValue;
            }, 0);
            setTotalCost(total);
            onExplore(costDetails);
        }, 3000);
    };

    const handleAddList = () => {
        if (details) {
            onAddList(details);
            setDetails(null);
        }
    };

    const handleInputFocus = () => {
        setSuggestions(options); // Tampilkan opsi saat input difokuskan
    };

    const handleOptionClick = (option) => {
        setLocation(option); // Pilih opsi dan masukkan ke input
        setSuggestions([]); // Sembunyikan daftar opsi
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocation(value);

        // Jika input kosong, tampilkan semua opsi
        if (value === '') {
            setSuggestions(options);
        } else {
            // Jika input tidak kosong, sembunyikan opsi jika cocok
            const isOptionMatched = options.some(option => option.toLowerCase() === value.toLowerCase());
            if (isOptionMatched) {
                setSuggestions([]);
            } else {
                setSuggestions(options.filter(option => 
                    option.toLowerCase().includes(value.toLowerCase())
                ));
            }
        }
    };

    const handleClickOutside = (event) => {
        if (exploreRef.current && !exploreRef.current.contains(event.target)) {
            setSuggestions([]); // Sembunyikan opsi jika klik di luar elemen
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="explore-section" ref={exploreRef}>
            {loading ? (
                <p>Loading...</p>
            ) : notFound ? (
                <p style={{ color: 'red', fontWeight: 'bold' }}>Not Found</p>
            ) : (
                <>
                    <h2>Explore {destination}</h2>
                    <img
                        src={`${process.env.PUBLIC_URL}/images/${destination.replace(/ /g, '_')}.png`}
                        alt={destination}
                    />
                    <div className="location-container">
                        <input
                            type="text"
                            placeholder="Masukkan lokasi terkini"
                            className="location-input"
                            value={location}
                            onFocus={handleInputFocus}
                            onChange={handleInputChange}
                        />
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((option, index) => (
                                    <li
                                        key={index}
                                        className="suggestion-item"
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        {option}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button className="explore-button" onClick={handleExplore}>Explore</button>
                    {details && (
                        <div className="details-section">
                            {details.map((item, index) => (
                                <div className="detail-item" key={index}>
                                    <span className="detail-label">{item.label}:</span>
                                    <span className="detail-cost">{item.cost}</span>
                                </div>
                            ))}
                            <div className="total-cost">
                                Total Keseluruhan: Rp. {totalCost.toLocaleString('id-ID')}
                                <button
                                    className="add-list-button"
                                    onClick={handleAddList}
                                >
                                    Add List
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ExploreSection;
