import React, { useState, useEffect, useCallback } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import "./ListPage.css";

const ListPage = () => {
    const [lists, setLists] = useState([]);
    const [filteredLists, setFilteredLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [showFlightOptions, setShowFlightOptions] = useState({});
    const firestore = getFirestore();

    const flightPrices = {
        "Jakarta - Ambon": {
            "Citilink": 2179044,
            "Batik Air": 2478800,
            "Garuda Indonesia": 2857100,
            "Super Air Jet": 1979700,
        },
        "Surabaya - Ambon": {
            "Batik Air": 2614100,
            "Citilink": 3212345,
            "Garuda Indonesia": 4718100,
            "Lion Air": 1918000,
        },
        "Yogyakarta - Ambon": {
            "Citilink": 3002014,
            "Batik Air": 3532500,
            "Garuda Indonesia": 4736900,
            "Lion Air": 2750600,
        },
    };

    const parseCost = useCallback((costString) => {
        if (!costString) return 0;
        if (typeof costString === 'number') return costString;
        if (costString === "Pantai Ora" || costString === "Banda Neira" || 
            costString === "Kei Island" || costString === "Gunung Binaiya") {
            return costString;
        }
        return parseInt(costString.replace(/[^0-9]/g, ""), 10) || 0;
    }, []);

    const fetchLists = useCallback(async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(firestore, "savedLists"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const uniqueData = Array.from(new Set(data.map((item) => item.id))).map(
                (id) => data.find((item) => item.id === id)
            );

            const processedData = uniqueData.map((list) => {
                const processedDetails = list.details?.map((item) => {
                    const parsedCost = parseCost(item.cost);
                    return {
                        label: item.label || "Tidak ada label",
                        cost: parsedCost,
                    };
                }) || [];

                const totalCost = processedDetails.reduce((sum, item) => {
                    return typeof item.cost === 'number' ? sum + item.cost : sum;
                }, 0);

                return {
                    ...list,
                    details: processedDetails,
                    totalCost: totalCost
                };
            });

            setLists(processedData);
            setFilteredLists(processedData);
            
            // Update localStorage with total count
            localStorage.setItem('totalLists', processedData.length.toString());
            
        } catch (error) {
            console.error("Error fetching lists:", error);
        } finally {
            setLoading(false);
        }
    }, [firestore, parseCost]);

    const calculateTotalCost = useCallback((details) => {
        return details.reduce((total, item) => {
            if (typeof item.cost === 'string') {
                return total;
            }
            return total + (item.cost || 0);
        }, 0);
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(firestore, "savedLists", id));
            const updatedLists = lists.filter((list) => list.id !== id);
            setLists(updatedLists);
            setFilteredLists(updatedLists);
            localStorage.setItem('totalLists', updatedLists.length.toString());
        } catch (error) {
            console.error(`Error menghapus dokumen dengan ID ${id}:`, error);
        }
    };

    const toggleFlightOptions = (id) => {
        setShowFlightOptions((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const updateListInFirebase = async (docId, updatedData) => {
        try {
            const docRef = doc(firestore, "savedLists", docId);
            await updateDoc(docRef, {
                ...updatedData,
                updatedAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('Error updating document: ', error);
            return false;
        }
    };

    const changeAirline = async (listId, airline, route) => {
        try {
            const updatedLists = lists.map((list) => {
                if (list.id === listId) {
                    const updatedDetails = list.details.map((detail) => {
                        if (detail.label.includes(route.split(" - ")[0])) {
                            return {
                                ...detail,
                                label: `Tiket Pesawat ${airline} ${route}`,
                                cost: flightPrices[route][airline],
                            };
                        }
                        return detail;
                    });

                    const newTotalCost = calculateTotalCost(updatedDetails);

                    updateListInFirebase(listId, {
                        details: updatedDetails,
                        totalCost: newTotalCost
                    });

                    return {
                        ...list,
                        details: updatedDetails,
                        totalCost: newTotalCost
                    };
                }
                return list;
            });

            setLists(updatedLists);
            setFilteredLists(updatedLists.filter(list => 
                filteredLists.some(filteredList => filteredList.id === list.id)
            ));

        } catch (error) {
            console.error("Error updating airline:", error);
        }
    };

    const filterByLocation = (location) => {
        if (location === "All") {
            setFilteredLists(lists);
        } else {
            const filteredData = lists.filter((list) =>
                list.details.some((detail) => detail.label.includes(location))
            );
            setFilteredLists(filteredData);
        }
    };

    // Fetch data saat komponen dimount dan saat ada perubahan di firestore
    useEffect(() => {
        fetchLists();
        // Set interval untuk refresh data setiap 30 detik
        const intervalId = setInterval(fetchLists, 30000);
        return () => {
            clearInterval(intervalId);
        };
    }, [fetchLists]);

    // Return JSX tetap sama seperti sebelumnya
    return (
        <div className="list-page">
            <h1 className="page-title">My Travel Plans</h1>

            <div className="filter-container">
                <button
                    className="filter-toggle-button"
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                    Filter Location
                </button>

                {isFilterVisible && (
                    <div className="filter-buttons">
                        <button onClick={() => filterByLocation("All")}>All</button>
                        <button onClick={() => filterByLocation("Jakarta")}>Jakarta</button>
                        <button onClick={() => filterByLocation("Surabaya")}>Surabaya</button>
                        <button onClick={() => filterByLocation("Yogyakarta")}>Yogyakarta</button>
                    </div>
                )}
            </div>

            {loading ? (
                <p>Loading data...</p>
            ) : filteredLists.length > 0 ? (
                <div className="list-grid">
                    {filteredLists.map((list, index) => (
                        <div key={list.id} className="list-card">
                            <h2 className="card-title">Rincian #{index + 1}</h2>
                            <ul className="details-list">
                                {list.details.length > 0 ? (
                                    list.details.map((item, i) => (
                                        <li key={i} className="details-item">
                                            <span className="item-label">{item.label}</span>
                                            <span className="item-cost">
                                                {typeof item.cost === 'string' ? 
                                                    item.cost : 
                                                    `Rp. ${item.cost.toLocaleString("id-ID")}`}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li>No Data Available.</li>
                                )}
                            </ul>
                            <p className="total-cost">
                                <strong>Total:</strong> Rp.{" "}
                                {calculateTotalCost(list.details).toLocaleString("id-ID")}
                            </p>

                            <button
                                className="flight-options-button"
                                onClick={() => toggleFlightOptions(list.id)}
                            >
                                Flight Options
                            </button>

                            {showFlightOptions[list.id] && (
                                <div className="flight-options">
                                    {list.details.map((detail) => {
                                        let currentRoute;
                                        
                                        if (detail.label.includes("Jakarta")) {
                                            currentRoute = "Jakarta - Ambon";
                                        } else if (detail.label.includes("Surabaya")) {
                                            currentRoute = "Surabaya - Ambon";
                                        } else if (detail.label.includes("Yogyakarta")) {
                                            currentRoute = "Yogyakarta - Ambon";
                                        }

                                        if (currentRoute && flightPrices[currentRoute]) {
                                            return (
                                                <div key={currentRoute} className="airline-options-container">
                                                    <h3>Pilihan Maskapai untuk {currentRoute}</h3>
                                                    <ul className="airline-list">
                                                        {Object.entries(flightPrices[currentRoute]).map(([airline, price]) => (
                                                            <li key={airline}>
                                                                <button
                                                                    className={`airline-option ${
                                                                        detail.label.includes(airline) ? 'selected' : ''
                                                                    }`}
                                                                    onClick={() => changeAirline(list.id, airline, currentRoute)}
                                                                >
                                                                    <div className="airline-info">
                                                                        <span className="airline-name">{airline}</span>
                                                                        <span className="airline-price">
                                                                            Rp. {price.toLocaleString("id-ID")}
                                                                        </span>
                                                                    </div>
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            )}

                            <button
                                className="delete-button"
                                onClick={() => handleDelete(list.id)}
                            >
                               Delete
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No Data Available.</p>
            )}
        </div>
    );
};

export default ListPage;
