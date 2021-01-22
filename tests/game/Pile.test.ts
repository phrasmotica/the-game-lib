import { Direction } from "../../src/game/Pile"
import { RuleSetBuilder } from "../../src/game/RuleSet"

import { createPile } from "../TestHelpers"

describe("pile", () => {
    let testCases = [
        {
            start: 1,
            pile: [2, 3, 4],
            direction: Direction.Ascending,
            jumpBackSize: 10,
            card: 5,
            expected: true
        },
        {
            start: 1,
            pile: [2, 3, 30],
            direction: Direction.Ascending,
            jumpBackSize: 10,
            card: 20,
            expected: true
        },
        {
            start: 1,
            pile: [2, 5, 6],
            direction: Direction.Ascending,
            jumpBackSize: 10,
            card: 3,
            expected: false
        },
        {
            start: 100,
            pile: [90, 89, 88],
            direction: Direction.Descending,
            jumpBackSize: 10,
            card: 87,
            expected: true
        },
        {
            start: 100,
            pile: [90, 81, 70],
            direction: Direction.Descending,
            jumpBackSize: 10,
            card: 80,
            expected: true
        },
        {
            start: 100,
            pile: [90, 89, 88],
            direction: Direction.Descending,
            jumpBackSize: 10,
            card: 91,
            expected: false
        },
    ]

    testCases.forEach(test => {
        it("can determine a valid card", () => {
            // arrange
            let pile = createPile({
                start: test.start,
                direction: test.direction,
                cards: test.pile,
            })

            let ruleSet = new RuleSetBuilder()
                            .withJumpBackSize(test.jumpBackSize)
                            .build()

            // act
            let canBePlayed = pile.canBePlayed(test.card, ruleSet)

            // assert
            expect(canBePlayed).toBe(test.expected)
        })
    })
})
