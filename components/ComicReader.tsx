import { useEffect } from 'react'
import { Box, Button } from '@mui/material'
import FlashlightOnIcon from 'public/assets/vector-icons/flashlight-on-icon.svg'
import FlashlightOffIcon from 'public/assets/vector-icons/flashlight-off-icon.svg'
import VolumeOnIcon from 'public/assets/vector-icons/volume-on-icon.svg'
import VolumeOffIcon from 'public/assets/vector-icons/volume-off-icon.svg'
import { ReactFlashlight } from 'react-flashlight'
import { useFetchComicIssue } from 'api/comicIssue'
import { useFetchComic } from 'api/comic'
import useToggle from 'hooks/useToggle'
import useSound from 'use-sound'

// Is after 4am and before 8pm
const isDaytime = () => new Date().getHours() < 20 && new Date().getHours() > 4
const lsFlashlight = typeof window === 'object' ? localStorage.getItem('flashlight') : false
const initialLight = lsFlashlight === null ? isDaytime() : lsFlashlight === 'true'

const ComicReader: React.FC = () => {
	const { data: comic, isFetched } = useFetchComic('gorecats')
	const { data: comicIssue } = useFetchComicIssue(1)
	const [play, { stop }] = useSound(comicIssue?.soundtrack || [], { interrupt: false })
	const [flashlight, toggleFlashlight] = useToggle(initialLight)
	const [sound, toggleSound] = useToggle()

	useEffect(() => {
		localStorage.setItem('flashlight', flashlight.toString())
	}, [flashlight])

	// TODO: navigate to 404?
	if (!comic || !comicIssue) return null

	return (
		<ReactFlashlight enabled={flashlight} showCursor={!flashlight} size={320} darkness={0.9}>
			<Box
				className='comic-reader-wrapper'
				style={{ visibility: isFetched ? 'visible' : 'hidden', cursor: flashlight ? 'none' : 'default' }}
				mb={{ xs: 4, sm: 8 }}
			>
				<Box className='comic-reader-actions'>
					<Button className='comic-reader-action' variant='contained' onClick={toggleFlashlight}>
						{flashlight ? (
							<FlashlightOnIcon className='flashlight-icon' />
						) : (
							<FlashlightOffIcon className='flashlight-icon' />
						)}
					</Button>
					{sound ? (
						<Button
							className='comic-reader-action'
							variant='contained'
							onClick={() => {
								stop()
								toggleSound()
							}}
						>
							<VolumeOnIcon />
						</Button>
					) : (
						<Button
							className='comic-reader-action'
							variant='contained'
							onClick={() => {
								play()
								toggleSound()
							}}
						>
							<VolumeOffIcon />
						</Button>
					)}
				</Box>
				<Box
					onContextMenu={(e) => {
						e.preventDefault()
					}}
					px={{ xs: 0, sm: 1, md: 2 }}
				>
					{/* TODO: next Image */}
					{comicIssue.pages.map((page) => (
						<img key={page.id} src={page.image} alt={`Page ${page.pageNumber}`} className='comic-page' />
					))}
				</Box>
			</Box>
		</ReactFlashlight>
	)
}

export default ComicReader
