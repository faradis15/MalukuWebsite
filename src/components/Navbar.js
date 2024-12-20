import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ savedLists, setSavedLists, showSearchFooter, selectedItems, setSelectedItems, isSelectMode, toggleSelectMode }) => {
    const [lastScrollY, setLastScrollY] = useState(0); // Mendefinisikan state lastScrollY
    const [showNavbar, setShowNavbar] = useState(true); // Mendefinisikan state showNavbar
    const navigate = useNavigate();
    const location = useLocation();

    const handleScroll = useCallback(() => {
        if (typeof window !== 'undefined') {
            if (window.scrollY > lastScrollY) {
                setShowNavbar(false); // Menyembunyikan navbar saat scroll ke bawah
            } else {
                setShowNavbar(true); // Menampilkan navbar saat scroll ke atas
            }
            setLastScrollY(window.scrollY); // Memperbarui nilai lastScrollY
        }
    }, [lastScrollY]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // Fungsi untuk menghapus rincian yang dipilih
    const handleDelete = () => {
        const remainingItems = savedLists.filter((_, index) => !selectedItems.has(index));
        setSavedLists(remainingItems);
        setSelectedItems(new Set()); // Reset pilihan
        toggleSelectMode(); // Keluar dari mode Select
    };

    return (
        <nav className={`navbar ${showNavbar ? 'visible' : 'hidden'} flex justify-between items-center p-4 bg-white shadow-md fixed top-0 w-full z-50`}>
            {location.pathname === '/list' ? (
                <>
                    <div className="navbar-left">
                        <i 
                            className='bx bx-arrow-back'
                            onClick={() => navigate('/')} // Kembali ke halaman Home
                        ></i>
                    </div>
                    <div className="navbar-right flex items-center">
                        <button 
                            className="navbar-button bg-blue-500 text-white rounded px-4 py-2" 
                            onClick={toggleSelectMode}
                        >
                            {isSelectMode ? 'Cancel' : 'Select'}
                        </button>
                        {isSelectMode && (
                            <button 
                                className="navbar-button bg-red-500 text-white rounded px-4 py-2" 
                                onClick={handleDelete} // Tombol delete untuk menghapus item terpilih
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="navbar-brand flex items-center">
                        <img src="/logo.png" alt="Logo" className="logo w-12 h-auto mr-2" />
                        <h1 className="text-2xl font-semibold text-gray-800">Nusa INA.</h1>
                    </div>
                    <div className="navbar-links flex gap-5">
                        <Link to="/"></Link>
                    </div>
                    <div className="navbar-icon cursor-pointer" onClick={() => navigate('/list')}>
                        <i className='bx bx-edit text-xl'></i>
                        {savedLists.length > 0 && (
                            <span className="list-count">{savedLists.length}</span>
                        )}
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;