import React, { useEffect } from 'react'; // Hapus 'useState' karena tidak digunakan
import './ListPage.css';

const ListPage = ({ savedLists, setSavedLists, setShowSearchFooter, selectedItems, setSelectedItems, isSelectMode, toggleSelectMode }) => {

    useEffect(() => {
        setShowSearchFooter(false);
        return () => setShowSearchFooter(true);
    }, [setShowSearchFooter]);

    const toggleSelectItem = (index) => {
        const newSelectedItems = new Set(selectedItems);
        if (newSelectedItems.has(index)) {
            newSelectedItems.delete(index); // Hapus dari pilihan jika sudah ada
        } else {
            newSelectedItems.add(index); // Tambah ke pilihan jika belum ada
        }
        setSelectedItems(newSelectedItems);
    };

    return (
        <div className="list-page">
            {/* Pesan jika tidak ada rincian tersimpan */}
            {savedLists.length === 0 && (
                <div className="empty-message">
                    No saved details available.
                </div>
            )}

            {/* Menampilkan rincian yang disimpan */}
            {savedLists.map((list, index) => {
                const uniqueDetails = Array.from(new Set(list.details.map(item => item.label)))
                    .map(label => list.details.find(item => item.label === label));

                return (
                    <div
                        key={index}
                        className={`saved-list-item ${selectedItems.has(index) ? 'selected' : ''}`}
                        onClick={() => toggleSelectItem(index)} // Menambahkan select pada body rincian
                    >
                        <h3>Rincian #{index + 1}</h3>
                        <div className="select-icon" onClick={() => toggleSelectItem(index)}>
                            {selectedItems.has(index) ? (
                                <i className="bx bxs-check-circle" style={{ color: 'green' }}></i>
                            ) : (
                                <i className="bx bx-circle" style={{ color: 'gray' }}></i>
                            )}
                        </div>
                        <ul>
                            {uniqueDetails.map((item, i) => (
                                <li key={i}>
                                    {item.label}: {item.cost}
                                </li>
                            ))}
                        </ul>
                        <p>
                            <strong>Total: Rp. {list.totalCost.toLocaleString('id-ID')}</strong>
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default ListPage;
