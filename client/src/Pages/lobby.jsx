


const Lobby = ({ username, gameState, onNavigate }) => {
    const isHost = gameState.myId === gameState.hostId;

    return (
        <div className="lobby-container">
            <h2>Lobby</h2>
            <p>Code: <strong>{gameState.code}</strong></p>
            <p>Runden: <strong>{gameState.gameState?.totalRounds}</strong></p>

            <h3>Spieler ({gameState.players?.length})</h3>
            <ul>
                {gameState.players?.map(p => (
                    <li key={p.id}>
                        {p.name} {p.id === gameState.hostId ? '👑' : ''}
                    </li>
                ))}
            </ul>

            {isHost ? (
                <button onClick= {()=>{
                    onNavigate('tierlist')
                }}>
                    Spiel starten
                </button>
            ) : (
                <p>Warte auf den Host...</p>
            )}
        </div>
    );
}

export default Lobby;