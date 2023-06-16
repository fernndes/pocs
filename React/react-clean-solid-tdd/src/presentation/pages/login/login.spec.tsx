import React from 'react';
import { RenderResult, render, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import { ValidationStub } from '@/presentation/test';
import { Authentication, AuthenticationParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';

class AuthenticationSpy implements Authentication {
    account = mockAccountModel()
    params: AuthenticationParams

    async auth(params: AuthenticationParams): Promise<AccountModel> {
        this.params = params
        return Promise.resolve(this.account)
    }
}

type SutTypes = {
    sut: RenderResult
    validationStub: ValidationStub
    authenticationSpy: AuthenticationSpy
}

type SutParams = {
    validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
    const validationStub = new ValidationStub()
    const authenticationSpy = new AuthenticationSpy()
    validationStub.errorMessage = params?.validationError
    const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />)
    return {
        sut,
        validationStub,
        authenticationSpy
    }
}

describe('Login Component', () => {
    afterEach(cleanup)
    test('Should not render spinner and error on start', async () => {
        const { sut } = makeSut({ validationError: 'Erro!' })

        const errorWrap = sut.getByTestId('error-wrap')
        expect(errorWrap.childElementCount).toBe(0)
    })
    test('Should start button with disable state', async () => {
        const { sut } = makeSut({ validationError: 'Erro!' })

        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(true)
    })
    test('Should start inputs with initial states', async () => {
        const { sut, validationStub } = makeSut({ validationError: 'Erro!' })

        const emailStatus = sut.getByTestId('email-status')
        expect(emailStatus.title).toBe(validationStub.errorMessage)
        expect(emailStatus.textContent).toBe('🔴')
        const passwordStatus = sut.getByTestId('password-status')
        expect(passwordStatus.textContent).toBe('🔴')
        expect(passwordStatus.title).toBe(validationStub.errorMessage)
    })
    test('Should show email error if validation fails', () => { 
        const { sut, validationStub } = makeSut({ validationError: 'Erro!' })

        const emailInput = sut.getByTestId('email')
        fireEvent.input(emailInput, { target: { value: 'any_email' } })
        const emailStatus = sut.getByTestId('email-status')
        expect(emailStatus.title).toBe(validationStub.errorMessage)
        expect(emailStatus.textContent).toBe('🔴')
    })
    test('Should show password error if validation fails', () => { 
        const { sut, validationStub } = makeSut({ validationError: 'Erro!' })

        const passwordInput = sut.getByTestId('password')
        fireEvent.input(passwordInput, { target: { value: 'any_password' } })
        const passwordStatus = sut.getByTestId('password-status')
        expect(passwordStatus.title).toBe(validationStub.errorMessage)
        expect(passwordStatus.textContent).toBe('🔴')
    })
    test('Should show valid email if validation succeeds', () => { 
        const { sut } = makeSut()

        const emailInput = sut.getByTestId('email')
        fireEvent.input(emailInput, { target: { value: 'any_email' } })
        const emailStatus = sut.getByTestId('email-status')
        expect(emailStatus.title).toBe('Ok')
        expect(emailStatus.textContent).toBe('🟢')
    })
    test('Should show valid password if validation succeeds', () => { 
        const { sut } = makeSut() 

        const passwordInput = sut.getByTestId('password')
        fireEvent.input(passwordInput, { target: { value: 'any_password' } })
        const passwordStatus = sut.getByTestId('password-status')
        expect(passwordStatus.title).toBe('Ok')
        expect(passwordStatus.textContent).toBe('🟢')
    })
    test('Should enable submit button if form is valid', () => { 
        const { sut } = makeSut()

        const emailInput = sut.getByTestId('email')
        fireEvent.input(emailInput, { target: { value: 'any_email' } })
        const passwordInput = sut.getByTestId('password')
        fireEvent.input(passwordInput, { target: { value: 'any_password' } })
        
        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(false)
    })
    test('Should show spinner on submit', () => { 
        const { sut } = makeSut()

        const emailInput = sut.getByTestId('email')
        fireEvent.input(emailInput, { target: { value: 'any_email' } })
        const passwordInput = sut.getByTestId('password')
        fireEvent.input(passwordInput, { target: { value: 'any_password' } })
        
        const submitButton = sut.getByTestId('submit')
        fireEvent.submit(submitButton)

        const spinner = sut.getByTestId('spinner')
        expect(spinner).toBeTruthy()
    })
    test('Should call Authentication with correct values', () => { 
        const { sut, authenticationSpy } = makeSut()

        const emailInput = sut.getByTestId('email')
        fireEvent.input(emailInput, { target: { value: 'any_email' } })
        const passwordInput = sut.getByTestId('password')
        fireEvent.input(passwordInput, { target: { value: 'any_password' } })
        
        const submitButton = sut.getByTestId('submit')
        fireEvent.submit(submitButton)

        expect(authenticationSpy.params).toEqual({
            email: 'any_email',
            password: 'any_password'
        })
    })
})