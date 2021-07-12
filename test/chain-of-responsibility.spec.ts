import * as mocha from 'mocha'
import * as chai from 'chai'
import * as dirtyChai from 'dirty-chai'
import {send} from "../src/messages";
const { expect } = chai
chai.use(dirtyChai)
const { describe, it } = mocha

interface ChainResult {
    error?: string,
    hiddenURL?: string
}

interface ChainLink {
    handle: (s: string) => ChainResult
}

class HasContent implements ChainLink {
    private nextLink: ChainLink;
    constructor(nextLink: ChainLink) {
        this.nextLink = nextLink;
    }

    handle(s: string): ChainResult {
        if (s && s.length > 0) {
            return this.nextLink.handle(s)
        } else {
            return { error: "there must be content in the string" };
        }
    }
}

class AlwaysSucceeds implements ChainLink {
    handle(s: string): ChainResult {
        return { hiddenURL: "✅" };
    }
}

class IsHTTPURL implements ChainLink {
    private nextLink: ChainLink;
    constructor(nextLink: ChainLink) {
        this.nextLink = nextLink;
    }

    handle(s: string): ChainResult {
        let url

        try {
            url = new URL(s)
        } catch (_) {
            return { error: "you must provide a web URL" }
        }

        if (url.protocol === 'http:' || url.protocol === 'https:') {
            return this.nextLink.handle(s)
        } else {
            return { error: "you must provide a web URL" }
        }
    }

}

class IsTeamsURL implements ChainLink {
    private nextLink: ChainLink;
    constructor(nextLink: ChainLink) {
        this.nextLink = nextLink;

    }

    handle(s: string): ChainResult {
        const x = new URL(s)
        if (x.host === 'teams.microsoft.com') {
            return this.nextLink.handle(s)
        } else {
            return { error: "that's not a Teams link" }
        }
    }

}

describe("using chain of responsibility to deteamsify", () => {
    it("can detect that the empty string is invalid", () => {
        const result = new HasContent(new AlwaysSucceeds()).handle("")
        expect(result.error).to.eql("there must be content in the string")
    })

    it("can pass on to the second link in a chain when there is content in the input", () => {
        const result = new HasContent(
            new AlwaysSucceeds()
        ).handle("literally any content")
        expect(result.hiddenURL).to.eql("✅")
    })

    it("can have a chain that detects valid HTTP urls", () => {
        const chain = new HasContent(
            new IsHTTPURL(
                new AlwaysSucceeds()
            )
        )

        expect(chain.handle("some text")).to.haveOwnProperty("error")
        expect(chain.handle("ftp://example.io")).to.haveOwnProperty("error")
        expect(chain.handle("https://example.io")).to.haveOwnProperty("hiddenURL")
    })

    it("can have a chain that detects Teams urls", () => {
        const chain = new HasContent(
            new IsHTTPURL(
                new IsTeamsURL(
                    new AlwaysSucceeds()
                )
            )
        )

        expect(chain.handle("https://example.io")).to.haveOwnProperty("error")
        expect(chain.handle("https://teams.microsoft.com")).to.haveOwnProperty("hiddenURL")
    })
})