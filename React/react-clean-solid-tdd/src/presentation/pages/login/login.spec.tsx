import React from 'react';
import { render } from '@testing-library/react'
import Login from './login'

describe('Login Component', () => {

    test('Should not render spinner and error on start', async () => {
        const { getByTestId } = render(<Login/>)        
        const errorWrap = getByTestId('error-wrap')
        expect(errorWrap.childElementCount).toBe(0)
    })
    test('Should start button with disable state', async () => {
        const { getByTestId } = render(<Login/>)
        const submitButton = getByTestId('submit') as HTMLButtonElement
        expect(submitButton.disabled).toBe(true)
    })
    test('Should start inputs with initial states', async () => {
        const { getByTestId } = render(<Login/>)
        const emailStatus = getByTestId('email-status')
        expect(emailStatus.title).toBe('Campo obrigatório')
        expect(emailStatus.textContent).toBe('🔴')
        const passwordStatus = getByTestId('password-status')
        expect(passwordStatus.textContent).toBe('🔴')
        expect(passwordStatus.title).toBe('Campo obrigatório')
    })
})