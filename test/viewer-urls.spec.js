import { mightContainASecretHiddenLink } from "../src/url";
import {expect} from "chai";
import { deteamsify } from '../src/deteamsifier'

describe('the URL', () => {
    describe('could be a viewer URL', () => {
        const exampleViewerUrl = "https://teams.microsoft.com/_#/xlsx/viewer/teams/https:~2F~2Fomniclopse.sharepoint.com~2Fsites~2Fsecretproject~2FShared%20Documents~2FGeneral~2FProduct%20Catalogue%20Canonical%20v0.3.xlsx?threadId=19:z78QcbAZp4tI2FREQyObUQNofzVndaBjTJAoyGNCiUg1@thread.tacv2&messageId=1624873200942&baseUrl=https:~2F~2Fomniclopse.sharepoint.com~2Fsites~2Fsecretproject&fileId=8b0dff15-a36d-476d-8d42-aa566d3c3202&ctx=chiclet&viewerAction=view"
        const deteamedViewerURL = "https://omniclopse.sharepoint.com/:x:/r/sites/secretproject/_layouts/15/Doc.aspx?sourcedoc=%7B8B0DFF15-A36D-476D-8D42-AA566D3C3202%7D&file=Product%20Catalogue%20Canonical%20v0.3.xlsx&action=edit&mobileredirect=true&wdPreviousSession=f8bc9ddd-8288-4bf5-85e9-5d8d42ac6b27&wdOrigin=TEAMS-WEB.teams.undefined&cid=0af7ea38-7dc5-4e25-a46b-bee1a89af24c\n"

        it('should be identifiable as a hidden link', () => {
            const x = mightContainASecretHiddenLink(new URL(exampleViewerUrl))
            expect(x).to.be.true
        })

        it('should be able to get the viewer url out of the hash', () => {
            const x = deteamsify(new URL(exampleViewerUrl))
            expect(x).to.eq(deteamedViewerURL)
        })
    })

})