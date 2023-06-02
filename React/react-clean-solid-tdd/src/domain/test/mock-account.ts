import { AuthenticationParams } from "@/domain/usecases/authentication";
import { AccountModel } from "../models/account-model";

export const mockAuthentication = (): AuthenticationParams => ({
    email: 'teste@teste.com',
    password: '123456789'
})

export const mockAccountModel = (): AccountModel => ({
    accessToken: 'fgasdgsadgdfbafdgdf5g4adsf5g4sad4g5sdg4'
})