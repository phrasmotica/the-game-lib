import { Card } from "../../src/game/Card"
import { Direction } from "../../src/game/Pile"
import { RuleSetBuilder } from "../../src/game/RuleSet"

import { createCards, createPile } from "../TestHelpers"

describe("pile", () => {
    let testCases = [
        {
            start: 1,
            pile: [2, 3, 4],
            direction: Direction.Ascending,
            jumpBackSize: 10,
            cardValue: 5,
            expected: true
        },
        {
            start: 1,
            pile: [2, 3, 30],
            direction: Direction.Ascending,
            jumpBackSize: 10,
            cardValue: 20,
            expected: true
        },
        {
            start: 1,
            pile: [2, 5, 6],
            direction: Direction.Ascending,
            jumpBackSize: 10,
            cardValue: 3,
            expected: false
        },
        {
            start: 100,
            pile: [90, 89, 88],
            direction: Direction.Descending,
            jumpBackSize: 10,
            cardValue: 87,
            expected: true
        },
        {
            start: 100,
            pile: [90, 81, 70],
            direction: Direction.Descending,
            jumpBackSize: 10,
            cardValue: 80,
            expected: true
        },
        {
            start: 100,
            pile: [90, 89, 88],
            direction: Direction.Descending,
            jumpBackSize: 10,
            cardValue: 91,
            expected: false
        },
    ]

    testCases.forEach(test => {
        it("can determine a valid card", () => {
            // arrange
            let pile = createPile({
                start: test.start,
                direction: test.direction,
                cards: createCards(test.pile),
            })

            let ruleSet = new RuleSetBuilder()
                            .withJumpBackSize(test.jumpBackSize)
                            .build()

            // act
            let canBePlayed = pile.canBePlayed(new Card(test.cardValue), ruleSet)

            // assert
            expect(canBePlayed).toBe(test.expected)
        })

        it("allows player to mulligan if the pile is not empty and the top card is theirs", () => {
            // arrange
            let pile = createPile({
                cards: [new Card(30), new Card(40, "player1")]
            })

            // act
            let success = pile.canMulligan("player1")

            // assert
            expect(success).toBe(true)
        })

        it("does not allow player to mulligan if the top card is not theirs", () => {
            // arrange
            let pile = createPile({
                cards: [new Card(30), new Card(40, "player2")]
            })

            // act
            let success = pile.canMulligan("player1")

            // assert
            expect(success).toBe(false)
        })

        it("does not allow player to mulligan if the pile is empty", () => {
            // arrange
            let pile = createPile({
                cards: []
            })

            // act
            let success = pile.canMulligan("player1")

            // assert
            expect(success).toBe(false)
        })
    })
})
