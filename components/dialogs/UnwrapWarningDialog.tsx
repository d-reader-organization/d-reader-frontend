import { Checkbox, CircularProgress, FormControlLabel } from '@mui/material'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import ConnectButton from '../buttons/ConnectButton'
import { useLocalStorage } from '@solana/wallet-adapter-react'

interface Props extends DialogProps {
	onClose: VoidFunction
	handleUnwrap: () => Promise<void>
	isLoading: boolean
}

const UnwrapWarningDialog: React.FC<Props> = ({ open, onClose, handleUnwrap, isLoading, ...props }) => {
	const [isUnwrapWarningRead, setIsUnwrapWarningRead] = useLocalStorage('unwrapWarning', false)
	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)' }}
			PaperProps={{ className: 'unwrap-warning-dialog' }}
			onClose={onClose}
			open={open}
			{...props}
		>
			<div className='content-wrapper '>
				<div>
					<p className='dialog-title'>Comic Unwrapping</p>
					<p className='dialog-content'>
						By unwrapping the comic, you&quot;ll be able to read it. This action is irreversible and will make the comic
						lose the mint condition.
					</p>
				</div>
				<ConnectButton className='unwrap-button' onClick={handleUnwrap}>
					{isLoading ? <CircularProgress className='loading-spinner' size={24} /> : 'Unwrap'}
				</ConnectButton>
				<FormControlLabel
					control={<Checkbox />}
					className='ask-again-check'
					sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }}
					onChange={() => setIsUnwrapWarningRead(!isUnwrapWarningRead)}
					label={<span style={{ fontSize: '15px' }}>{"Don't ask me again"}</span>}
				/>
			</div>
		</Dialog>
	)
}

export default UnwrapWarningDialog
