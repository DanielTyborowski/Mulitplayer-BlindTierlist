import './Lobby.css';

const Lobby = ({ username, gameState, onNavigate, onStartGame }) => {
    const isHost = gameState.myId === gameState.hostId;

    return (
        <div className="lobby-container">
            <div className="lobby-panel">
                <h2 className="lobby-title">Lobby</h2>

                <div className="lobby-info">
                    <div className="lobby-info-block">
                        <span className="lobby-label">Code</span>
                        <span className="lobby-code">{gameState.code}</span>
                    </div>
                    <div className="lobby-info-block">
                        <span className="lobby-label">Runden</span>
                        <span className="lobby-value">{gameState.gameState?.totalRounds}</span>
                    </div>
                </div>

                <div className="lobby-divider" />

                <span className="lobby-label">Spieler ({gameState.players?.length})</span>
                <ul className="lobby-players">
                    {gameState.players?.map(p => (
                        <li key={p.id} className="lobby-player">
                            <span className="player-dot" />
                            {p.name}
                            {p.id === gameState.hostId && <span className="host-badge">Host</span>}
                        </li>
                    ))}
                </ul>

                <div className="lobby-divider" />

                {isHost ? (
                    <button className="lobby-start-button" onClick={() => {
                        onNavigate('tierlist');
                        onStartGame(username, gameState.code);
                    }}>
                        Spiel starten
                    </button>
                ) : (
                    <p className="lobby-waiting">Warte auf den Host...</p>
                )}
            </div>
        </div>
    );
}

export default Lobby;