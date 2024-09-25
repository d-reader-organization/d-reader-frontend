import http from "@/api/http"
import { TRANSACTION_QUERY_KEYS } from "../transactionKeys"

const { TRANSACTION,SEND_MINT_TRANSACTION } = TRANSACTION_QUERY_KEYS

export const sendMintTransaction = async (walletAddress:string,transactions:string[]): Promise<void> => {
	const response = await http.post<void>(`${TRANSACTION}/${SEND_MINT_TRANSACTION}/${walletAddress}`, { transactions })
	return response.data;
}