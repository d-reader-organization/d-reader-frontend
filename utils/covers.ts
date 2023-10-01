import { StatefulCover } from '@/models/comicIssue/statefulCover'
import { StatelessCover } from '@/models/comicIssue/statelessCover'

export const statelessCoverToStatefulCovers = (cover: StatelessCover): StatefulCover[] => {
	return [
		{
			rarity: cover.rarity,
			artist: cover.artist,
			isSigned: false,
			isUsed: false,
			image: cover.image,
		},
		{
			rarity: cover.rarity,
			artist: cover.artist,
			isSigned: false,
			isUsed: true,
			image: cover.image,
		},
		{
			rarity: cover.rarity,
			artist: cover.artist,
			isSigned: true,
			isUsed: false,
			image: cover.image,
		},
		{
			rarity: cover.rarity,
			artist: cover.artist,
			isSigned: true,
			isUsed: true,
			image: cover.image,
		},
	]
}

export const statelessCoversToStatefulCovers = (covers: StatelessCover[]): StatefulCover[] => {
	return covers.reduce<StatefulCover[]>((acc, cover) => {
		return acc.concat(statelessCoverToStatefulCovers(cover))
	}, [])
}
