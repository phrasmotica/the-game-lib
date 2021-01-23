import { Card } from "../../src/game/Card"
import { CardInfo, Direction } from "../../src/game/Pile"
import { RuleSetBuilder } from "../../src/game/RuleSet"

import { createCardsWithInfo, createPile } from "../TestHelpers"

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
                cards: createCardsWithInfo(test.pile),
            })

            let ruleSet = new RuleSetBuilder()
                            .withJumpBackSize(test.jumpBackSize)
                            .build()

            // act
            let canBePlayed = pile.canBePlayed(new Card(test.cardValue), ruleSet)

            // assert
            expect(canBePlayed).toBe(test.expected)
        })

        it("behaves like a stack", () => {
            // arrange
            let pile = createPile({
                cards: createCardsWithInfo([2, 3, 4]),
            })

            // act and assert
            expect(pile.topCard().value).toBe(4)
            expect(pile.popCard()!.value).toBe(4)
            expect(pile.topCard().value).toBe(3)
        })

        it("allows player to mulligan if the pile is not empty and they played the top card on the same turn", () => {
            // arrange
            let pile = createPile({
                cards: [
                    [new Card(30), new CardInfo()],
                    [new Card(40), new CardInfo("player1", 1)]
                ]
            })

            // act
            let success = pile.canMulligan("player1", 1)

            // assert
            expect(success).toBe(true)
        })

        it("does not allow player to mulligan if the top card is not theirs", () => {
            // arrange
            let pile = createPile({
                cards: [
                    [new Card(30), new CardInfo()],
                    [new Card(40), new CardInfo("player2", 1)]
                ]
            })

            // act
            let success = pile.canMulligan("player1", 1)

            // assert
            expect(success).toBe(false)
        })

        it("does not allow player to mulligan if they played the top card on a different turn", () => {
            // arrange
            let pile = createPile({
                cards: [
                    [new Card(30), new CardInfo()],
                    [new Card(40), new CardInfo("player1", 2)]
                ]
            })

            // act
            let success = pile.canMulligan("player1", 1)

            // assert
            expect(success).toBe(false)
        })

        it("does not allow player to mulligan if the pile is empty", () => {
            // arrange
            let pile = createPile({
                cards: []
            })

            // act
            let success = pile.canMulligan("player1", 1)

            // assert
            expect(success).toBe(false)
        })
    })
})
