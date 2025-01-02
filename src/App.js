import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchFooter from './components/SearchFooter';
import ExploreSection from './components/ExploreSection';
import ListPage from './components/ListPage';
import RecommendationSection from './components/RecommendationSection';
import DescriptionPage from './components/DescriptionPage';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './App.css';

// Fungsi untuk menyimpan data ke Firestore
const saveListsToFirebase = async (lists) => {
    console.log("Data yang akan disimpan:", lists);
    try {
        // Periksa apakah data sudah ada di Firestore sebelum menambahkannya
        const querySnapshot = await getDocs(collection(db, "savedLists"));
        const existingData = querySnapshot.docs.map(doc => doc.data());

        // Cek apakah data sudah ada, jika tidak maka baru disimpan
        const isDuplicate = existingData.some(existingList =>
            JSON.stringify(existingList.lists.details) === JSON.stringify(lists.details)
        );

        if (!isDuplicate) {
            const docRef = await addDoc(collection(db, "savedLists"), { lists });
            console.log("Document written with ID: ", docRef.id);
        } else {
            console.log("Data sudah ada, tidak perlu disimpan lagi.");
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

// Fungsi untuk mengambil data dari Firestore
const fetchListsFromFirebase = async () => {
    const querySnapshot = await getDocs(collection(db, "savedLists"));
    const fetchedLists = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data().lists;
        if (Array.isArray(data)) {
            fetchedLists.push(...data);
        }
    });

    // Hapus duplikat berdasarkan rincian yang sama
    const uniqueLists = Array.from(new Set(fetchedLists.map(a => JSON.stringify(a.details))))
        .map(e => JSON.parse(e));

    return uniqueLists;
};

function AppContent() {
    const location = useLocation();
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [details, setDetails] = useState([]);
    const [savedLists, setSavedLists] = useState([]);
    const [showSearchFooter, setShowSearchFooter] = useState(true);
    const [showWhyChooseUs, setShowWhyChooseUs] = useState(true);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [isRecommendationVisible, setIsRecommendationVisible] = useState(true);

    // Mengambil data dari Firestore saat komponen dimuat
    useEffect(() => {
        const getSavedLists = async () => {
            const lists = await fetchListsFromFirebase();
            setSavedLists(lists || []);
        };
        getSavedLists();
    }, []);

    // Menyimpan data ke Firestore setiap kali savedLists berubah
    useEffect(() => {
        if (savedLists.length > 0) {
            saveListsToFirebase(savedLists);
        }
    }, [savedLists]);

    const handleSearch = (dest) => {
        setDestination(dest);
        setIsRecommendationVisible(false);
        setShowWhyChooseUs(false);
    };

    const handleExplore = (travelDetails) => {
        if (Array.isArray(travelDetails)) {
            setDetails(travelDetails);
        } else {
            console.error("travelDetails is not an array:", travelDetails);
        }
    };

    const handleAddList = async (newDetails) => {
        if (Array.isArray(newDetails) && newDetails.length > 0) {
            console.log("Data rincian yang akan disimpan:", newDetails); // Debugging
            const totalCost = newDetails.reduce(
                (acc, item) => acc + parseInt(item.cost.replace(/[^\d]/g, ''), 10),
                0
            );
            const newList = { details: newDetails, totalCost };

            try {
                const docRef = await addDoc(collection(db, "savedLists"), newList);
                console.log("Data disimpan ke Firestore dengan ID:", docRef.id); // Debugging
                setSavedLists((prevLists) => [...prevLists, newList]);

                // Reset state dan arahkan kembali ke halaman utama
                setDestination('');
                setDetails([]);
                setIsRecommendationVisible(true); // Menampilkan rekomendasi kembali
                setShowWhyChooseUs(true); // Menampilkan WhyChooseUs kembali
                setShowSearchFooter(true); // Menampilkan footer pencarian kembali

                // Kembali ke halaman utama
                navigate('/');
            } catch (error) {
                console.error("Error menyimpan data ke Firestore:", error);
            }
        } else {
            console.error("newDetails is not valid:", newDetails);
        }
    };

    const toggleSelectMode = () => {
        setIsSelectMode(!isSelectMode);
        if (!isSelectMode) {
            setSelectedItems(new Set());
        }
    };

    const handleDeleteSelected = () => {
        const updatedLists = savedLists.filter((_, index) => !selectedItems.has(index));
        setSavedLists(updatedLists);
        setSelectedItems(new Set());
        setIsSelectMode(false);
    };

    return (
        <div className={`App ${location.pathname === '/' ? 'home-page' : ''}`}>
            {location.pathname !== '/destination/:id' && (
                <Navbar 
                    savedLists={savedLists} 
                    setSavedLists={setSavedLists} 
                    showSearchFooter={showSearchFooter} 
                    setShowSearchFooter={setShowSearchFooter} 
                    toggleSelectMode={toggleSelectMode} 
                    selectedItems={selectedItems} 
                    setSelectedItems={setSelectedItems} 
                    isSelectMode={isSelectMode} 
                />
            )}
            {location.pathname === '/' && showSearchFooter && (
                <SearchFooter onSearch={handleSearch} />
            )}
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <>
                            {isRecommendationVisible && (
                                <RecommendationSection
                                    onImageClick={(destinationId) => {
                                        setShowSearchFooter(false);
                                        navigate(`/destination/${destinationId}`);
                                    }}
                                />
                            )}
                            {destination && (
                                <ExploreSection 
                                    destination={destination} 
                                    onExplore={handleExplore} 
                                    onAddList={handleAddList}
                                    details={details}
                                />
                            )}
                            {showWhyChooseUs && <WhyChooseUsSection />}
                        </>
                    } 
                />
                <Route 
                    path="/list" 
                    element={
                        <ListPage 
                            savedLists={savedLists || []} 
                            setSavedLists={setSavedLists} 
                            setShowSearchFooter={setShowSearchFooter} 
                            handleDeleteList={handleDeleteSelected} 
                            selectedItems={selectedItems} 
                            setSelectedItems={setSelectedItems} 
                            isSelectMode={isSelectMode} 
                            toggleSelectMode={toggleSelectMode} 
                            onBackToHome={() => setShowWhyChooseUs(true)} 
                        />
                    } 
                />
                <Route 
                    path="/destination/:id" 
                    element={<DescriptionPage />} 
                />
            </Routes>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
