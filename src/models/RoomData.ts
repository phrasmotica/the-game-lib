import { GameData } from "./GameData"

/**
 * Represents data about a room on the server.
 */
export class RoomData {
    /**
     * Constructor.
     */
    constructor(
        public name: string,
        public players: string[],
        public spectators: string[],
        public gameData: GameData,
    ) { }

    /**
     * Adds the given player to the room.
     */
    addPlayer(player: string) {
        if (!this.playerIsPresent(player)) {
            this.players.push(player)
        }

        return true
    }

    /**
     * Removes the given player from the room.
     */
    removePlayer(player: string) {
        if (this.playerIsPresent(player)) {
            this.gameData.removePlayer(player)

            let index = this.players.indexOf(player)
            this.players.splice(index, 1)
        }

        return true
    }

    /**
     * Returns whether the given player is in this room.
     */
    playerIsPresent(player: string) {
        return this.players.includes(player)
    }

    /**
     * Adds the given player to the room as a spectator.
     */
    addSpectator(player: string) {
        if (!this.spectatorIsPresent(player)) {
            this.spectators.push(player)
        }

        return true
    }

    /**
     * Removes the given spectator from the room.
     */
    removeSpectator(player: string) {
        if (this.spectatorIsPresent(player)) {
            let index = this.spectators.indexOf(player)
            this.spectators.splice(index, 1)
        }

        return true
    }

    /**
     * Returns whether the given player is in this room as a spectator.
     */
    spectatorIsPresent(player: string) {
        return this.spectators.includes(player)
    }

    /**
     * Starts a game in this room with the given rule set.
     */
    startGame() {
        this.gameData.start(this.players)
    }

    /**
     * Clears the game data in this room.
     */
    clear() {
        this.players = []
        this.spectators = []

        return this.gameData.clear()
    }

    /**
     * Returns whether this room's game is in progress.
     */
    isInProgress() {
        return this.gameData.isInProgress()
    }

    /**
     * Returns an empty room data object.
     */
    static empty() {
        return RoomData.named("")
    }

    /**
     * Returns an room data object with the given name.
     */
    static named(roomName: string) {
        return new RoomData(roomName, [], [], GameData.default())
    }

    /**
     * Returns a concrete room data object. Use when processing naive message from the server.
     */
    static from(roomData: RoomData) {
        return new RoomData(
            roomData.name,
            roomData.players,
            roomData.spectators,
            GameData.from(roomData.gameData)
        )
    }
}
