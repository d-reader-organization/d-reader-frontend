const withMDX = require('@next/mdx')()
const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
	mode: 'production',
})
const path = require('path')
/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure `pageExtensions` to include MDX files
	pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: '**.cloudfront.net',
			},
			{
				protocol: 'https',
				hostname: 'arweave.net',
			},
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})

		return config
	},
}

module.exports = withMDX(withPWA(nextConfig))
