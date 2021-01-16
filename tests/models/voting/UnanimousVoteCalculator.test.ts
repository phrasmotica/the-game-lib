import { UnanimousVoteCalculator } from "../../../src/models/voting/UnanimousVoteCalculator"
import { createVote } from "../../TestHelpers"

describe("unanimous vote calculator", () => {
    it("returns winner when votes have been cast for one candidate", () => {
        // arrange
        let vote = createVote({
            voters: ["voter1", "voter2", "voter3"],
            voteMap: {
                ["voter1"]: "voter1",
                ["voter2"]: "voter1",
                ["voter3"]: "voter1",
            },
        })

        let calculator = new UnanimousVoteCalculator()

        // act
        let winner = calculator.getWinner(vote)

        // assert
        expect(winner).toBe("voter1")
    })

    it("returns no winner when votes have been cast for multiple candidates", () => {
        // arrange
        let vote = createVote({
            voters: ["voter1", "voter2", "voter3"],
            voteMap: {
                ["voter1"]: "voter1",
                ["voter2"]: "voter2",
                ["voter3"]: "voter1",
            },
        })

        let calculator = new UnanimousVoteCalculator()

        // act
        let winner = calculator.getWinner(vote)

        // assert
        expect(winner).toBeUndefined()
    })

    it("returns no winner when no votes have been cast", () => {
        // arrange
        let vote = createVote({
            voters: ["voter1", "voter2", "voter3"],
            voteMap: {},
        })

        let calculator = new UnanimousVoteCalculator()

        // act
        let winner = calculator.getWinner(vote)

        // assert
        expect(winner).toBeUndefined()
    })
})
