import axios from 'axios';

export const mockAxios = (): jest.Mocked<typeof axios> => {
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.post.mockResolvedValue({ 
        data: { name: 'João', lastName: 'Garcia' },
        status: 200
    })
    return mockedAxios
}