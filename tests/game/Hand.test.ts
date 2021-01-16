import { Hand } from "../../src/game/Hand"

describe("hand", () => {
    it("can receive a card", () => {
        // arrange
        let hand = new Hand([1, 2, 3])

        // act
        hand.add(4)

        // assert
        expect(hand.cards).toStrictEqual([1, 2, 3, 4])
    })

    it("can lose a card", () => {
        // arrange
        let hand = new Hand([1, 2, 3])

        // act
        let _ = hand.remove(2)

        // assert
        expect(hand.cards).toStrictEqual([1, 3])
    })
})
