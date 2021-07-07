import * as mocha from 'mocha'
import * as chai from 'chai'
import * as dirtyChai from 'dirty-chai'
const { expect } = chai
chai.use(dirtyChai)
const { describe, it } = mocha

describe("using chain of responsibility to deteamsify", () => {
    it("can fail", () => {
        expect(true).to.be.true()
    })
})