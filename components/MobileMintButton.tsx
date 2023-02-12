import React, { useCallback } from 'react'
import { transact } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import { useConnection } from '@solana/wallet-adapter-react'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { mobileConstructMintInstruction } from 'utils/candyMachine'
import { useMobileWallet } from '@open-sauce/solomon'
// import { network } from 'constants/environment'
import Button from '@mui/material/Button'
import idl from './candy_guard.json'

// const programID = new PublicKey(idl.metadata.address)

const MobileMintButton: React.FC = () => {
	const { authorizeSession, selectedAccount } = useMobileWallet()
	const { connection } = useConnection()

	const jsonString = JSON.stringify(idl)
	const idlJSON = JSON.parse(jsonString)

	const mobileMintNft = useCallback(async () => {
		// TODO: remove provider from here?
		console.log('start')

		// const program = new Program(idlJSON, idl.metadata.address, provider)
		const mint = Keypair.generate()

		const candyMachine = new PublicKey('Ft4Gcj6H6FuSgPBrdw7y3XirL3QpU4J8PdZdAHrWQd3B')

		await transact(async (mobileWallet) => {
			// TODO: use connection with different commitment?
			const freshAccount = await authorizeSession(mobileWallet)
			const account = selectedAccount ?? freshAccount

			const mintInstructions = await mobileConstructMintInstruction(
				candyMachine,
				mobileWallet,
				account,
				mint,
				connection,
				[
					{
						pubkey: account.publicKey,
						isSigner: false,
						isWritable: true,
					},
				]
			)

			const latestBlockHash = await connection.getLatestBlockhash()

			// const transaction = new Transaction({
			// 	...latestBlockHash,
			// 	feePayer: wallet.publicKey,
			// }).add(...mintInstructions)

			const transaction = new Transaction().add(...mintInstructions)
			transaction.feePayer = account.publicKey
			transaction.recentBlockhash = latestBlockHash.blockhash
			transaction.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight
			transaction.sign(mint)

			const [signedTransaction] = await mobileWallet.signTransactions({
				transactions: [transaction],
			})
			const signature = await connection.sendRawTransaction(signedTransaction.serialize())

			await connection.confirmTransaction({
				...latestBlockHash,
				signature,
			})
		})
	}, [authorizeSession, connection, selectedAccount])

	return <Button onClick={mobileMintNft}>Mint (Mobile)</Button>
}

export default MobileMintButton
