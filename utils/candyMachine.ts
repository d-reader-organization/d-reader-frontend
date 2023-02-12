import {
	Connection,
	Keypair,
	PublicKey,
	SystemProgram,
	SYSVAR_SLOT_HASHES_PUBKEY,
	TransactionInstruction,
	SYSVAR_INSTRUCTIONS_PUBKEY,
	AccountMeta,
} from '@solana/web3.js'

import { PROGRAM_ID as CANDY_MACHINE_PROGRAM_ID } from '@metaplex-foundation/mpl-candy-machine-core'

import {
	createMintInstruction,
	MintInstructionAccounts,
	MintInstructionArgs,
} from '@metaplex-foundation/mpl-candy-guard'

export const METAPLEX_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

import { CandyMachine, Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import {
	createAssociatedTokenAccountInstruction,
	createInitializeMintInstruction,
	createMintToInstruction,
	MintLayout,
	TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { AnchorWallet } from '@solana/wallet-adapter-react'

export async function constructMintInstruction(
	candyMachine: PublicKey,
	payer: AnchorWallet,
	mint: Keypair,
	connection: Connection,
	remainingAccounts?: AccountMeta[] | null,
	mintArgs?: Uint8Array | null,
	label?: string | null
): Promise<TransactionInstruction[]> {
	// candy machine object
	const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(payer))
	const candyMachineObject: CandyMachine = await metaplex.candyMachines().findByAddress({
		address: candyMachine,
	})
	//address: new PublicKey('4o8Wbsp5MzSzxXdwbRi6SgdtzH4LHaRSL4Xrg8UKA9nq'),

	// PDAs required for the mint
	// const tokenProgram = metaplex.programs().getToken();
	// const systemProgram = metaplex.programs().getSystem();
	// PDAs.
	const authorityPda = metaplex.candyMachines().pdas().authority({ candyMachine })

	const nftMetadata = metaplex.nfts().pdas().metadata({
		mint: mint.publicKey,
	})
	const nftMasterEdition = metaplex.nfts().pdas().masterEdition({
		mint: mint.publicKey,
	})

	const nftTokenAccount = metaplex
		.tokens()
		.pdas()
		.associatedTokenAccount({ mint: mint.publicKey, owner: payer.publicKey })

	// collection PDAs
	const collectionMetadata = metaplex.nfts().pdas().metadata({
		mint: candyMachineObject.collectionMintAddress,
	})
	const collectionMasterEdition = metaplex.nfts().pdas().masterEdition({
		mint: candyMachineObject.collectionMintAddress,
	})

	const collectionAuthorityRecord = metaplex.nfts().pdas().collectionAuthorityRecord({
		mint: candyMachineObject.collectionMintAddress,
		collectionAuthority: authorityPda,
	})

	// const tokenMetadataProgram = metaplex.programs().getTokenMetadata();
	// const guardClient = metaplex.candyMachines().guards();
	const collectionMint = candyMachineObject.collectionMintAddress
	const collectionNft = await metaplex.nfts().findByMint({ mintAddress: collectionMint })

	if (!candyMachineObject.candyGuard) {
		throw new Error('no associated candyguard !')
	}

	const accounts: MintInstructionAccounts = {
		candyGuard: candyMachineObject.candyGuard?.address,
		candyMachineProgram: CANDY_MACHINE_PROGRAM_ID,
		candyMachine,
		payer: payer.publicKey,
		candyMachineAuthorityPda: authorityPda,
		nftMasterEdition: nftMasterEdition,
		nftMetadata,
		nftMint: mint.publicKey,
		nftMintAuthority: payer.publicKey,
		collectionUpdateAuthority: collectionNft.updateAuthorityAddress,
		collectionAuthorityRecord,
		collectionMasterEdition,
		collectionMetadata,
		collectionMint,
		tokenMetadataProgram: METAPLEX_PROGRAM_ID,
		tokenProgram: TOKEN_PROGRAM_ID,
		systemProgram: SystemProgram.programId,
		recentSlothashes: SYSVAR_SLOT_HASHES_PUBKEY,
		instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
	}

	if (!mintArgs) {
		mintArgs = new Uint8Array()
	}

	const args: MintInstructionArgs = {
		mintArgs,
		label: label ?? null,
	}

	const instructions: TransactionInstruction[] = []
	instructions.push(
		SystemProgram.createAccount({
			fromPubkey: payer.publicKey,
			newAccountPubkey: mint.publicKey,
			lamports: await connection.getMinimumBalanceForRentExemption(MintLayout.span),
			space: MintLayout.span,
			programId: TOKEN_PROGRAM_ID,
		})
	)

	instructions.push(createInitializeMintInstruction(mint.publicKey, 0, payer.publicKey, payer.publicKey))
	instructions.push(
		createAssociatedTokenAccountInstruction(payer.publicKey, nftTokenAccount, payer.publicKey, mint.publicKey)
	)
	instructions.push(createMintToInstruction(mint.publicKey, nftTokenAccount, payer.publicKey, 1, []))

	const mintInstruction = createMintInstruction(accounts, args)

	if (remainingAccounts) {
		mintInstruction.keys.push(...remainingAccounts)
	}

	instructions.push(mintInstruction)

	return instructions
}
