import React, { useCallback, useMemo } from 'react'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { AnchorProvider, Program } from '@project-serum/anchor'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import Button from '@mui/material/Button'
import { constructMintInstruction } from 'utils/candyMachine'
// import { network } from 'constants/environment'
import idl from './candy_guard.json'

// const programID = new PublicKey(idl.metadata.address)

const MintButton: React.FC = () => {
	const wallet = useAnchorWallet()
	const { connection } = useConnection()

	const provider = useMemo(() => {
		return wallet
			? new AnchorProvider(connection, wallet, {
					preflightCommitment: 'recent',
					commitment: 'recent',
			  })
			: null
	}, [wallet, connection])

	const jsonString = JSON.stringify(idl)
	const idlJSON = JSON.parse(jsonString)

	const mintNft = useCallback(async () => {
		console.log('start')
		if (!provider || !wallet) return

		const program = new Program(idlJSON, idl.metadata.address, provider)
		const mint = Keypair.generate()

		const candyMachine = new PublicKey('Ft4Gcj6H6FuSgPBrdw7y3XirL3QpU4J8PdZdAHrWQd3B')

		const mintInstructions = await constructMintInstruction(candyMachine, wallet, mint, provider.connection, [
			{
				pubkey: wallet.publicKey,
				isSigner: false,
				isWritable: true,
			},
		])

		const latestBlockHash = await connection.getLatestBlockhash()

		// const transaction = new Transaction({
		// 	...latestBlockHash,
		// 	feePayer: wallet.publicKey,
		// }).add(...mintInstructions)

		const transaction = new Transaction().add(...mintInstructions)
		transaction.feePayer = wallet.publicKey
		transaction.recentBlockhash = latestBlockHash.blockhash
		transaction.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight
		transaction.sign(mint)

		const signedTransaction = await wallet.signTransaction(transaction)
		const signature = await connection.sendRawTransaction(signedTransaction.serialize())

		await connection.confirmTransaction({
			...latestBlockHash,
			signature,
		})
	}, [connection, idlJSON, provider, wallet])

	return <Button onClick={mintNft}>Mint new</Button>
}

export default MintButton
