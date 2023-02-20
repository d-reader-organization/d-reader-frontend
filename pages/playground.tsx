import { useState } from 'react'
import type { NextPage } from 'next'
import Navigation from 'components/layout/Navigation'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'
import { useCrossDeviceWallet, decodeTransaction } from '@open-sauce/solomon'
import { Box, Button, TextField, Typography } from '@mui/material'
import http from 'api/http'

const fetchMintTransaction = async (): Promise<string> => {
	const response = await http.get<string>('playground/transactions/construct/mint-one', {
		params: { candyMachineAddress: '8WyvLCSsB7nXXn49CsHp26v3geJk3zZRWtTpd6LPvNz9' },
	})
	return response.data
}

const Playground: NextPage = () => {
	const { signAndSendTransaction } = useCrossDeviceWallet()
	const [apiRoute, setApiRoute] = useState('')
	const [lastSignature, setLastSignature] = useState('')

	const genericFetch = async () => {
		const response = await http.get<string>(apiRoute)
		const encodedTransaction = decodeTransaction(response.data)
		const signature = await signAndSendTransaction(encodedTransaction)
		setLastSignature(signature)
	}

	const mintOne = async () => {
		const response = await fetchMintTransaction()
		const encodedTransaction = decodeTransaction(response)
		const signature = await signAndSendTransaction(encodedTransaction)
		setLastSignature(signature)
	}

	const buy = () => {
		console.log('bought')
	}
	const list = () => {
		console.log('listed')
	}
	const fetch = () => {
		console.log('fetched')
	}

	return (
		<>
			<Navigation />

			<Main className='main'>
				<Box className='playground'>
					<Box className='playground-input'>
						<TextField
							value={apiRoute}
							placeholder='API route to fetch tx from'
							variant='filled'
							onChange={(e) => {
								setApiRoute(e.target.value)
							}}
							size='small'
							fullWidth
						/>
					</Box>
					<Box className='playground-buttons'>
						<Button onClick={genericFetch}>Generic</Button>
						<Button onClick={mintOne}>Mint</Button>
						<Button onClick={buy}>Buy</Button>
						<Button onClick={list}>Sell</Button>
						<Button onClick={fetch}>Fetch</Button>
					</Box>
				</Box>
				<Typography>
					<strong>Last signature: </strong>
					<span className='text--important'>{lastSignature || '------'}</span>
				</Typography>
			</Main>

			<Footer />
		</>
	)
}

export default Playground
