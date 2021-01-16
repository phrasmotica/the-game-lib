import { createVote } from "../TestHelpers"

describe("vote", () => {
    it("is complete when all voters have voted", () => {
        // arrange
        let vote = createVote({
            voters: ["voter1", "voter2", "voter3"],
            voteMap: {},
        })
        vote.addVote("voter1", "voter1")
        vote.addVote("voter2", "voter2")
        vote.addVote("voter3", "voter3")

        // act
        let isComplete = vote.isComplete()

        // assert
        expect(isComplete).toBe(true)
    })

    it("is not complete when some voters have not voted", () => {
        // arrange
        let vote = createVote({
            voters: ["voter1", "voter2", "voter3"],
            voteMap: {},
        })
        vote.addVote("voter1", "voter1")
        vote.addVote("voter3", "voter3")

        // act
        let isComplete = vote.isComplete()

        // assert
        expect(isComplete).toBe(false)
    })
})
