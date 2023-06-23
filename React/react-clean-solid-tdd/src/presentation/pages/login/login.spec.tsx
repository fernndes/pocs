import React from 'react';
import { RenderResult, render, fireEvent, cleanup, waitFor } from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy } from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';

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

const simulateValidSubmit = (sut: RenderResult, email: string = 'any_email', password: string = 'any_password' ): void => {
    populateEmailField(sut, email)
    populatePasswordField(sut, password)
    
    const submitButton = sut.getByTestId('submit')
    fireEvent.submit(submitButton)
}

const populateEmailField = (sut: RenderResult, email: string = 'any_email'): void => {
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password: string = 'any_password'): void => {
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
    const emailStatus = sut.getByTestId(`${fieldName}-status`)
    expect(emailStatus.title).toBe(validationError || 'Ok')
    expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🟢')
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

        simulateStatusForField(sut, 'email', validationStub.errorMessage)
        simulateStatusForField(sut, 'password', validationStub.errorMessage)
    })
    test('Should show email error if validation fails', () => { 
        const { sut, validationStub } = makeSut({ validationError: 'Erro!' })

        populateEmailField(sut)
        
        simulateStatusForField(sut, 'email', validationStub.errorMessage)
    })
    test('Should show password error if validation fails', () => { 
        const { sut, validationStub } = makeSut({ validationError: 'Erro!' })

        populatePasswordField(sut)

        simulateStatusForField(sut, 'password', validationStub.errorMessage)
    })
    test('Should show valid email if validation succeeds', () => { 
        const { sut } = makeSut()

        populateEmailField(sut)

        simulateStatusForField(sut, 'email')
    })
    test('Should show valid password if validation succeeds', () => { 
        const { sut } = makeSut() 

        populatePasswordField(sut)

        simulateStatusForField(sut, 'email')
    })
    test('Should enable submit button if form is valid', () => { 
        const { sut } = makeSut()

        populateEmailField(sut)
        populatePasswordField(sut)
        
        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(false)
    })
    test('Should show spinner on submit', () => { 
        const { sut } = makeSut()

        simulateValidSubmit(sut)

        const spinner = sut.getByTestId('spinner')
        expect(spinner).toBeTruthy()
    })
    test('Should call Authentication with correct values', () => { 
        const { sut, authenticationSpy } = makeSut()

        simulateValidSubmit(sut, 'any_email', 'any_password')

        expect(authenticationSpy.params).toEqual({
            email: 'any_email',
            password: 'any_password'
        })
    })
    test('Should call Authentication only once', () => { 
        const { sut, authenticationSpy } = makeSut()

        simulateValidSubmit(sut)
        simulateValidSubmit(sut)

        expect(authenticationSpy.callsCount).toBe(1)
    })
    test('Should not call Authentication if form is invalid', () => { 
        const { sut, authenticationSpy } = makeSut({ validationError: 'Erro!' })

        populateEmailField(sut)
        fireEvent.submit(sut.getByTestId("form"))

        expect(authenticationSpy.callsCount).toBe(0)
    })
    test('Should present error if authentication fails', async () => { 
        const { sut, authenticationSpy } = makeSut()
        const error = new InvalidCredentialsError()
        jest.spyOn(authenticationSpy, 'auth').mockResolvedValueOnce(Promise.reject(error))

        simulateValidSubmit(sut)
        const errorWrap = sut.getByTestId('error-wrap')
        await waitFor(() => errorWrap)

        const mainError = sut.getByTestId("main-error")

        expect(mainError.textContent).toBe(error.message)
        expect(errorWrap.childElementCount).toBe(1)
    })
})