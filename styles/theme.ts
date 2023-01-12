import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import variables from 'styles/variables/theme.module.scss'

const spacing = parseInt(variables.spacing || '8')

const pxToInt = (pxString: string) => (pxString ? parseInt(pxString.replace('px', ''), 10) : 0)
const intToSpacing = (int?: number) => (int !== null && int !== undefined ? `${int * spacing}px` : '')
const getSpacing = (x: number, y?: number, z?: number, q?: number) => {
	return `${intToSpacing(x)} ${intToSpacing(y)} ${intToSpacing(z)} ${intToSpacing(q)}`
}

const defaultTheme = createTheme({
	spacing,
	palette: {
		background: { default: variables.primaryColor },
		primary: { main: variables.primaryColor },
		secondary: { main: variables.secondaryColor },
		text: { primary: variables.textColor },
	},
	breakpoints: {
		values: {
			xs: pxToInt(variables.xsWidth),
			sm: pxToInt(variables.smWidth),
			md: pxToInt(variables.mdWidth),
			lg: pxToInt(variables.lgWidth),
			xl: pxToInt(variables.xlWidth),
		},
	},
	typography: {
		fontSize: 16,
		fontFamily: 'Urbanist, sans-serif',
		// body1: { fontWeight: 500 },
		// body2: { fontWeight: 500, fontFamily: 'Urbanist, sans-serif' },
		// h1: { fontWeight: 'bold', fontSize: '5rem', lineHeight: 1.08 },
	},
	components: {
		MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					'&.Mui-disabled': {
						backgroundColor: variables.primaryColorDark,
						border: 'none',
						color: variables.secondaryColor,
					},
				},
				contained: {
					backgroundColor: variables.primaryColorLight,
					borderRadius: '6px',
					border: 'none',
					minWidth: '40px',
					padding: getSpacing(0.25, 1),
					textTransform: 'none',
					fontWeight: 'bold',
					'&:hover': {
						backgroundColor: variables.primaryColor,
						filter: 'brightness(0.85)',
						border: 'none',
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
						textShadow: `2px 2px ${variables.primaryColorDark}`,
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
					backgroundColor: variables.primaryColor,
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
