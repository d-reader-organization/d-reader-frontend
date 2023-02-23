import { useEffect, useMemo, useState } from 'react'
import { Box, BoxProps, Grid } from '@mui/material'
import useOnScreen from 'hooks/useOnScreen'
import { useFetchComics } from 'api/comic'
import AnimatedGridItem from './AnimatedGrid'
import ComicItem from './ComicItem'
import clsx from 'clsx'

interface Props extends BoxProps {
	take: number
}

const ComicList: React.FC<Props> = ({ take, className, ...props }) => {
	const { data: comics = [] } = useFetchComics({ skip: 0, take })
	const [isVisible, observableRef] = useOnScreen()

	// TODO: add position absolute item at px = props.px and point the ref to it
	return (
		<Box ref={observableRef} className={clsx('comic-list', className)} {...props}>
			<Grid container spacing={2}>
				{comics.map((comic, i) => (
					<AnimatedGridItem key={comic.slug} animate={isVisible} itemOrder={i} xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<ComicItem comic={comic} />
					</AnimatedGridItem>
				))}
			</Grid>
		</Box>
	)
}

export default ComicList
