import { createGameData, createRoomData } from "../TestHelpers"

describe("room data", () => {
    it("player can be removed", () => {
        // arrange
        let roomData = createRoomData({
            players: ["player1", "player2"],
            gameData: createGameData({
                players: ["player1", "player2"]
            }),
        })

        // act
        let success = roomData.removePlayer("player1")

        // assert
        expect(success).toBe(true)
        expect(roomData.players).toStrictEqual(["player2"])
    })

    it("spectator can be removed", () => {
        // arrange
        let roomData = createRoomData({
            spectators: ["spectator1", "spectator2"],
        })

        // act
        let success = roomData.removeSpectator("spectator1")

        // assert
        expect(success).toBe(true)
        expect(roomData.spectators).toStrictEqual(["spectator2"])
    })
})
