import React, { useState, useEffect, useRef } from 'react';
import './SearchFooter.css'; 

const SearchFooter = ({ onSearch }) => {
    const [destination, setDestination] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [notFound, setNotFound] = useState(false); // State untuk "Not Found"
    const options = ["Banda Neira", "Pantai Ora", "Kei Island", "Gunung Binaiya"]; // Tambahkan "Gunung Binaiya"
    const searchRef = useRef(null);

    const handleInputFocus = () => {
        if (!options.includes(destination)) {
            setSuggestions(options); // Tampilkan opsi saat input difokuskan
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setDestination(value);

        // Sembunyikan opsi jika input cocok dengan salah satu pilihan
        if (options.includes(value)) {
            setSuggestions([]);
            setNotFound(false); // Reset "Not Found" jika destinasi valid
        } else {
            setSuggestions(options); // Tampilkan kembali opsi jika input dihapus atau tidak cocok
        }
    };

    const handleOptionClick = (option) => {
        setDestination(option); // Pilih opsi dan masukkan ke input
        setSuggestions([]); // Sembunyikan daftar opsi
        setNotFound(false); // Reset "Not Found" karena destinasi valid
    };

    const handleSearch = () => {
        if (destination === '' || !options.includes(destination)) {
            setNotFound(true); // Tampilkan "Not Found" jika destinasi tidak valid
        } else {
            setNotFound(false); // Reset "Not Found"
            onSearch(destination);
        }
        setDestination(''); // Reset input setelah pencarian
        setSuggestions([]); // Sembunyikan daftar opsi
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setSuggestions([]); // Sembunyikan opsi jika klik di luar elemen pencarian
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="search-footer" ref={searchRef}>
            <i className='bx bx-search-alt search-icon'></i> 
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Banda Neira, Pantai Ora, ..." 
                    className="search-input" 
                    value={destination}
                    onFocus={handleInputFocus}
                    onChange={handleInputChange}
                />
                {/* Tampilkan pesan "Not Found" di dalam blok pencarian */}
                {notFound && <p className="not-found-message">Not Found</p>}
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
            <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchFooter;
