import { AuthenticationParams } from "@/domain/usecases/authentication";

export const mockAuthentication = (): AuthenticationParams => ({
    email: 'teste@teste.com',
    password: '123456789'
})