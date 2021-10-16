import * as TypeUtils from "./TypeUtils"
// @ponicode
describe("TypeUtils.TypeUtils.getWellKnownJsTypes", () => {
    test("0", () => {
        let callFunction: any = () => {
            TypeUtils.TypeUtils.getWellKnownJsTypes()
        }
    
        expect(callFunction).not.toThrow()
    })
})
