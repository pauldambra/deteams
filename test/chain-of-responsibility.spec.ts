import * as mocha from 'mocha'
import * as chai from 'chai'
import * as dirtyChai from 'dirty-chai'
import { createChain } from "../src/chain-of-responsibility";
const { expect } = chai
chai.use(dirtyChai)
const { describe, it } = mocha

describe("using chain of responsibility to deteamsify", () => {

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
        {
            userInput: "https://teams.microsoft.com/l/file/9FB3E96B-64F4-4971-8D05-5F36D13979FB?tenantId=834fb7b4-624d-4de8-a977-2d46ad979bd9&fileType=docx&objectUrl=https%3A%2F%2Fexample.sharepoint.com%2Fsites%2FCLSwebsitereplatforming%2FShared%20Documents%2FGeneral%2FMedia%20centre%20tag%20testments.docx&baseUrl=https%3A%2F%example.sharepoint.com%2Fsites%2FCLSwebsitereplatforming&serviceName=teams&threadId=19:e6476e72f6ec479985f6beaa3276f894@thread.skype&groupId=7794dbcd-799a-48a1-8f71-d597e8b69a23",
            expectedProperty: "hiddenURL",
            expectedValue: "https://example.sharepoint.com/sites/CLSwebsitereplatforming/Shared Documents/General/Media centre tag testments.docx"
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