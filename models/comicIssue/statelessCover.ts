import { ComicRarity } from 'enums/comicRarity'

export interface StatefulCover {
	artist: string
	rarity?: ComicRarity
	share: number
	isDefault: boolean
	image: string
}
