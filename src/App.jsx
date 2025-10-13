import { useEffect, useMemo, useState } from 'react'
import { BiPlusCircle } from 'react-icons/bi'
import {
	FaBriefcase,
	FaBullseye,
	FaEye,
	FaGraduationCap,
	FaImage,
	FaPalette,
	FaUserTie,
} from 'react-icons/fa6'
import html2pdf from 'html2pdf.js'

import CvPreview from './components/CvPreview'
import EducationToggle from './components/EducationToggle'
import GeneralInfoSection from './components/GeneralInfoSection'
import ObjectiveSection from './components/ObjectiveSection'
import PracticalToggle from './components/PracticalToggle'
import SectionTitle from './components/SectionTitle'

const STORAGE_KEY = 'cv-app-state-v1'

const COLOR_THEMES = {
	cobalt: {
		label: 'Bleu cobalt',
		accentColor: '#1d4ed8',
		accentLight: '#dbeafe',
		text: '#0f172a',
		bodyText: '#475569',
	},
	emerald: {
		label: 'Émeraude',
		accentColor: '#047857',
		accentLight: '#d1fae5',
		text: '#064e3b',
		bodyText: '#065f46',
	},
	slate: {
		label: 'Ardoise',
		accentColor: '#0f172a',
		accentLight: '#e2e8f0',
		text: '#0f172a',
		bodyText: '#334155',
	},
}

const FONT_OPTIONS = {
	sans: {
		label: 'Moderne (Inter/System)',
		stack: '"Inter", "Helvetica Neue", Arial, sans-serif',
	},
	serif: {
		label: 'Classique (Georgia)',
		stack: 'Georgia, "Times New Roman", serif',
	},
	mono: {
		label: 'Technique (Roboto Mono)',
		stack: '"Roboto Mono", Menlo, monospace',
	},
}

const TEMPLATE_OPTIONS = {
	classic: { label: 'Classique équilibré' },
	compact: { label: 'Compact moderne' },

}

const defaultEducationInfo = {
	schoolName: "Bachelor's in Computer Science",
	studyTitle: 'University of Technology | Expected Graduation',
	dateOfStudy: new Date(),
}

const defaultPracticalInfo = {
	practicalTitle: 'Junior Web Developer',
	company: 'Tech Solutions Inc., Remote',
	location: 'Zambia, Lusaka',
	startDate: new Date(),
	endDate: new Date(),
	isCurrent: false,
}

const DEFAULT_STATE = {
	generalInfo: {
		name: 'YakeDev Kay',
		profession: 'Web Developer / UX Designer',
		email: 'erickay@gmail.com',
		phone: '+248 812 345 678',
	},
	objectiveText: {
		objective:
			'Enthusiastic web developer and UX designer with a passion for crafting seamless, user-centered digital experiences. Seeking opportunities to leverage my skills in front-end development and design to contribute to impactful projects.',
	},
	educationToggles: [
		{
			id: 1,
			info: defaultEducationInfo,
		},
	],
	practicalToggles: [
		{
			id: 1,
			info: defaultPracticalInfo,
		},
	],
	appearance: {
		theme: 'cobalt',
		font: 'sans',
		template: 'classic',
		photo: null,
	},
}

const parseDate = (value) => {
	if (!value) return null
	const parsed = new Date(value)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

const normalizeEducationToggles = (toggles = DEFAULT_STATE.educationToggles) =>
	toggles.map((toggle, index) => ({
		id: toggle.id ?? index + 1 + Date.now(),
		info: {
			schoolName: toggle.info?.schoolName ?? '',
			studyTitle: toggle.info?.studyTitle ?? '',
			dateOfStudy: parseDate(toggle.info?.dateOfStudy),
		},
	}))

const normalizePracticalToggles = (toggles = DEFAULT_STATE.practicalToggles) =>
	toggles.map((toggle, index) => ({
		id: toggle.id ?? index + 1 + Date.now(),
		info: {
			practicalTitle: toggle.info?.practicalTitle ?? '',
			company: toggle.info?.company ?? '',
			location: toggle.info?.location ?? '',
			startDate: parseDate(toggle.info?.startDate),
			endDate: parseDate(toggle.info?.endDate),
			isCurrent: Boolean(toggle.info?.isCurrent),
		},
	}))

const loadStoredState = () => {
	if (typeof window === 'undefined') {
		return DEFAULT_STATE
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) {
			return DEFAULT_STATE
		}

		const parsed = JSON.parse(raw)

		return {
			generalInfo: {
				...DEFAULT_STATE.generalInfo,
				...parsed.generalInfo,
			},
			objectiveText: {
				...DEFAULT_STATE.objectiveText,
				...parsed.objectiveText,
			},
			educationToggles: normalizeEducationToggles(parsed.educationToggles),
			practicalToggles: normalizePracticalToggles(parsed.practicalToggles),
			appearance: {
				...DEFAULT_STATE.appearance,
				...parsed.appearance,
			},
		}
	} catch (error) {
		console.warn('Unable to load saved CV data:', error)
		return DEFAULT_STATE
	}
}

const serializeState = ({
	generalInfo,
	objectiveText,
	educationToggles,
	practicalToggles,
	appearance,
}) => ({
	generalInfo,
	objectiveText,
	educationToggles: educationToggles.map((toggle) => ({
		id: toggle.id,
		info: {
			...toggle.info,
			dateOfStudy: toggle.info.dateOfStudy
				? toggle.info.dateOfStudy.toISOString()
				: null,
		},
	})),
	practicalToggles: practicalToggles.map((toggle) => ({
		id: toggle.id,
		info: {
			...toggle.info,
			startDate: toggle.info.startDate
				? toggle.info.startDate.toISOString()
				: null,
			endDate: toggle.info.endDate ? toggle.info.endDate.toISOString() : null,
		},
	})),
	appearance,
})

const App = () => {
	const storedSnapshot = useMemo(loadStoredState, [])

	const [educationToggles, setEducationToggles] = useState(
		() => storedSnapshot.educationToggles
	)
	const [practicalToggles, setPracticalToggles] = useState(
		() => storedSnapshot.practicalToggles
	)
	const [generalInfo, setGeneralInfo] = useState(
		() => storedSnapshot.generalInfo
	)
	const [objectiveText, setObjectiveText] = useState(
		() => storedSnapshot.objectiveText
	)
	const [appearance, setAppearance] = useState(
		() => storedSnapshot.appearance
	)
	const [showPreviewOnly, setShowPreviewOnly] = useState(false)

	const selectedTheme = useMemo(
		() => COLOR_THEMES[appearance.theme] ?? COLOR_THEMES.cobalt,
		[appearance.theme]
	)

	const selectedFont = useMemo(
		() => FONT_OPTIONS[appearance.font] ?? FONT_OPTIONS.sans,
		[appearance.font]
	)

	useEffect(() => {
		if (typeof window === 'undefined') return

		const payload = serializeState({
			generalInfo,
			objectiveText,
			educationToggles,
			practicalToggles,
			appearance,
		})

		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
	}, [
		appearance,
		educationToggles,
		generalInfo,
		objectiveText,
		practicalToggles,
	])

	const addEducationToggle = () => {
		setEducationToggles((prev) => [
			...prev,
			{
				id: Date.now(),
				info: {
					schoolName: '',
					studyTitle: '',
					dateOfStudy: null,
				},
			},
		])
	}

	const handleEducationChange = (id, updatedInfo) => {
		setEducationToggles((prev) =>
			prev.map((toggle) =>
				toggle.id === id ? { ...toggle, info: updatedInfo } : toggle
			)
		)
	}

	const deleteEducationToggle = (id) => {
		setEducationToggles((prev) => prev.filter((toggle) => toggle.id !== id))
	}

	const addPracticalToggle = () => {
		setPracticalToggles((prev) => [
			...prev,
			{
				id: Date.now(),
				info: {
					practicalTitle: '',
					company: '',
					location: '',
					startDate: null,
					endDate: null,
					isCurrent: false,
				},
			},
		])
	}

	const handlePracticalChange = (id, updatedInfo) => {
		setPracticalToggles((prev) =>
			prev.map((toggle) => {
				if (toggle.id !== id) return toggle

				let nextInfo = { ...updatedInfo }

				if (updatedInfo.isCurrent) {
					nextInfo = {
						...nextInfo,
						endDate: null,
					}
				}

				return { ...toggle, info: nextInfo }
			})
		)
	}

	const deletePracticalToggle = (id) => {
		setPracticalToggles((prev) => prev.filter((toggle) => toggle.id !== id))
	}

	const handleInputChange = ({ target: { name, value } }) => {
		setGeneralInfo((prevInfo) => ({
			...prevInfo,
			[name]: value,
		}))
	}

	const handleObjectiveChange = ({ target: { value } }) => {
		setObjectiveText({ objective: value })
	}

	const handleAppearanceChange = ({ target: { name, value } }) => {
		setAppearance((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handlePhotoUpload = ({ target }) => {
		const file = target.files?.[0]

		if (!file) {
			setAppearance((prev) => ({ ...prev, photo: null }))
			return
		}

		const reader = new FileReader()
		reader.onloadend = () => {
			setAppearance((prev) => ({
				...prev,
				photo: typeof reader.result === 'string' ? reader.result : null,
			}))
		}
		reader.readAsDataURL(file)
	}

	const removePhoto = () => {
		setAppearance((prev) => ({ ...prev, photo: null }))
	}

	const togglePreviewMode = () => {
		setShowPreviewOnly((prev) => !prev)
	}

	const handleDownload = () => {
		const element = document.getElementById('cv-preview')
		if (!element) return

		const opt = {
			margin: [6, 10],
			filename: 'cv.pdf',
			image: { type: 'jpeg', quality: 1 },
			html2canvas: {
				scale: 3,
				useCORS: true,
				logging: true,
				dpi: 300,
				letterRendering: true,
			},
			jsPDF: {
				unit: 'mm',
				format: 'a4',
				orientation: 'portrait',
			},
		}

		const container = document.createElement('div')
		container.style.width = '210mm'
		container.style.minHeight = '297mm'
		container.style.padding = '12mm 14mm'
		container.style.backgroundColor = '#ffffff'
		container.style.margin = '0 auto'
		container.style.boxSizing = 'border-box'
		const cloned = element.cloneNode(true)
		container.appendChild(cloned)

		html2pdf().set(opt).from(container).save()
	}

	const previewWrapperClasses = showPreviewOnly
		? 'col-span-12 w-full h-full'
		: 'col-span-12 md:col-span-7 mx-auto w-4/5 md:w-4/5'

	const sidebarWrapperClasses = showPreviewOnly
		? 'hidden'
		: 'ek-sidebar h-full overflow-scroll border col-span-12 w-4/5 md:col-span-5 p-8 bg-white shadow-lg shadow-slate-200 rounded-xl mx-auto'

	return (
		<div className='ek-container grid grid-cols-12 gap-4 p-6 md:h-screen overflow-hidden bg-slate-200 mx-auto'>
			<div className='col-span-12 flex items-center justify-end gap-3'>
				<button
					type='button'
					onClick={togglePreviewMode}
					className='flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition'>
					<FaEye />
					<span>
						{showPreviewOnly
							? 'Quitter le mode aperçu'
							: 'Mode aperçu plein écran'}
					</span>
				</button>
				<button
					onClick={handleDownload}
					className='ek-download-cv-btn px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition'>
					Télécharger le CV
				</button>
			</div>
			<div className={sidebarWrapperClasses}>
				<div className='ek-section mb-6'>
					<SectionTitle title='Informations générales' icon={FaUserTie} />
					<form className='max-w-sm mx-auto'>
						<GeneralInfoSection
							generalInfo={generalInfo}
							onChange={handleInputChange}
						/>
					</form>
				</div>

				<div className='ek-section mb-8'>
					<SectionTitle
						title='Expérience académique'
						icon={FaGraduationCap}
					/>
					<div className='ek-education-toggle-container'>
						{educationToggles.map((toggle, index) => (
							<EducationToggle
								key={toggle.id}
								id={toggle.id}
								educationInfo={toggle.info}
								onChange={handleEducationChange}
								onDelete={deleteEducationToggle}
								title={`Formation ${index + 1}`}
							/>
						))}
					</div>
					<button
						type='button'
						onClick={addEducationToggle}
						className='flex items-center justify-center text-2xl border-dashed border-2 border-blue-700 hover:bg-blue-50 text-blue-700 px-12 py-3 rounded-xl w-full transition-colors ease-in-out'>
						<BiPlusCircle />{' '}
						<span className='text-base ms-2'>Ajouter une formation</span>
					</button>
				</div>

				<div className='ek-section mb-8'>
					<SectionTitle
						title='Expérience professionnelle'
						icon={FaBriefcase}
					/>
					<div className='ek-practical-toggle-container'>
						{practicalToggles.map((toggle, index) => (
							<PracticalToggle
								key={toggle.id}
								id={toggle.id}
								practicalInfo={toggle.info}
								onDelete={deletePracticalToggle}
								onChange={handlePracticalChange}
								title={`Expérience ${index + 1}`}
							/>
						))}
					</div>
					<button
						type='button'
						onClick={addPracticalToggle}
						className='flex items-center justify-center text-2xl border-dashed border-2 border-blue-700 hover:bg-blue-50 text-blue-700 px-12 py-3 rounded-xl w-full transition-colors ease-in-out'>
						<BiPlusCircle />{' '}
						<span className='text-base ms-2'>
							Ajouter une expérience
						</span>
					</button>
				</div>

				<div className='ek-section mb-8'>
					<SectionTitle title='Objectif' icon={FaBullseye} />
					<ObjectiveSection
						objectiveText={objectiveText}
						onChange={handleObjectiveChange}
					/>
				</div>

				<div className='ek-section mb-8'>
					<SectionTitle title='Apparence du CV' icon={FaPalette} />
					<div className='space-y-4'>
						<div>
							<label
								htmlFor='theme'
								className='mb-1 block text-sm font-medium text-slate-600'>
								Palette de couleur
							</label>
							<select
								id='theme'
								name='theme'
								value={appearance.theme}
								onChange={handleAppearanceChange}
								className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'>
								{Object.entries(COLOR_THEMES).map(([key, option]) => (
									<option key={key} value={key}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label
								htmlFor='font'
								className='mb-1 block text-sm font-medium text-slate-600'>
								Typographie
							</label>
							<select
								id='font'
								name='font'
								value={appearance.font}
								onChange={handleAppearanceChange}
								className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'>
								{Object.entries(FONT_OPTIONS).map(([key, option]) => (
									<option key={key} value={key}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label
								htmlFor='template'
								className='mb-1 block text-sm font-medium text-slate-600'>
								Template
							</label>
							<select
								id='template'
								name='template'
								value={appearance.template}
								onChange={handleAppearanceChange}
								className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'>
								{Object.entries(TEMPLATE_OPTIONS).map(([key, option]) => (
									<option key={key} value={key}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div>
							<label
								htmlFor='photo'
								className='mb-1 block text-sm font-medium text-slate-600'>
								Photo de profil (optionnel)
							</label>
							<input
								id='photo'
								name='photo'
								type='file'
								accept='image/*'
								onChange={handlePhotoUpload}
								className='w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-3 file:rounded-md file:border file:border-blue-600 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 cursor-pointer'
							/>
							{appearance.photo ? (
								<div className='mt-2 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm'>
									<span className='flex items-center gap-2 text-slate-600'>
										<FaImage /> Photo ajoutée
									</span>
									<button
										type='button'
										onClick={removePhoto}
										className='text-sm font-medium text-blue-600 hover:underline'>
										Supprimer
									</button>
								</div>
							) : (
								<p className='mt-1 text-xs text-slate-500'>
									Formats conseillés&nbsp;: PNG ou JPG, 500x500px.
								</p>
							)}
						</div>
					</div>
				</div>

				<p className='text-xs text-slate-500'>
					Les modifications sont sauvegardées automatiquement sur cet
					appareil.
				</p>
			</div>

			<div
				className={`${previewWrapperClasses} border overflow-scroll bg-white shadow-lg shadow-slate-200 rounded-xl`}>
				<div className='ek-cv-preview min-h-full' id='cv-preview'>
					<CvPreview
						generalInfo={generalInfo}
						objectiveText={objectiveText}
						educationInfos={educationToggles.map((toggle) => toggle.info)}
						practicalInfos={practicalToggles.map((toggle) => toggle.info)}
						theme={selectedTheme}
						fontFamily={selectedFont.stack}
						templateStyle={appearance.template}
						photoUrl={appearance.photo}
					/>
				</div>
			</div>
		</div>
	)
}

export default App
