import { useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'

type TransactionHook = {
	decodeBase58: (encodedTransaction: string) => Promise<Transaction>
	decodeBase58SignAndSend: (encodedTransaction: string) => Promise<string>
	decodeBase64: (encodedTransaction: string) => Promise<Transaction>
	decodeBase64SignAndSend: (encodedTransaction: string) => Promise<string>
}

export const useTransaction = (): TransactionHook => {
	const { signTransaction } = useWallet()
	const { connection } = useConnection()

	const decodeBase58 = useCallback(async (encodedTransaction: string) => {
		const decodedTransaction = new TextEncoder().encode(encodedTransaction)
		return Transaction.from(decodedTransaction)
	}, [])

	const decodeBase58SignAndSend = useCallback(
		async (encodedTransaction: string) => {
			if (!signTransaction) {
				throw new Error('Wallet does not support message or transaction signing!')
			}

			// TODO: check if blockhash info is missing and fetch it if yes

			const transaction = await decodeBase58(encodedTransaction)
			const signedTransaction = await signTransaction(transaction)
			const signature = await connection.sendRawTransaction(signedTransaction.serialize())
			return signature
		},
		[connection, decodeBase58, signTransaction]
	)

	const decodeBase64 = useCallback(async (encodedTransaction: string) => {
		const decodedTransaction = Buffer.from(encodedTransaction, 'base64')
		return Transaction.from(decodedTransaction)
	}, [])

	const decodeBase64SignAndSend = useCallback(
		async (encodedTransaction: string) => {
			if (!signTransaction) {
				throw new Error('Wallet does not support message or transaction signing!')
			}

			// TODO: check if blockhash info is missing and fetch it if yes

			const transaction = await decodeBase64(encodedTransaction)
			const signedTransaction = await signTransaction(transaction)
			const signature = await connection.sendRawTransaction(signedTransaction.serialize())
			return signature
		},
		[connection, decodeBase64, signTransaction]
	)

	return { decodeBase58, decodeBase58SignAndSend, decodeBase64, decodeBase64SignAndSend }
}

export default useTransaction
