import { useState, useMemo, useCallback, createContext, useContext } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'
import axios, { AxiosError } from 'axios'

interface Toast {
	message: string
	severity?: AlertColor
	isOpen: boolean
}

interface ToastContextState {
	add: (message: string, severity: AlertColor) => void
	onQueryError: (error: Error) => void
}

const initialContextValue: ToastContextState = {
	add: () => {
		return
	},
	onQueryError: () => {
		return
	},
}

export const ToastContext = createContext<ToastContextState>(initialContextValue)

export const initialToastState: Toast = {
	message: '',
	severity: undefined,
	isOpen: false,
}

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [toast, setToast] = useState(initialToastState)

	const add = useCallback((message: string, severity: AlertColor) => {
		setToast({ message: message || '', severity, isOpen: true })
	}, [])

	const remove = () => setToast((prevToast) => ({ ...prevToast, isOpen: false }))

	const onQueryError = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(error: any | AxiosError<any>) => {
			let message = ''
			if (axios.isAxiosError(error)) {
				message = error.response?.data.message
			} else {
				if (Array.isArray(error?.message)) {
					message = error.message.join(', ')
				} else message = error?.message
			}

			add(message, 'error')
		},
		[add]
	)

	const value = useMemo(() => ({ add, onQueryError }), [add, onQueryError])

	return (
		<ToastContext.Provider value={value}>
			{children}
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				autoHideDuration={3000}
				open={toast.isOpen}
				onClose={remove}
				style={{ zIndex: 2001 }}
			>
				<Alert
					classes={{ root: 'snackbar-alert', message: 'snackbar-message' }}
					elevation={6}
					variant='filled'
					severity={toast.severity}
				>
					{toast.message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	)
}

export default ToastProvider

export const useToaster = (): ToastContextState => useContext(ToastContext)
