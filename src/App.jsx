import { useEffect, useMemo, useRef, useState } from 'react'
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
	schoolName: '',
	studyTitle: '',
	dateOfStudy: null,
}

const defaultPracticalInfo = {
	practicalTitle: '',
	company: '',
	location: '',
	startDate: null,
	endDate: null,
	isCurrent: false,
}

const DEFAULT_STATE = {
	generalInfo: {
		name: '',
		profession: '',
		email: '',
		phone: '',
	},
	objectiveText: {
		objective: '',
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
		return { snapshot: DEFAULT_STATE, loadError: false }
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY)
		if (!raw) {
			return { snapshot: DEFAULT_STATE, loadError: false }
		}

		const parsed = JSON.parse(raw)
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			throw new Error('Invalid saved CV data')
		}

		return {
			snapshot: {
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
			},
			loadError: false,
		}
	} catch (error) {
		console.warn('Unable to load saved CV data:', error)
		// Keep the original data intact until the user can recover it.
		return { snapshot: DEFAULT_STATE, loadError: true }
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
	const { snapshot: storedSnapshot, loadError } = useMemo(loadStoredState, [])

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
	const [mobilePanel, setMobilePanel] = useState('editor')
	const [saveError, setSaveError] = useState(false)
	const [downloadError, setDownloadError] = useState('')
	const [isGenerating, setIsGenerating] = useState(false)
	const previewFrameRef = useRef(null)
	const previewRef = useRef(null)
	const [previewMetrics, setPreviewMetrics] = useState({ scale: 1, height: 0 })

	const selectedTheme = useMemo(
		() => COLOR_THEMES[appearance.theme] ?? COLOR_THEMES.cobalt,
		[appearance.theme]
	)

	const selectedFont = useMemo(
		() => FONT_OPTIONS[appearance.font] ?? FONT_OPTIONS.sans,
		[appearance.font]
	)

	useEffect(() => {
		if (typeof window === 'undefined' || loadError) return

		const payload = serializeState({
			generalInfo,
			objectiveText,
			educationToggles,
			practicalToggles,
			appearance,
		})

		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
			setSaveError(false)
		} catch (error) {
			console.warn('Unable to save CV data:', error)
			setSaveError(true)
		}
	}, [
		loadError,
		appearance,
		educationToggles,
		generalInfo,
		objectiveText,
		practicalToggles,
	])

	useEffect(() => {
		const frame = previewFrameRef.current
		const preview = previewRef.current
		if (!frame || !preview || typeof ResizeObserver === 'undefined') return

		const measure = () => {
			const scale = Math.min(1, frame.clientWidth / preview.offsetWidth)
			setPreviewMetrics({ scale, height: preview.scrollHeight * scale })
		}
		const observer = new ResizeObserver(measure)
		observer.observe(frame)
		observer.observe(preview)
		measure()
		return () => observer.disconnect()
	}, [mobilePanel, showPreviewOnly])

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
		setDownloadError('')
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
		setDownloadError('')
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

	const handleDownload = async () => {
		const element = previewRef.current
		if (!element || isGenerating) return

		const name = generalInfo.name.trim()
		const email = generalInfo.email.trim()
		const phone = generalInfo.phone.trim()
		if (!name || (!email && !phone)) {
			setDownloadError('Ajoutez votre nom et au moins un moyen de contact avant de télécharger le CV.')
			setMobilePanel('editor')
			setShowPreviewOnly(false)
			return
		}
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setDownloadError('Vérifiez votre adresse e-mail avant de télécharger le CV.')
			setMobilePanel('editor')
			setShowPreviewOnly(false)
			return
		}
		if (practicalToggles.some(({ info }) => !info.isCurrent && info.startDate && info.endDate && info.startDate > info.endDate)) {
			setDownloadError('Corrigez les dates de vos expériences avant de télécharger le CV.')
			setMobilePanel('editor')
			setShowPreviewOnly(false)
			return
		}

		setDownloadError('')
		setIsGenerating(true)
		const safeName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'Candidat'

		const opt = {
			margin: [10, 10],
			filename: `CV-${safeName}.pdf`,
			image: { type: 'jpeg', quality: 1 },
			html2canvas: {
				scale: 2,
				useCORS: true,
				logging: false,
			},
			jsPDF: {
				unit: 'mm',
				format: 'a4',
				orientation: 'portrait',
			},
			pagebreak: { mode: ['css', 'legacy'] },
		}

		const container = document.createElement('div')
		container.style.width = '190mm'
		container.style.backgroundColor = '#ffffff'
		container.style.boxSizing = 'border-box'
		const cloned = element.cloneNode(true)
		cloned.style.width = '100%'
		cloned.style.minHeight = '0'
		cloned.style.transform = 'none'
		cloned.style.boxShadow = 'none'
		container.appendChild(cloned)

		try {
			const { default: html2pdf } = await import('html2pdf.js')
			await html2pdf().set(opt).from(container).save()
		} catch (error) {
			console.error('Unable to export the CV:', error)
			setDownloadError('Le PDF n’a pas pu être généré. Réessayez dans un instant.')
		} finally {
			setIsGenerating(false)
		}
	}

	return (
		<div className='hatua-page'>
			<header className='site-header'>
				<a href='#editor' className='brand' aria-label='Hatua, aller à l’éditeur de CV'>
					<span className='brand-mark' aria-hidden='true'>H</span>
					<span>hatua<span className='brand-dot'>.</span></span>
				</a>
				<span className='header-note'>Votre parcours mérite d’être bien présenté.</span>
			</header>
			<section className='intro' aria-labelledby='intro-title'>
				<p className='eyebrow'>Votre candidature commence ici</p>
				<h1 id='intro-title'>Un CV clair, prêt à partager.</h1>
				<p>Racontez votre parcours, voyez le résultat au fur et à mesure, puis téléchargez votre CV en PDF.</p>
				<div className='intro-details' aria-label='Ce que propose Hatua'>
					<span>Gratuit</span><span>Sans compte</span><span>Enregistrement sur cet appareil</span>
				</div>
			</section>
			<div className='workspace-heading'>
				<div>
					<p className='eyebrow'>Éditeur de CV</p>
					<h2>Votre parcours, à votre façon</h2>
					<p>Commencez par vos coordonnées. Ajoutez ensuite vos expériences et choisissez la présentation qui vous convient.</p>
				</div>
				<div className='workspace-actions'>
				<button
					type='button'
					onClick={togglePreviewMode}
					className='preview-toggle'>
					<FaEye />
					<span>
						{showPreviewOnly
							? 'Voir l’éditeur'
							: 'Agrandir l’aperçu'}
					</span>
				</button>
				<button
					type='button'
					onClick={handleDownload}
					disabled={isGenerating}
					className='download-button'>
					{isGenerating ? 'Création du PDF…' : 'Télécharger le PDF'}
				</button>
				</div>
			</div>
			{downloadError && <p className='status-message status-error' role='alert'>{downloadError}</p>}
			{(loadError || saveError) && (
				<p className='status-message status-error' role='alert'>
					{loadError
						? 'Impossible de lire le CV enregistré. Les anciennes données n’ont pas été effacées ; les modifications de cette session ne seront pas sauvegardées.'
						: 'La sauvegarde a échoué. Votre CV est visible ici, mais il risque de disparaître si vous fermez cette page.'}
				</p>
			)}
			<nav className='mobile-tabs' aria-label='Affichage du CV'>
				<button type='button' aria-current={mobilePanel === 'editor' ? 'page' : undefined} onClick={() => { setMobilePanel('editor'); setShowPreviewOnly(false) }}>Rédiger</button>
				<button type='button' aria-current={mobilePanel === 'preview' ? 'page' : undefined} onClick={() => setMobilePanel('preview')}>Voir le CV</button>
			</nav>
			<main className={`workspace-grid ${showPreviewOnly ? 'preview-only' : ''}`}>
			<section id='editor' className={`editor-panel ${mobilePanel === 'preview' || showPreviewOnly ? 'mobile-hidden' : ''}`} aria-label='Rédiger le CV'>
				<div className='editor-intro'>
					<span className='editor-step'>01 / VOTRE PARCOURS</span>
					<h3>Faisons connaissance</h3>
					<p>Remplissez les rubriques utiles pour votre candidature. Vous pouvez revenir les modifier à tout moment.</p>
				</div>
				<div className='ek-section mb-6'>
					<SectionTitle title='Informations générales' icon={FaUserTie} />
					<div>
						<GeneralInfoSection
							generalInfo={generalInfo}
							onChange={handleInputChange}
						/>
					</div>
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
								defaultOpen={index === 0}
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
								defaultOpen={index === 0}
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

				<p className='save-note' role='status'>
					{loadError || saveError ? 'Sauvegarde indisponible' : 'Enregistré automatiquement dans ce navigateur. Vos données ne sont pas synchronisées avec d’autres appareils.'}
				</p>
			</section>

			<section className={`preview-panel ${mobilePanel === 'editor' && !showPreviewOnly ? 'mobile-hidden' : ''}`} aria-label='Aperçu du CV'>
				<div className='preview-panel-header'>
					<div><span className='editor-step'>02 / APERÇU</span><h3>Votre CV en direct</h3></div>
					<span>Format A4</span>
				</div>
				<div ref={previewFrameRef} className='preview-frame' style={{ height: previewMetrics.height || undefined }}>
				<div className='ek-cv-preview' ref={previewRef} id='cv-preview' style={{ transform: `scale(${previewMetrics.scale})` }}>
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
			</section>
			</main>
			<footer className='site-footer'>Hatua · Créez un CV qui raconte votre parcours.</footer>
		</div>
	)
}

export default App
