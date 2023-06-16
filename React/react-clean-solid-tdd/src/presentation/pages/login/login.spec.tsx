import React from 'react';
import { RenderResult, render, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import { ValidationSpy } from '@/presentation/test';

type SutTypes = {
    sut: RenderResult
    validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy()
    const sut = render(<Login validation={validationSpy} />)
    return {
        sut,
        validationSpy
    }
}

describe('Login Component', () => {
    afterEach(cleanup)
    test('Should not render spinner and error on start', async () => {
        const { sut } = makeSut()
        const errorWrap = sut.getByTestId('error-wrap')
        expect(errorWrap.childElementCount).toBe(0)
    })
    test('Should start button with disable state', async () => {
        const { sut } = makeSut()
        const submitButton = sut.getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(true)
    })
    test('Should start inputs with initial states', async () => {
        const { sut } = makeSut()
        const emailStatus = sut.getByTestId('email-status')
        expect(emailStatus.title).toBe('Campo obrigatório')
        expect(emailStatus.textContent).toBe('🔴')
        const passwordStatus = sut.getByTestId('password-status')
        expect(passwordStatus.textContent).toBe('🔴')
        expect(passwordStatus.title).toBe('Campo obrigatório')
    })
    test('Should call validation with correct email', async () => {
        const { sut, validationSpy } = makeSut()
        const emailInput = sut.getByTestId('email')
        fireEvent.input(emailInput, { target: { value: 'any_email' } })
        expect(validationSpy.fieldName).toBe('email')
        expect(validationSpy.fieldValue).toBe('any_email')
    })
    test('Should call validation with correct password', () => { 
        const { sut, validationSpy } = makeSut()
        const passwordInput = sut.getByTestId('password')
        fireEvent.input(passwordInput, { target: { value: 'any_password' } })
        expect(validationSpy.fieldName).toBe('password')
        expect(validationSpy.fieldValue).toBe('any_password')
     })
})