import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import variables from './variables/theme.module.scss'
import { isNil } from 'lodash'

const spacing = parseInt(variables.spacing || '8')

const pxToInt = (pxString: string) => (pxString ? parseInt(pxString.replace('px', ''), 10) : 0)
const intToSpacing = (int?: number) => (!isNil(int) ? `${int * spacing}px` : '')
const getSpacing = (x: number, y?: number, z?: number, q?: number) => {
	return `${intToSpacing(x)} ${intToSpacing(y)} ${intToSpacing(z)} ${intToSpacing(q)}`
}

const defaultTheme = createTheme({
	spacing,
	palette: {
		background: { default: variables.grey_600 },
		primary: { main: variables.grey_600 },
		secondary: { main: variables.white },
		text: { primary: variables.text_color },
	},
	breakpoints: {
		values: {
			xs: pxToInt(variables.xs_width),
			sm: pxToInt(variables.sm_width),
			md: pxToInt(variables.md_width),
			lg: pxToInt(variables.lg_width),
			xl: pxToInt(variables.xl_width),
		},
	},
	typography: {
		fontSize: 16,
		fontFamily: 'Satoshi, sans-serif',
		// body1: { fontWeight: 500 },
		// body2: { fontWeight: 500, fontFamily: 'Satoshi, sans-serif' },
		// h1: { fontWeight: 'bold', fontSize: '5rem', lineHeight: 1.08 },
	},
	components: {
		MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					'&.Mui-disabled': {
						backgroundColor: variables.grey_700,
						border: 'none',
						color: variables.white,
					},
				},
				contained: {
					backgroundColor: variables.grey_500,
					borderRadius: '6px',
					border: 'none',
					minWidth: '40px',
					padding: getSpacing(0.25, 1),
					textTransform: 'none',
					fontWeight: 'bold',
					'&:hover': {
						backgroundColor: variables.grey_600,
						filter: 'brightness(0.85)',
						border: 'none',
					},
				},
				outlined: {
					borderColor: variables.grey_300,
					'&:hover': {
						borderColor: variables.grey_300,
					},
				},
			},
		},
		MuiDialog: {
			styleOverrides: {
				paper: {
					maxHeight: 'calc(100% - 128px)',
					overflow: 'visible',
					overflowY: 'visible',
					overflowX: 'visible',
					border: 'none',
					'.MuiDialogTitle-root': {
						textShadow: `2px 2px ${variables.grey_700}`,
						padding: getSpacing(1, 2),
						alignItems: 'center',
						backgroundColor: 'unset',
					},
					'.MuiDialogContent-root .MuiList-root, .MuiDialogContent-root .MuiCollapse-root .MuiList-root': {
						background: 'unset',
						'.MuiButton-root': {
							fontWeight: 'bold',
						},
						'.MuiListItem-root': {
							border: 'none',
							'&:hover': {
								backgroundColor: 'rgba(0, 0, 0, 0.05)',
							},
						},
					},
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: '6px',
					backgroundColor: variables.grey_600,
					border: '2px solid black',
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					borderRadius: '6px',
				},
			},
		},
	},
})

export default responsiveFontSizes(defaultTheme, { factor: 1.2 })
