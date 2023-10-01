import { ComicRarity } from 'enums/comicRarity'

export interface StatefulCover {
	artist: string
	isSigned: boolean
	isUsed: boolean
	rarity: ComicRarity
	image: string
}

export interface CreateStatefulCoverData
	extends Pick<StatefulCover, 'artist' | 'isSigned' | 'isUsed' | 'rarity' | 'image'> {
	// image?: File
}
