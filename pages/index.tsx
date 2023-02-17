import { useState } from 'react'
import type { NextPage } from 'next'
import Navigation from 'components/layout/Navigation'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'
import useTransaction from 'hooks/useTransaction'
import { Box, Button, TextField, Typography } from '@mui/material'
// import { useFetchMintTransaction } from 'api/playground'
import http from 'api/http'

const fetchMintTransaction = async (): Promise<string> => {
	const response = await http.get<string>('playground/transactions/construct/mint-one', {
		params: { candyMachineAddress: 'GWFHihr9B8ntBiTQWeVh7oZXCbmTUQLdqcfdhgsfRwgf' },
	})
	return response.data
}

const Home: NextPage = () => {
	const { decodeBase58SignAndSend, decodeBase64SignAndSend } = useTransaction()
	const [apiRoute, setApiRoute] = useState('')
	const [lastTransaction, setLastTransaction] = useState('')
	const [lastSignature, setLastSignature] = useState('')
	const [encoding, setEncoding] = useState<'base64' | 'base58'>('base64')
	// const { refetch, data: encodedTransaction } = useFetchMintTransaction()

	const toggleEncoding = () => {
		setEncoding((prevEncoding) => {
			if (prevEncoding === 'base64') return 'base58'
			else return 'base64'
		})
	}

	const decodeSignAndSend = async (encodedTransaction: string) => {
		console.log('encoding: ', encodedTransaction)
		if (encoding === 'base64') return await decodeBase64SignAndSend(encodedTransaction)
		else return await decodeBase58SignAndSend(encodedTransaction)
	}

	const genericFetch = async () => {
		const response = await http.get<string>(apiRoute)
		const encodedTransaction = response.data
		setLastTransaction(encodedTransaction)
		const signature = await decodeSignAndSend(encodedTransaction)
		setLastSignature(signature)
	}

	const mintOne = async () => {
		const encodedTransaction = await fetchMintTransaction()
		setLastTransaction(encodedTransaction)
		const signature = await decodeSignAndSend(encodedTransaction)
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
						<Button onClick={toggleEncoding}>{encoding === 'base64' ? 'base64' : 'base58'}</Button>
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
				<br />
				<Typography>
					<strong>Last transaction: </strong>
					<span className='text--important' style={{ wordBreak: 'break-all' }}>
						{lastTransaction || '------'}
					</span>
				</Typography>
			</Main>

			<Footer />
		</>
	)
}

export default Home
