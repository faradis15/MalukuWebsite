import React, { useState, useEffect, useCallback } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "./ListPage.css";

const ListPage = () => {
    const [lists, setLists] = useState([]);
    const [filteredLists, setFilteredLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterVisible, setIsFilterVisible] = useState(false); // Menambahkan state untuk filter visibility
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

    const [showFlightOptions, setShowFlightOptions] = useState({});

    const parseCost = (costString) => {
        return parseInt(costString.replace(/[^0-9]/g, ""), 10) || 0;
    };

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

            const processedData = uniqueData.map((list) => ({
                ...list,
                details: list.details?.map((item) => ({
                    label: item.label || "Tidak ada label",
                    cost: parseCost(item.cost || "0"),
                })) || [],
            }));

            setLists(processedData);
            setFilteredLists(processedData);
        } catch (error) {
            console.error("Error fetching lists:", error);
        } finally {
            setLoading(false);
        }
    }, [firestore]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(firestore, "savedLists", id));
            
            // Update lists secara langsung
            setLists((prevLists) => {
                const updatedLists = prevLists.filter((list) => list.id !== id);
                setFilteredLists(updatedLists); // Langsung memperbarui filteredLists
                return updatedLists; // Kembalikan daftar yang sudah terhapus
            });
        } catch (error) {
            console.error(`Error menghapus dokumen dengan ID ${id}:`, error);
        }
    };

    const toggleFlightOptions = (id) => {
        setShowFlightOptions((prev) => {
            const newState = {
                ...prev,
                [id]: !prev[id],
            };
            console.log('Flight options state:', newState); // Debug log untuk memverifikasi state baru
            return newState;
        });
    };

    const changeAirline = (listId, airline, route) => {
        setLists((prevLists) =>
            prevLists.map((list) => {
                if (list.id === listId) {
                    const updatedDetails = list.details.map((detail) => {
                        if (detail.label.includes(route)) {
                            return {
                                ...detail,
                                label: `${route} (${airline})`,
                                cost: flightPrices[route][airline],  // Update biaya penerbangan
                            };
                        }
                        return detail;
                    });

                    // Update total cost secara real-time
                    const newTotalCost = updatedDetails.reduce((total, item) => total + item.cost, 0);
                    list.totalCost = newTotalCost;

                    return {
                        ...list,
                        details: updatedDetails,
                    };
                }
                return list;
            })
        );
    };

    const calculateTotalCost = (details) => {
        return details.reduce((total, item) => total + item.cost, 0);
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

    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    return (
        <div className="list-page">
            <h1 className="page-title">My Travel Plans</h1>

            {/* Tombol untuk menampilkan opsi filter */}
            <div className="filter-container">
                <button
                    className="filter-toggle-button"
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                    Filter Location
                </button>

                {/* Opsi filter yang memanjang secara horizontal */}
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
                                                Rp. {item.cost.toLocaleString("id-ID")}
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
                                    {list.details.some((detail) => detail.label.includes("Jakarta")) ? (
                                        <ul>
                                            {Object.keys(flightPrices["Jakarta - Ambon"]).map((airline) => (
                                                <li key={airline}>
                                                    <button
                                                        className="airline-option"
                                                        onClick={() => changeAirline(list.id, airline, "Jakarta - Ambon")}
                                                    >
                                                        {airline}: Rp. {flightPrices["Jakarta - Ambon"][airline].toLocaleString("id-ID")}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : list.details.some((detail) => detail.label.includes("Surabaya")) ? (
                                        <ul>
                                            {Object.keys(flightPrices["Surabaya - Ambon"]).map((airline) => (
                                                <li key={airline}>
                                                    <button
                                                        className="airline-option"
                                                        onClick={() => changeAirline(list.id, airline, "Surabaya - Ambon")}
                                                    >
                                                        {airline}: Rp. {flightPrices["Surabaya - Ambon"][airline].toLocaleString("id-ID")}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : list.details.some((detail) => detail.label.includes("Yogyakarta")) ? (
                                        <ul>
                                            {Object.keys(flightPrices["Yogyakarta - Ambon"]).map((airline) => (
                                                <li key={airline}>
                                                    <button
                                                        className="airline-option"
                                                        onClick={() => changeAirline(list.id, airline, "Yogyakarta - Ambon")}
                                                    >
                                                        {airline}: Rp. {flightPrices["Yogyakarta - Ambon"][airline].toLocaleString("id-ID")}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            )}

                            <button
                                className="delete-button"
                                onClick={() => handleDelete(list.id)}
                            >
                               Hapus
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
