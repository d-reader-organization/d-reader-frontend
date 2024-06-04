import React from 'react'
import Dialog from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import useToggle from '@/hooks/useToggle'
import { useRequestUserPasswordReset } from '@/api/user/queries/useRequestUserPasswordReset'

export const ForgotPasswordDialog: React.FC = () => {
	const [passwordDialogOpen, togglePasswordDialog] = useToggle()
	const { mutateAsync: requestPasswordReset } = useRequestUserPasswordReset()
	const [forgotPasswordEmailOrName, setForgotPasswordEmailOrName] = React.useState('')

	const handleForgotPasswordEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForgotPasswordEmailOrName(event.target.value)
	}
	return (
		<>
			<Button
				onClick={togglePasswordDialog}
				type='button'
				backgroundColor='transparent'
				// borderColor='grey-300'
				className='action-button action-button--forgot-password'
			>
				Forgot password?
			</Button>
			<Dialog
				style={{ backdropFilter: 'blur(4px)' }}
				PaperProps={{ className: 'action-dialog forgot-password-dialog' }}
				onClose={togglePasswordDialog}
				maxWidth='xs'
				open={passwordDialogOpen}
			>
				<div className='close-icon-wrapper'>
					<CloseIcon className='close-icon' onClick={togglePasswordDialog} />
				</div>

				<div className='dialog-content'>
					<strong>Reset password</strong>
					<p>
						Type in your email address to send password reset instructions to your mail inbox. Make sure to check your
						spam folder!
					</p>
					<Input
						type='text'
						placeholder='john.doe@dreader.io'
						className='forgot-password-input'
						value={forgotPasswordEmailOrName}
						onChange={handleForgotPasswordEmailChange}
					/>
				</div>

				<div className='dialog-actions'>
					<Button naked onClick={togglePasswordDialog}>
						Cancel
					</Button>
					<Button
						naked
						onClick={async () => {
							await requestPasswordReset({ nameOrEmail: forgotPasswordEmailOrName })
							setForgotPasswordEmailOrName('')
							togglePasswordDialog()
						}}
					>
						Send
					</Button>
				</div>
			</Dialog>
		</>
	)
}
