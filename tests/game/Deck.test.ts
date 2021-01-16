import { Deck } from "../../src/game/Deck"

describe("deck", () => {
    it("draws one card", () => {
        // arrange
        let deck = new Deck([1, 2, 3])

        // act
        let _ = deck.drawOne()

        // assert
        expect(deck.size()).toBe(2)
    })

    it("can receive more cards", () => {
        // arrange
        let deck = new Deck([1, 2, 3])

        // act
        deck.addCards([4, 5])

        // assert
        expect(deck.size()).toBe(5)
    })
})
