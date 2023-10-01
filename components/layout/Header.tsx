import React from 'react'

interface Props {
	title?: string
	image?: React.ReactNode
}

const Header: React.FC<Props> = ({ title, image }) => {
	return <header className='header'>{image || <h1 className='title'>{title}</h1>}</header>
}

export default Header
