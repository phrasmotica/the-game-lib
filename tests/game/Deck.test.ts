import { Deck } from "../../src/game/Deck"

import { createCards } from "../TestHelpers"

describe("deck", () => {
    it("draws one card", () => {
        // arrange
        let deck = new Deck(createCards([1, 2, 3]))

        // act
        let _ = deck.drawOne()

        // assert
        expect(deck.size()).toBe(2)
    })

    it("can receive more cards", () => {
        // arrange
        let deck = new Deck(createCards([1, 2, 3]))

        // act
        deck.addCards(createCards([4, 5]))

        // assert
        expect(deck.size()).toBe(5)
    })
})
