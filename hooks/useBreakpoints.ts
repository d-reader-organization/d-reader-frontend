import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

type BreakpointHook = () => { xs: boolean; sm: boolean; md: boolean; lg: boolean; xl: boolean }

export const useBreakpoints: BreakpointHook = () => {
	const xs = useMediaQuery((theme: Theme) => theme.breakpoints.up('xs'))
	const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
	const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
	const lg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
	const xl = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl'))

	return { xs, sm, md, lg, xl }
}

export default useBreakpoints
