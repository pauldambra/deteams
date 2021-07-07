import * as mocha from 'mocha'
import { mightContainASecretHiddenLink } from '../src/url'
import * as chai from 'chai'
import { deteamsify } from '../src/deteamsifier'
import * as dirtyChai from 'dirty-chai'
const { expect } = chai
chai.use(dirtyChai)
const { describe, it } = mocha

describe('the URL', () => {
  describe('could be a hidden browser URL', () => {
    const exampleBrowserURL = 'https://teams.microsoft.com/l/file/9FB3E96B-64F4-4971-8D05-5F36D13979FB?tenantId=834fb7b4-624d-4de8-a977-2d46ad979bd9&fileType=docx&objectUrl=https%3A%2F%2Fexample.sharepoint.com%2Fsites%2FCLSwebsitereplatforming%2FShared%20Documents%2FGeneral%2FMedia%20centre%20tag%20testments.docx&baseUrl=https%3A%2F%example.sharepoint.com%2Fsites%2FCLSwebsitereplatforming&serviceName=teams&threadId=19:e6476e72f6ec479985f6beaa3276f894@thread.skype&groupId=7794dbcd-799a-48a1-8f71-d597e8b69a23'
    const deteamedBrowserURL = 'https://example.sharepoint.com/sites/CLSwebsitereplatforming/Shared Documents/General/Media centre tag testments.docx'

    it('should be identifiable as a hidden link', () => {
      const x = mightContainASecretHiddenLink(new URL(exampleBrowserURL))
      expect(x).to.be.true()
    })

    it('should be able to get the hidden url out of the hash', () => {
      const x = deteamsify(new URL(exampleBrowserURL))
      expect(x).to.haveOwnProperty('hiddenURL', deteamedBrowserURL)
    })

    it('should work for the example in the README', () => {
      const x = deteamsify(new URL("https://teams.microsoft.com/l/file/9FB3E96B-64F4-4971-8D05-5F36D13979FB?tenantId=834fb7b4-624d-4de8-a977-2d46ad979bd9&fileType=docx&objectUrl=https%3A%2F%2Fexample.sharepoint.com%2Fsites%2FCLSwebsitereplatforming%2FShared%20Documents%2FGeneral%2FMedia%20centre%20tag%20requirements.docx&baseUrl=https%3A%2F%example.sharepoint.com%2Fsites%2FCLSwebsitereplatforming&serviceName=teams&threadId=19:e6476e72f6ec479985f6beaa3276f894@thread.skype&groupId=7794dbcd-799a-48a1-8f71-d597e8b69a23"))
      expect(x).to.haveOwnProperty('hiddenURL', 'https://example.sharepoint.com/sites/CLSwebsitereplatforming/Shared Documents/General/Media centre tag requirements.docx')
    })
  })
})
