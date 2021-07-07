import * as mocha from 'mocha'
import { mightContainASecretHiddenLink } from '../src/url'
import * as chai from 'chai'
import { deteamsify } from '../src/deteamsifier'
import * as dirtyChai from 'dirty-chai'
const { expect } = chai
chai.use(dirtyChai)
const { describe, it } = mocha

describe('the URL', () => {
  describe('could be a viewer URL', () => {
    const exampleViewerUrl = 'https://teams.microsoft.com/_#/xlsx/viewer/teams/https:~2F~2Fomniclopse.sharepoint.com~2Fsites~2Fsecretproject~2FShared%20Documents~2FGeneral~2FProduct%20Catalogue%20Canonical%20v0.3.xlsx?threadId=19:z78QcbAZp4tI2FREQyObUQNofzVndaBjTJAoyGNCiUg1@thread.tacv2&messageId=1624873200942&baseUrl=https:~2F~2Fomniclopse.sharepoint.com~2Fsites~2Fsecretproject&fileId=8b0dff15-a36d-476d-8d42-aa566d3c3202&ctx=chiclet&viewerAction=view'
    const deteamedViewerURL = 'https://omniclopse.sharepoint.com/sites/secretproject/Shared%20Documents/General/Product%20Catalogue%20Canonical%20v0.3.xlsx?threadId=19:z78QcbAZp4tI2FREQyObUQNofzVndaBjTJAoyGNCiUg1@thread.tacv2&messageId=1624873200942&baseUrl=https://omniclopse.sharepoint.com/sites/secretproject&fileId=8b0dff15-a36d-476d-8d42-aa566d3c3202&ctx=chiclet&viewerAction=view'

    it('should be identifiable as a hidden link', () => {
      const x = mightContainASecretHiddenLink(new URL(exampleViewerUrl))
      expect(x).to.be.true()
    })

    it('should be able to get the viewer url out of the hash', () => {
      const x = deteamsify(new URL(exampleViewerUrl))
      expect(x).to.haveOwnProperty('downloadURL', deteamedViewerURL)
    })
  })
})
