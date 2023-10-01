'use client'

import { useState, useMemo, useCallback, createContext, useContext } from 'react'

import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { FieldValues, FieldErrors } from 'react-hook-form'
import axios, { AxiosError } from 'axios'

interface Toast {
	message: React.ReactNode
	severity?: AlertColor
	isOpen: boolean
	duration: number | null
}

interface ToastContextState {
	add: (message: React.ReactNode, severity: AlertColor) => void
	uploadingFiles: VoidFunction
	onQueryError: (error: Error) => void
	onFormError: <T extends FieldValues = FieldValues>(errors: FieldErrors<T>) => void
}

const initialContextValue: ToastContextState = {
	add: () => {},
	uploadingFiles: () => {},
	onQueryError: () => {},
	onFormError: () => {},
}

export const ToastContext = createContext<ToastContextState>(initialContextValue)

const defaultAutoHideDuration = 4000

export const initialToastState: Toast = {
	message: '',
	severity: undefined,
	isOpen: false,
	duration: defaultAutoHideDuration,
}

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [toast, setToast] = useState(initialToastState)

	const add = useCallback((message: React.ReactNode, severity: AlertColor, duration = defaultAutoHideDuration) => {
		setToast({ message: message || '', severity, isOpen: true, duration })
	}, [])

	const uploadingFiles = useCallback(() => {
		setToast({ message: 'Uploading file(s)', severity: 'info', isOpen: true, duration: null })
	}, [])

	const remove = () => {
		setToast((prevToast) => ({ ...prevToast, isOpen: false, duration: defaultAutoHideDuration }))
	}

	const onFormError = useCallback(
		<T extends FieldValues = FieldValues>(errors: FieldErrors<T>) => {
			const [, errorValue] = Object.entries(errors)[0]
			if (errorValue?.message) {
				add(<>{errorValue.message}</>, 'error')
			}
		},
		[add]
	)

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

	const value = useMemo(
		() => ({ add, uploadingFiles, onQueryError, onFormError }),
		[add, uploadingFiles, onQueryError, onFormError]
	)

	return (
		<ToastContext.Provider value={value}>
			{children}
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				autoHideDuration={toast.duration}
				open={toast.isOpen}
				onClose={toast.duration === null ? undefined : remove}
				style={{ zIndex: 2001 }}
			>
				<Alert
					classes={{ root: 'snackbar-alert', message: 'snackbar-message' }}
					elevation={6}
					variant='filled'
					severity={toast.severity}
					style={{ alignItems: 'center' }}
					icon={toast.duration === null ? <CircularProgress size={18} /> : undefined}
				>
					{toast.message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	)
}

export default ToastProvider

export const useToaster = (): ToastContextState => useContext(ToastContext)
