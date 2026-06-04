import { useState, useEffect } from 'react';
//import '../createTierlist.css';
import '../CreateTierlist/CreateTierlist.css'

const EditTierlist = ({ onBack }) => {
    const [tierlists, setTierlists] = useState([]);
    const [selected, setSelected] = useState(null); // die gewählte Tierlist
    const [newItem, setNewItem] = useState({ name: '', file: null, preview: null });

    useEffect(() => {
        fetch('http://localhost:2500/tierlist')
            .then(r => r.json())
            .then(setTierlists);
    }, []);

    const loadTierlist = async (id) => {
        const res = await fetch(`http://localhost:2500/tierlist/${id}`);
        const data = await res.json();
        setSelected(data);
    };

    const handleDeleteTierlist = async () => {
        if (!confirm(`Tierlist "${selected.name}" wirklich löschen?`)) return;
        await fetch(`http://localhost:2500/tierlist/${selected._id}`, { method: 'DELETE' });
        setSelected(null);
        const res = await fetch('http://localhost:2500/tierlist');
        setTierlists(await res.json());
    };

    const handleDeleteItem = async (index) => {
        const res = await fetch(`http://localhost:2500/tierlist/${selected._id}/item/${index}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        setSelected(prev => ({ ...prev, pool: data.pool }));
    };

    const handleAddItem = async () => {
        if (!newItem.name || !newItem.file) {
            alert('Bitte Name und Bild angeben.');
            return;
        }
        const formData = new FormData();
        formData.append('itemName', newItem.name);
        formData.append('image', newItem.file);

        const res = await fetch(`http://localhost:2500/tierlist/${selected._id}/item`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        setSelected(prev => ({ ...prev, pool: data.pool }));
        setNewItem({ name: '', file: null, preview: null });
    };

    return (
        <div className="ct-container">
            <button className="ct-back" onClick={onBack}>← Zurück</button>
            <h2>Tierlist bearbeiten</h2>

            {/* Tierlist auswählen */}
            {!selected ? (
                <>
                    <p style={{ marginBottom: '1rem', color: '#888' }}>Wähle eine Tierlist:</p>
                    {tierlists.map(tl => (
                        <div key={tl._id} className="ct-item-row">
                            <span style={{ flex: 1 }}>{tl.name}</span>
                            <button onClick={() => loadTierlist(tl._id)}>Bearbeiten</button>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <h3>{selected.name}</h3>
                        <button onClick={() => setSelected(null)}>← Zurück</button>
                        <button onClick={handleDeleteTierlist} style={{ color: 'red' }}>
                            Tierlist löschen
                        </button>
                    </div>

                    {/* Bestehende Items */}
                    {selected.pool.map((item, i) => (
                        <div key={i} className="ct-item-row">
                            <img
                                src={`http://localhost:2500${item.img}`}
                                alt={item.name}
                                className="ct-preview-img"
                            />
                            <span className="ct-input-item">{item.name}</span>
                            <button className="ct-remove" onClick={() => handleDeleteItem(i)}>✕</button>
                        </div>
                    ))}

                    {/* Neues Item hinzufügen */}
                    <div className="ct-item-row" style={{ marginTop: '1rem' }}>
                        {newItem.preview && (
                            <img src={newItem.preview} alt="" className="ct-preview-img" />
                        )}
                        <input
                            className="ct-input-item"
                            placeholder="Neues Item Name"
                            value={newItem.name}
                            onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0];
                                setNewItem(prev => ({
                                    ...prev,
                                    file,
                                    preview: URL.createObjectURL(file)
                                }));
                            }}
                        />
                    </div>

                    <div className="ct-actions">
                        <button onClick={handleAddItem}>+ Item hinzufügen</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default EditTierlist;