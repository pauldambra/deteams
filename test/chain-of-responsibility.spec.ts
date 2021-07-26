import * as mocha from 'mocha'
import * as chai from 'chai'
import * as dirtyChai from 'dirty-chai'
const { expect } = chai
chai.use(dirtyChai)
const { describe, it } = mocha

interface ChainResult {
    error?: string,
    hiddenURL?: string,
    downloadURL?: string
}

interface ChainLink<TReceive> {
    handle: (x: TReceive) => ChainResult
}

class HasContent implements ChainLink<string> {
    private nextLink: ChainLink<string>;
    constructor(nextLink: ChainLink<string>) {
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

class AlwaysSucceedsWithATick implements ChainLink<string | URL> {
    handle(s: string | URL): ChainResult {
        return { hiddenURL: "✅" };
    }
}

class AlwaysSucceedsWithASmile implements ChainLink<string | URL> {
    handle(s: string | URL): ChainResult {
        return { hiddenURL: "😊" };
    }
}

class IsHTTPURL implements ChainLink<string> {
    private nextLink: ChainLink<URL>;
    constructor(nextLink: ChainLink<URL>) {
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
            return this.nextLink.handle(url)
        } else {
            return { error: "you must provide a web URL" }
        }
    }

}

class IsTeamsURL implements ChainLink<URL> {
    private nextLink: ChainLink<URL>;
    constructor(nextLink: ChainLink<URL>) {
        this.nextLink = nextLink;

    }

    handle(u: URL): ChainResult {
        if (u.host === 'teams.microsoft.com') {
            return this.nextLink.handle(u)
        } else {
            return { error: "that's not a Teams link" }
        }
    }

}

class TypeOfTeamsURL implements ChainLink<URL> {
    private linkInSearchParamNext: ChainLink<URL>;
    private viewerURLINHashNext: ChainLink<URL>;

    constructor(
        linkInSearchParamNext: ChainLink<URL>,
        viewerURLINHashNext: ChainLink<URL>) {
        this.linkInSearchParamNext = linkInSearchParamNext;
        this.viewerURLINHashNext = viewerURLINHashNext;
    }

    handle(url: URL): ChainResult {
        const hasLinkInSearchParam = (u: URL) => u && u.search && u.search.includes('https%3A%2F%2F')
        const hasViewerUrlInHash = (u: URL) => u && u.hash && u.hash.includes('https:~2F~2F')

        if (hasLinkInSearchParam(url)) {
            return this.linkInSearchParamNext.handle(url)
        } else if (hasViewerUrlInHash(url)) {
            return this.viewerURLINHashNext.handle(url)
        } else if (url.pathname.includes('channel') || url.pathname.includes('thread.skype')) {
            return { error: 'That teams link does not contain a hidden link. It looks like a link to a teams team team channel, you might have to use teams 🤬' }
        } else {
            return { error: 'That teams link does not contain a hidden link. to deteamsify - just stop using teams' }
        }

    }

}

class ReadTeamsLinkFromSearchParams implements ChainLink<URL>{
    handle(url: URL): ChainResult {
        const searchParams = url.searchParams
        // todo: write a test on this error case for this link in isolation
        const hiddenURL = searchParams.get('objectUrl')
        return hiddenURL ? { hiddenURL } : { error: 'unexpected error, maybe refresh and try again' }
    }
}

class ReadViewerURLFromHash implements ChainLink<URL>{
    handle(u: URL): ChainResult {
        const hash = u.hash
        if (!hash.startsWith('#/xlsx/viewer/teams/')) {
            return { error: "this viewer URL can't be processed, please report a bug"}
        }
        const downloadURL = hash.replace(/^#\/xlsx\/viewer\/teams\//, '').replace(/~2F/g, '/')
        return { downloadURL: downloadURL }
    }
}

describe("using chain of responsibility to deteamsify", () => {
    const createChain = () => new HasContent(
        new IsHTTPURL(
            new IsTeamsURL(
                new TypeOfTeamsURL(
                    new ReadTeamsLinkFromSearchParams(),
                    new ReadViewerURLFromHash()
                )
            )
        )
    )

    it("can detect that the empty string is invalid", () => {
        const result = createChain().handle("")
        expect(result.error).to.eql("there must be content in the string")
    })

    it("can pass on to the second link in a chain when there is content in the input", () => {
        const result = createChain().handle("literally any content")
        expect(result).to.haveOwnProperty("error", "you must provide a web URL")
    })

    it("can have a chain that detects valid HTTP urls", () => {
        const chain = createChain()

        expect(chain.handle("some text")).to.haveOwnProperty("error")
        expect(chain.handle("ftp://example.io")).to.haveOwnProperty("error")
        expect(chain.handle("https://example.io"))
            .to.haveOwnProperty("error", 'that\'s not a Teams link')
    })

    it("can have a chain that detects Teams urls", () => {
        const chain = createChain()

        expect(chain.handle("https://example.io")).to.haveOwnProperty("error")
        expect(chain.handle("https://teams.microsoft.com"))
            .to.haveOwnProperty("error", "That teams link does not contain a hidden link. to deteamsify - just stop using teams")
    })

    it("can have a chain that decides between two paths", () => {
        const chain = createChain()

        expect(chain.handle("https://teams.microsoft.com?anything=something"))
            .to.haveOwnProperty("error")
        expect(chain.handle("https://teams.microsoft.com#something"))
            .to.haveOwnProperty("error")
        expect(chain.handle("https://teams.microsoft.com/thread.skype"))
            .to.haveOwnProperty("error")
        expect(chain.handle("https://teams.microsoft.com/channel"))
            .to.haveOwnProperty("error")
        expect(chain.handle("https://teams.microsoft.com?anything=https%3A%2F%2F"))
            .to.haveOwnProperty("error", "unexpected error, maybe refresh and try again")
        expect(chain.handle("https://teams.microsoft.com#https:~2F~2F"))
            .to.haveOwnProperty("error", "this viewer URL can't be processed, please report a bug")
    })

    it('can have a chain which can read the hidden link from search params', () => {
        const chain = createChain()

        expect(chain.handle("https://teams.microsoft.com?objectUrl=https%3A%2F%2Fexample.sharepoint.com%2Fsites%2F"))
            .to.haveOwnProperty("hiddenURL", "https://example.sharepoint.com/sites/")

        expect(chain.handle("https://teams.microsoft.com#https:~2F~2F"))
            .to.haveOwnProperty("error", "this viewer URL can't be processed, please report a bug")
    })

    it('can have a chain which can read the viewer URL from the URL hash', () => {
        const chain = createChain()

        expect(chain.handle("https://teams.microsoft.com?not-an-object-url=some-content"))
            .to.haveOwnProperty("error")

        expect(chain.handle("https://teams.microsoft.com/_#/xlsx/viewer/teams/https:~2F~2Fomniclopse.sharepoint.com~2Fsites~2F"))
            .to.haveOwnProperty("downloadURL", "https://omniclopse.sharepoint.com/sites/")
    })
})