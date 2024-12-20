import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import SearchFooter from './components/SearchFooter';
import ExploreSection from './components/ExploreSection';
import ListPage from './components/ListPage';
import './App.css';

function App() {
    const [destination, setDestination] = useState('');
    const [details, setDetails] = useState([]); // State rincian perjalanan
    const [savedLists, setSavedLists] = useState([]); // State untuk daftar yang disimpan
    const [showSearchFooter, setShowSearchFooter] = useState(true);
    const [selectedItems, setSelectedItems] = useState(new Set()); // State untuk item yang dipilih
    const [isSelectMode, setIsSelectMode] = useState(false); // State untuk mode select

    const handleSearch = (dest) => {
        setDestination(dest);
    };

    const handleExplore = (travelDetails) => {
        if (Array.isArray(travelDetails)) {
            setDetails(travelDetails);
        } else {
            console.error("travelDetails is not an array:", travelDetails);
        }
    };

    const handleAddList = (newDetails) => {
        if (newDetails.length > 0) {
            const totalCost = newDetails.reduce(
                (acc, item) => acc + parseInt(item.cost.replace(/[^\d]/g, ''), 10),
                0
            );
            const newList = { details: newDetails, totalCost };
            setSavedLists([...savedLists, newList]);
            setDetails([]); // Clear details after adding
        }
    };

    const toggleSelectMode = () => {
        setIsSelectMode(!isSelectMode);
        if (!isSelectMode) {
            setSelectedItems(new Set()); // Reset pilihan saat keluar dari mode Select
        }
    };

    const handleDeleteSelected = () => {
        const updatedLists = savedLists.filter((_, index) => !selectedItems.has(index));
        setSavedLists(updatedLists);
        setSelectedItems(new Set()); // Reset selected items
        setIsSelectMode(false); // Keluar dari mode Select setelah penghapusan
    };

    return (
        <Router>
            <div className="App">
                <Navbar 
                    savedLists={savedLists} 
                    setSavedLists={setSavedLists} // Pass setSavedLists for Navbar to update state
                    showSearchFooter={showSearchFooter} 
                    setShowSearchFooter={setShowSearchFooter} 
                    toggleSelectMode={toggleSelectMode} // Pass toggleSelectMode to Navbar
                    selectedItems={selectedItems} // Pass selectedItems to Navbar
                    setSelectedItems={setSelectedItems} // Pass setSelectedItems to Navbar
                    isSelectMode={isSelectMode} // Pass isSelectMode to Navbar
                />
                {showSearchFooter && <SearchFooter onSearch={handleSearch} />}
                <Routes>
                    {/* Route utama */}
                    <Route path="/" element={
                        <>
                            {/* ExploreSection bertanggung jawab penuh untuk menampilkan rincian */}
                            {destination && (
                                <ExploreSection 
                                    destination={destination} 
                                    onExplore={handleExplore} 
                                    onAddList={handleAddList}
                                    details={details} // Prop details dikirimkan ke ExploreSection
                                />
                            )}
                        </>
                    } />
                    {/* Route untuk halaman list */}
                    <Route 
                        path="/list" 
                        element={
                            <ListPage 
                                savedLists={savedLists} 
                                setSavedLists={setSavedLists} // Pass setSavedLists to ListPage
                                setShowSearchFooter={setShowSearchFooter} 
                                handleDeleteList={handleDeleteSelected} // Pass the delete function
                                selectedItems={selectedItems} // Pass selectedItems to ListPage
                                setSelectedItems={setSelectedItems} // Pass setSelectedItems to ListPage
                                isSelectMode={isSelectMode} // Pass isSelectMode to ListPage
                                toggleSelectMode={toggleSelectMode} // Pass toggleSelectMode to ListPage
                            />
                        } 
                    />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
