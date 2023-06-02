import { AuthenticationParams } from "@/domain/usecases";
import { AccountModel } from "../models";

export const mockAuthentication = (): AuthenticationParams => ({
    email: 'teste@teste.com',
    password: '123456789'
})

export const mockAccountModel = (): AccountModel => ({
    accessToken: 'fgasdgsadgdfbafdgdf5g4adsf5g4sad4g5sdg4'
})