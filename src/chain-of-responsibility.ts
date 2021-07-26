export interface ChainResult {
    error?: string,
    hiddenURL?: string,
    downloadURL?: string
}

export interface ChainLink<TReceive> {
    handle: (x: TReceive) => ChainResult
}

export class HasContent implements ChainLink<string> {
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

export class IsHTTPURL implements ChainLink<string> {
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

export class IsTeamsURL implements ChainLink<URL> {
    private nextLink: ChainLink<URL>;

    constructor(nextLink: ChainLink<URL>) {
        this.nextLink = nextLink;
    }

    handle(url: URL): ChainResult {
        if (url.host === 'teams.microsoft.com') {
            return this.nextLink.handle(url)
        } else {
            return { error: "that's not a Teams link" }
        }
    }

}

export class TypeOfTeamsURL implements ChainLink<URL> {
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

export class ReadTeamsLinkFromSearchParams implements ChainLink<URL>{
    handle(url: URL): ChainResult {
        const searchParams = url.searchParams
        const hiddenURL = searchParams.get('objectUrl')
        return hiddenURL ? { hiddenURL } : { error: 'unexpected error, maybe refresh and try again' }
    }
}

export class ReadViewerURLFromHash implements ChainLink<URL>{
    handle(url: URL): ChainResult {
        const hash = url.hash
        if (!hash.startsWith('#/xlsx/viewer/teams/')) {
            return { error: "this viewer URL can't be processed, please report a bug"}
        }
        const downloadURL = hash.replace(/^#\/xlsx\/viewer\/teams\//, '').replace(/~2F/g, '/')
        return { downloadURL: downloadURL }
    }
}

export const createChain = () => new HasContent(
    new IsHTTPURL(
        new IsTeamsURL(
            new TypeOfTeamsURL(
                new ReadTeamsLinkFromSearchParams(),
                new ReadViewerURLFromHash()
            )
        )
    )
)