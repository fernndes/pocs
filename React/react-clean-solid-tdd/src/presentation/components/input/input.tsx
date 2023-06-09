import React, { useContext } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
    const { state, setState } = useContext(Context)
    const error = state[`${props.name}Error`]

    const getStatus = (): string => error ? '🔴' : '🟢'
    const getTitle = (): string => error || 'Ok'

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }
    
    return (
        <div className={Styles.inputWrap}>
            <input {...props} data-testid={props.name} onChange={handleChange} />
            <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
        </div>
    )
}

export default Input