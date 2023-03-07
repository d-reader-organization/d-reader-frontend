import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import logoImage from 'public/logo192.png'
import { AppIdentity } from '@solana-mobile/mobile-wallet-adapter-protocol'

// TODO: validate all .env variables

// RPC Node Endpoint
export const endpoint = (process.env.NEXT_PUBLIC_SOLANA_RPC_NODE_ENDPOINT as string) || clusterApiUrl('devnet')
export const network = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet

export const APP_IDENTITY: AppIdentity = {
	uri: undefined, // auto generated
	icon: logoImage.src,
	name: 'dReader',
}
