import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Navigation from 'components/layout/Navigation'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'
import { useCrossDeviceWallet, decodeTransaction } from '@open-sauce/solomon'
import { Box, Button, TextField, Typography } from '@mui/material'
import { io } from 'socket.io-client'
import http from 'api/http'

const fetchMintTransaction = async (): Promise<string> => {
	const response = await http.get<string>('candy-machine/transactions/mint-one', {
		params: { candyMachineAddress: 'L8ozHrhcmYXGJZByTvS8ZiG1jJWuTKCseUqn3bs7Bcc' },
	})
	return response.data
}

const fetchListTransaction = async (): Promise<string> => {
	const response = await http.get<string>('auction-house/transactions/list', {
		params: { mintAccount: '5G5nrgqXRx1FbmXCJioJVjjJRsVHFUgQzBeW1z7AGaVQ', price: 1 },
	})
	return response.data
}

const fetchPrivateBidTransaction = async (): Promise<string> => {
	const response = await http.get<string>('auction-house/transactions/private-bid', {
		params: {
			mintAccount: '5G5nrgqXRx1FbmXCJioJVjjJRsVHFUgQzBeW1z7AGaVQ',
			price: 1,
			seller: '3dkovHUm4UJRGjtRmapGJzHjwQFPjaGiPoFjNQxPj1sS',
		},
	})
	return response.data
}

const executeSaleTransaction = async (): Promise<string> => {
	const response = await http.get<string>('auction-house/transactions/execute-sale', {
		params: {
			bidReceipt: 'pQVfXFi3zbjypdad1GFtNzxNVZt9wKXy9vJpxE8PpDe',
			listReceipt: 'HEqJnMV8uaEzbLDJkucMBDTwMMKsuYPXckEUPXwokxP7',
		},
	})
	return response.data
}

const fetchCancelBidTransaction = async (): Promise<string> => {
	const response = await http.get<string>('auction-house/transactions/cancel-bid', {
		params: {
			receiptAddress: 'Gty9jXQDcaKrfGDQtbRMhEysRjTHYQ7Yp3BQENWLhJDb',
		},
	})
	return response.data
}

const fetchCancelListingTransaction = async (): Promise<string> => {
	const response = await http.get<string>('auction-house/transactions/cancel-listing', {
		params: {
			receiptAddress: 'FDeZdVgeSTyahzQSLBXt77naVeWm6jujVqxuFtv8wqeS',
		},
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

	const privateBid = async () => {
		const response = await fetchPrivateBidTransaction()
		const encodedTransaction = decodeTransaction(response)
		const signature = await signAndSendTransaction(encodedTransaction)
		setLastSignature(signature)
	}
	const list = async () => {
		const response = await fetchListTransaction()
		const encodedTransaction = decodeTransaction(response)
		const signature = await signAndSendTransaction(encodedTransaction)
		setLastSignature(signature)
	}

	const executeSale = async () => {
		const response = await executeSaleTransaction()
		const encodedTransaction = decodeTransaction(response)
		const signature = await signAndSendTransaction(encodedTransaction)
		setLastSignature(signature)
	}

	const cancelBid = async () => {
		const response = await fetchCancelBidTransaction()
		const encodedTransaction = decodeTransaction(response)
		const signature = await signAndSendTransaction(encodedTransaction)
		setLastSignature(signature)
	}

	const cancelListing = async () => {
		const response = await fetchCancelListingTransaction()
		const encodedTransaction = decodeTransaction(response)
		const signature = await signAndSendTransaction(encodedTransaction)
		setLastSignature(signature)
	}

	const fetch = () => {
		console.log('fetched')
	}

	useEffect(() => {
		const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT || '')
		socket.on('message', () => {
			console.log('State updated')
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		socket.on('receiptCreated', (data: any) => {
			console.log('State updated', data)
		})
		return () => {
			socket.disconnect()
		}
	}, [])

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
						<Button onClick={privateBid}>Private Bid</Button>
						<Button onClick={list}>Sell</Button>
						<Button onClick={executeSale}>Execute Sale</Button>
						<Button onClick={cancelBid}>Cancel Bid</Button>
						<Button onClick={cancelListing}>Cancel Listing</Button>
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
