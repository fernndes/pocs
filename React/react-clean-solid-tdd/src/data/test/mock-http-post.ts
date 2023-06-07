import { HttpPostParams } from "../protocols/http";

export const mockPostRequest = (): HttpPostParams<any> => ({
    url: 'any_url',
    body: { name: 'João', lastName: 'Garcia' }
})