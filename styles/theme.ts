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
		// fontSize: 18,
		// fontFamily: 'Eczar',
		// body1: { fontWeight: 500 },
		// body2: { fontWeight: 500, fontFamily: 'Archivo Narrow' },
		// h1: { fontWeight: 700, fontFamily: 'Archivo Narrow' },
	},
	components: {
		MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
		MuiAccordion: {
			styleOverrides: {
				root: {
					backgroundColor: 'unset',
					boxShadow: 'unset',
					'&::after': {
						content: "''",
						position: 'absolute',
						top: '-2px',
						left: 0,
						right: 0,
						height: '3px',
						backgroundImage: "url('/assets/ui/divider.png')",
						backgroundPositionX: '-4000px',
					},
				},
			},
		},
		MuiAccordionSummary: { styleOverrides: { root: { padding: getSpacing(0) } } },
		MuiAccordionDetails: { styleOverrides: { root: { padding: getSpacing(8, 0) } } },
		MuiToolbar: {
			styleOverrides: {
				root: {
					backgroundColor: variables.primaryColorLight,
					boxShadow: `0px 4px 2px ${variables.primaryColorDark}`,
					height: '56px',
					minHeight: '56px',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					'&.Mui-disabled': {
						backgroundColor: variables.primaryColorDark,
						boxShadow: '4px 2px rgba(0,0,0,0.9)',
						color: variables.secondaryColor,
					},
				},
				contained: {
					// borderRadius: '2rem',
					borderRadius: 0,
					boxShadow: '4px 2px rgba(0,0,0,0.9)',
					border: '2px solid black',
					minWidth: '40px',
					padding: getSpacing(0.25, 1),
					textTransform: 'none',
					fontWeight: 'bold',
					'&:hover': {
						backgroundColor: variables.primaryColor,
						filter: 'brightness(0.85)',
						boxShadow: '6px 4px rgba(0,0,0,0.9)',
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
					boxShadow: '6px 6px rgba(0,0,0,0.9)',
					'.MuiDialogTitle-root': {
						textShadow: `2px 2px ${variables.primaryColorDark}`,
						padding: getSpacing(1, 2),
						alignItems: 'center',
						backgroundColor: 'unset',
					},
					// TODO: change these styles in the future
					// This is just temp workaround for prettier wallet selection dialog
					'.MuiDialogContent-root .MuiList-root, .MuiDialogContent-root .MuiCollapse-root .MuiList-root': {
						background: 'unset',
						'.MuiButton-root': {
							fontWeight: 'bold',
						},
						'.MuiListItem-root': {
							boxShadow: 'inset 0 1px 0 0 rgba(0, 0, 0, 0.2)',
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
					// backgroundImage: "url('/assets/ui/theme-texture.jpg')",
					borderRadius: '0',
					backgroundColor: variables.primaryColor,
					border: '2px solid black',
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					borderRadius: '0.4rem',
				},
			},
		},
	},
})

export default responsiveFontSizes(defaultTheme, { factor: 1.2 })
