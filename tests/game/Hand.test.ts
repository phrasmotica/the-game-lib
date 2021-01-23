import { Card } from "../../src/game/Card"
import { Hand } from "../../src/game/Hand"

import { createCards } from "../TestHelpers"

describe("hand", () => {
    it("can receive a card", () => {
        // arrange
        let hand = new Hand(createCards([1, 2, 3]))

        // act
        hand.add(new Card(4, false))

        // assert
        expect(hand.cards.map(c => c.value)).toStrictEqual([1, 2, 3, 4])
    })

    it("can lose a card", () => {
        // arrange
        let hand = new Hand(createCards([1, 2, 3]))

        // act
        hand.remove(new Card(2, false))

        // assert
        expect(hand.cards.map(c => c.value)).toStrictEqual([1, 3])
    })
})
