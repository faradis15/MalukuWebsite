// eslint-disable-next-line
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ savedLists, setSavedLists, selectedItems, setSelectedItems, isSelectMode, toggleSelectMode }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="navbar flex justify-between items-center p-4 bg-white shadow-md fixed top-0 w-full z-50">
            {/* Cek apakah kita berada di halaman deskripsi */}
            {location.pathname.includes('/destination') ? (
                // Navbar hanya menampilkan tombol panah di halaman deskripsi
                <div className="navbar-left">
                    <i 
                        className='bx bx-arrow-back'
                        onClick={() => navigate('/')} // Kembali ke halaman Home
                    ></i>
                </div>
            ) : location.pathname === '/list' ? (
                <>
                    <div className="navbar-left">
                        <i 
                            className='bx bx-arrow-back'
                            onClick={() => navigate('/')} // Kembali ke halaman Home
                        ></i>
                    </div>
                    <div className="navbar-right flex items-center">
                        {/* Tombol "Select" dan "Delete" dihapus di sini */}
                    </div>
                </>
            ) : (
                <>
                    <div className="navbar-brand flex items-center">
                        <img src="/logo.png" alt="Logo" className="logo w-12 h-auto mr-2" />
                        <h1 className="text-2xl font-semibold text-gray-800">Maluku Travel Mate.</h1>
                    </div>
                    <div className="navbar-links flex gap-5">
                        <div className="navbar-icon cursor-pointer" onClick={() => navigate('/list')}>
                            <i className='bx bx-edit text-xl'></i>
                            {savedLists.length > 0 && (
                                <span className="list-count">{savedLists.length}</span>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;