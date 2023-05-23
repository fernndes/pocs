import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { RemoteAuthentication } from "./remote-authentication"
import { HttpPostClientSpy } from "@/data/test/mock-http-client"
import { InvalidCredentialsError } from "@/domain/errors/invalid-credentials-error"
import { mockAuthentication } from "@/domain/test/mock-authentication"

type SutTypes = {
    sut: RemoteAuthentication
    httpPostClientSpy: HttpPostClientSpy
}

const makeSut = (url: string = 'any_url'): SutTypes => {
    const httpPostClientSpy = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)
    return {
        sut,
        httpPostClientSpy
    }
}

describe('RemoteAuthentication', () => {
    test('Should call HttpPostClient with correct URL', async () => {
        const url = 'other_url'
        const { sut, httpPostClientSpy } = makeSut(url)
        await sut.auth(mockAuthentication())
        expect(httpPostClientSpy.url).toBe(url)
    })

    test('Should call HttpPostClient with correct body', async () => {
        const { sut, httpPostClientSpy } = makeSut()
        const authParams = mockAuthentication()
        await sut.auth(authParams)
        expect(httpPostClientSpy.body).toEqual(authParams)
    })

    test('Should throw InvalidCredentialsError if HttpClient returns 401', async () => {
        const { sut, httpPostClientSpy } = makeSut()
        httpPostClientSpy.response = {
            statusCode: HttpStatusCode.unauthorized
        }
        const promise = sut.auth(mockAuthentication())
        expect(promise).rejects.toThrow(new InvalidCredentialsError())
    })
})