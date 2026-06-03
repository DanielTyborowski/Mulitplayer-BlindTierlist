import { useState } from 'react';
import './createTierlist.css';

const CreateTierlist = ({ onBack }) => {
    const [tierlistName, setTierlistName] = useState('');
    const [items, setItems] = useState([{ name: '', file: null, preview: null }]);

    const addItem = () => {
        setItems([...items, { name: '', file: null, preview: null }]);
    };

    const removeItem = (i) => {
        setItems(items.filter((_, idx) => idx !== i));
    };

    const updateName = (i, value) => {
        const updated = [...items];
        updated[i].name = value;
        setItems(updated);
    };

    const updateFile = (i, file) => {
        const updated = [...items];
        updated[i].file = file;
        updated[i].preview = URL.createObjectURL(file);
        setItems(updated);
    };

    const handleSubmit = async () => {
        if (!tierlistName || items.some(it => !it.name || !it.file)) {
            alert('Bitte alle Felder ausfüllen und Bilder hochladen.');
            return;
        }

        const formData = new FormData();
        formData.append('name', tierlistName);
        formData.append('folderName', tierlistName.trim().toLowerCase().replace(/\s+/g, '-'));
        formData.append('itemCount', items.length);
        items.forEach((it, i) => {
            formData.append('images', it.file);
            formData.append(`itemName_${i}`, it.name.trim());
        });

        const res = await fetch('http://localhost:2500/upload', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (data.ok) {
            alert('Tierlist erstellt!');
            onBack();
        } else {
            alert(data.message); 
        }
    };

    return (
        <div className="ct-container">
            <button className="ct-back" onClick={onBack}>← Zurück</button>
            <h2>Neue Tierlist erstellen</h2>

            <input
                className="ct-input-full"
                placeholder="Name der Tierlist"
                value={tierlistName}
                onChange={e => setTierlistName(e.target.value)}
            />

            {items.map((item, i) => (
                <div key={i} className="ct-item-row">
                    {item.preview && (
                        <img src={item.preview} alt="" className="ct-preview-img" />
                    )}
                    <input
                        className="ct-input-item"
                        placeholder={`Item ${i + 1} Name`}
                        value={item.name}
                        onChange={e => updateName(i, e.target.value)}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => updateFile(i, e.target.files[0])}
                    />
                    <button className="ct-remove" onClick={() => removeItem(i)}>✕</button>
                </div>
            ))}

            <div className="ct-actions">
                <button onClick={addItem}>+ Item hinzufügen</button>
                <button onClick={handleSubmit}>Erstellen</button>
            </div>
        </div>
    );
};

export default CreateTierlist;