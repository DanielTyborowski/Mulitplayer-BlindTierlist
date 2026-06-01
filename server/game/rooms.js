const rooms = {
    data: {},

    generateCode () {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },

    createRoom ()  {
        const code = this.generateCode();
        this.data[code] = {
            code,
            roomState: {
                phase: "LOBBY",
                host,  //creatorID noch hinzufügen
                players: [],
                tierlist: null,
            },
            gameState: {
                currentRound: 1,
                totalRounds: 10,
            },
            

        }
        return code;
    },

    getRoom(code) {
        return this.data[code] ?? null;
    },

    addPlayer (code, ws, player){
        const room = this.getRoom(code);
        if (!room) return false;

        
        const player = {
            id: playerData.id,
            name: playerData.name,
            ws,
            ready: false,
            ranking: null
        };


        
        room.players.push(player);

        return player;
    },

    removePlayer(code, playerId) {
        const room = this.getRoom(code);
        if (!room) return false;

        room.players = room.players.filter(
        p => p.id !== playerId
        );


        //Host neu vergeben
        

        //Room löschen nachdem alle die lobby verlassen haben

        return true;
    } 
};


export default rooms;