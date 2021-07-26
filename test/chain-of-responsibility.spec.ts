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

    const testCases = [
        {
            userInput: "",
            expectedProperty: "error",
            expectedValue: "there must be content in the string"
        },
        {
            userInput: "literally any content",
            expectedProperty: "error",
            expectedValue: "you must provide a web URL"
        },
        {
            userInput: "ftp://example.io",
            expectedProperty: "error",
            expectedValue: "you must provide a web URL"
        },
        {
            userInput: "https://example.io",
            expectedProperty: "error",
            expectedValue: "that's not a Teams link"
        },
        {
            userInput: "https://teams.microsoft.com",
            expectedProperty: "error",
            expectedValue: "That teams link does not contain a hidden link. to deteamsify - just stop using teams"
        },
        {
            userInput: "https://teams.microsoft.com?anything=something",
            expectedProperty: "error",
            expectedValue: "That teams link does not contain a hidden link. to deteamsify - just stop using teams"
        },
        {
            userInput: "https://teams.microsoft.com#something",
            expectedProperty: "error",
            expectedValue: "That teams link does not contain a hidden link. to deteamsify - just stop using teams"
        },
        {
            userInput: "https://teams.microsoft.com/thread.skype",
            expectedProperty: "error",
            expectedValue: "That teams link does not contain a hidden link. It looks like a link to a teams team team channel, you might have to use teams 🤬"
        },
        {
            userInput: "https://teams.microsoft.com/channel",
            expectedProperty: "error",
            expectedValue: "That teams link does not contain a hidden link. It looks like a link to a teams team team channel, you might have to use teams 🤬"
        },
        {
            userInput: "https://teams.microsoft.com?anything=https%3A%2F%2F",
            expectedProperty: "error",
            expectedValue: "unexpected error, maybe refresh and try again"
        },
        {
            userInput: "https://teams.microsoft.com#https:~2F~2F",
            expectedProperty: "error",
            expectedValue: "this viewer URL can't be processed, please report a bug"
        },
        {
            userInput: "https://teams.microsoft.com?objectUrl=https%3A%2F%2Fexample.sharepoint.com%2Fsites%2F",
            expectedProperty: "hiddenURL",
            expectedValue: "https://example.sharepoint.com/sites/"
        },
        {
            userInput: "https://teams.microsoft.com/_#/xlsx/viewer/teams/https:~2F~2Fomniclopse.sharepoint.com~2Fsites~2F",
            expectedProperty: "downloadURL",
            expectedValue: "https://omniclopse.sharepoint.com/sites/"
        },
    ]

    testCases.forEach((testCase) => {
        it(`on receiving userInput: "${testCase.userInput}" chain outputs an: "${testCase.expectedProperty}"`, () => {
            const result = createChain().handle(testCase.userInput)
            expect(result)
                .to.haveOwnProperty(
                    testCase.expectedProperty,
                    testCase.expectedValue
                )
        })
    })

})