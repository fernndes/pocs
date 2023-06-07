import { HttpPostParams } from "@/data/protocols/http";
import { AxiosHttpClient } from "./axios-http-client";
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>

const makeSut = (): AxiosHttpClient => {
    return new AxiosHttpClient()
}

const mockPostRequest = (): HttpPostParams<any> => ({
    url: 'any_url',
    body: { name: 'João', lastName: 'Garcia' }
})

describe('AxiosHttpClient', () => {
    test('Should call axios with correct URL and verb', async () => {
        const request = mockPostRequest()
        const sut = makeSut()
        await sut.post(request)
        expect(mockedAxios.post).toHaveBeenCalledWith(request.url)
     })
});