import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function RemoteMdxPage() {
	// MDX text - can be from a local file, database, CMS, fetch, anywhere...
	const res = await fetch('https://raw.githubusercontent.com/d-reader-organization/.github/main/PRIVACY_POLICY.md')
	const markdown = await res.text()
	return <MDXRemote source={markdown} />
}
