import React, {
	InputHTMLAttributes,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { cloneDeep, remove } from 'lodash'
import clsx from 'clsx'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import ImageIcon from 'public/assets/vector-icons/image.svg'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { convertFileToBlob } from 'utils/file'
import SkeletonImage from '../SkeletonImage'

type UploadedFile = { url: string; file: File }

function arrayMove<T>(arr: T[], fromIndex: number, toIndex: number) {
	const arrayCopy = [...arr]
	const [removedItem] = arrayCopy.splice(fromIndex, 1)
	arrayCopy.splice(toIndex, 0, removedItem)
	return arrayCopy
}

interface SortableItemProps {
	uploadedFile: UploadedFile
	handleRemoveFile: (event: React.MouseEvent<HTMLButtonElement>, uploadedFile: UploadedFile) => void
}

const SortableItem = SortableElement<SortableItemProps>(({ uploadedFile, handleRemoveFile }: SortableItemProps) => {
	return (
		<div className={clsx('preview-image-wrapper')}>
			<button className='close-button' onClick={(event) => handleRemoveFile(event, uploadedFile)}>
				<CloseIcon className='close-icon' />
			</button>
			{uploadedFile.file?.type.includes('pdf') ? (
				<embed src={uploadedFile.url} width='100%' height='100%' />
			) : (
				<SkeletonImage
					src={uploadedFile.url}
					className='preview-image'
					// is there a better way to do 'sizes'?
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw'
					fill
					alt=''
				/>
			)}
		</div>
	)
})

interface SortableListProps {
	items: UploadedFile[]
	handleRemoveFile: (event: React.MouseEvent<HTMLButtonElement>, uploadedFile: UploadedFile) => void
}

const SortableList = SortableContainer<SortableListProps>(({ items, handleRemoveFile }: SortableListProps) => (
	<div className='preview-image-list'>
		{items.map((uploadedFile, index) => (
			<SortableItem
				key={uploadedFile.url}
				index={index}
				uploadedFile={uploadedFile}
				handleRemoveFile={handleRemoveFile}
			/>
		))}
	</div>
))

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	id: string
	label?: string
	allowMultipleFiles?: boolean
	onUpload?: (uploadedFiles: UploadedFile[]) => void
	previewUrl?: string
	sortable?: boolean
	isUploading?: boolean
	options?: Omit<DropzoneOptions, 'onDragEnter' | 'onDragLeave' | 'onDrop'>
}

const FileUpload = forwardRef<HTMLInputElement, Props>(
	(
		{
			id,
			label,
			allowMultipleFiles = false,
			previewUrl = '',
			onUpload = () => {},
			className = '',
			sortable = false,
			isUploading = false,
			options,
			...props
		},
		ref
	) => {
		const componentRef = useRef<HTMLInputElement>(null)
		const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			previewUrl ? [{ url: previewUrl, file: undefined as any }] : []
		)
		const [draggingFileOver, setDraggingFileOver] = useState<boolean>(false)

		const updateUploadedFiles = useCallback(
			async (files: File[] | never[] | FileList) => {
				const uploads: UploadedFile[] = []

				for (let i = 0; i < files.length; i++) {
					const file = files[i]
					const blob = await convertFileToBlob(file)

					const url = URL.createObjectURL(blob)

					uploads.push({ url, file })
				}

				if (allowMultipleFiles) {
					const concatenatedFiles = uploadedFiles.concat(uploads)
					setUploadedFiles(concatenatedFiles)
					onUpload(concatenatedFiles)
				} else {
					setUploadedFiles(uploads)
					onUpload(uploads)
				}
			},
			[allowMultipleFiles, onUpload, uploadedFiles]
		)

		const handleDrop = useCallback(
			async (files: File[]) => {
				setDraggingFileOver(false)

				if (!allowMultipleFiles && files.length > 1) return
				await updateUploadedFiles(files)
			},
			[allowMultipleFiles, updateUploadedFiles]
		)

		const { getRootProps, getInputProps } = useDropzone({
			onDragEnter: () => {
				setDraggingFileOver(true)
			},
			onDragLeave: () => {
				setDraggingFileOver(false)
			},
			onDrop: handleDrop,
			...options,
			noClick: true,
		})

		useImperativeHandle(ref, () => componentRef.current as HTMLInputElement)

		const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
			event.preventDefault()
			event.stopPropagation()
			if (!event.target) return
			const files = event.target.files || []
			await updateUploadedFiles(files)
		}

		const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>, uploadedFile: UploadedFile) => {
			if (!componentRef.current) return
			event.preventDefault()
			event.stopPropagation()

			const deepClonedUploadedFiles = cloneDeep(uploadedFiles)

			remove(deepClonedUploadedFiles, (deepClonedUploadedFile) => deepClonedUploadedFile.url === uploadedFile.url)

			setUploadedFiles(deepClonedUploadedFiles)
			onUpload(deepClonedUploadedFiles)
			URL.revokeObjectURL(uploadedFile.url)
			componentRef.current.value = ''
		}

		useEffect(() => {
			if (previewUrl) {
				const previewFile = [{ url: previewUrl, file: undefined as unknown as File }]
				setUploadedFiles(previewFile)
				onUpload(previewFile)
			}
		}, [onUpload, previewUrl])

		return (
			<>
				<label
					htmlFor={id}
					className={clsx('file-upload', className, {
						'file-upload--no-pointer': !sortable && uploadedFiles.length > 0,
						'file-upload--dropping': draggingFileOver,
					})}
					{...getRootProps()}
				>
					{!sortable && uploadedFiles.length > 0 && (
						<div className='preview-image-list'>
							{uploadedFiles.map((uploadedFile) => {
								return (
									<div
										key={uploadedFile.url}
										className={clsx('preview-image-wrapper', {
											'preview-image-wrapper--cover': uploadedFiles.length === 1,
										})}
									>
										{uploadedFile.file?.type.includes('pdf') ? (
											<embed src={uploadedFile.url} width='100%' height='100%' />
										) : (
											<SkeletonImage
												src={uploadedFile.url || previewUrl}
												isLoading={isUploading}
												className='preview-image'
												sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw'
												fill
												alt=''
											/>
										)}
										<button className='close-button' onClick={(event) => handleRemoveFile(event, uploadedFile)}>
											<CloseIcon className='close-icon' />
										</button>
									</div>
								)
							})}
						</div>
					)}

					<input
						{...props}
						{...getInputProps()}
						id={id}
						type='file'
						multiple={allowMultipleFiles}
						onChange={handleFileChange}
						ref={componentRef}
						disabled={!sortable && uploadedFiles.length > 0}
						style={{ display: 'none' }}
					/>
					{(sortable || uploadedFiles.length === 0) && (
						<>
							<ImageIcon className='image-icon' />
							<span className='label'>{label}</span>
						</>
					)}
				</label>

				{sortable && (
					<div className='file-preview'>
						{uploadedFiles.length > 0 && (
							<SortableList
								items={uploadedFiles}
								onSortEnd={({ oldIndex, newIndex }) => {
									const newFilesOrder = arrayMove(uploadedFiles, oldIndex, newIndex)
									setUploadedFiles(newFilesOrder)
									onUpload(newFilesOrder)
								}}
								handleRemoveFile={handleRemoveFile}
								axis='x'
							/>
						)}
					</div>
				)}
			</>
		)
	}
)

FileUpload.displayName = 'FileUpload'

export default FileUpload
