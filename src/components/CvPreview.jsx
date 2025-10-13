import PropTypes from 'prop-types' // Importer PropTypes
import CvEducationExp from './CvEducationExp'
import CvGeneralInfo from './CvGeneralInfo'
import CvPracticalExp from './CvPracticalExp'
import SectionTitle from './SectionTitle'
import CvObjective from './CvObjective'
import { FaGraduationCap, FaBriefcase, FaBullseye } from 'react-icons/fa6'

const CvPreview = ({
	generalInfo,
	objectiveText,
	educationInfos = [],
	practicalInfos = [],
}) => {
	return (
		<div>
			<div className='ek-cv-section ek-cv-general-info mb-8 px-14 py-14 bg-slate-100 text-slate-600'>
				<CvGeneralInfo
					name={generalInfo?.name || 'Your name'}
					profession={generalInfo?.profession || 'Function'}
					email={generalInfo?.email || 'Your Email'}
					phone={generalInfo?.phone || 'Your Phone number'}
				/>
			</div>
			<div className='ek-cv-section mb-8 px-16'>
				<SectionTitle title='Objective' icon={FaBullseye} />
				<CvObjective objectiveText={objectiveText?.objective || ''} />
			</div>

			<div className='ek-cv-section mb-8  px-16'>
				<SectionTitle title='Education' icon={FaGraduationCap} />
				{educationInfos.length > 0 ? (
					educationInfos.map((educationInfo, index) => (
						<CvEducationExp
							key={index}
							titleStudy={educationInfo?.studyTitle || 'Study Title'}
							schoolName={educationInfo?.schoolName || 'School Name'}
							dateOfStudy={educationInfo?.dateOfStudy}
						/>
					))
				) : (
					<p>No education experience provided.</p>
				)}
			</div>
			<div className='ek-cv-section mb-8 px-16 pb-14'>
				<SectionTitle title='Practical Experience' icon={FaBriefcase} />
				{practicalInfos.length > 0 ? (
					practicalInfos.map((practicalInfo, index) => (
						<CvPracticalExp
							key={index}
							practicalTitle={
								practicalInfo?.practicalTitle || 'Practicle Title'
							}
							company={practicalInfo?.company || 'Company Name'}
							location={practicalInfo?.location || 'Location'}
							startDate={practicalInfo?.startDate}
							endDate={practicalInfo?.endDate}
						/>
					))
				) : (
					<p>No practical experience provided.</p>
				)}
			</div>
		</div>
	)
}

// Définir les types de props
CvPreview.propTypes = {
	generalInfo: PropTypes.shape({
		name: PropTypes.string.isRequired,
		profession: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		phone: PropTypes.string.isRequired,
	}).isRequired,

	objectiveText: PropTypes.shape({
		objective: PropTypes.string,
	}),

	educationInfos: PropTypes.arrayOf(
		PropTypes.shape({
			schoolName: PropTypes.string,
			studyTitle: PropTypes.string,
			dateOfStudy: PropTypes.oneOfType([
				PropTypes.instanceOf(Date),
				PropTypes.oneOf([null]),
			]),
		})
	),

	practicalInfos: PropTypes.arrayOf(
		PropTypes.shape({
			company: PropTypes.string,
			location: PropTypes.string,
			startDate: PropTypes.oneOfType([
				PropTypes.instanceOf(Date),
				PropTypes.oneOf([null]),
			]),
			endDate: PropTypes.oneOfType([
				PropTypes.instanceOf(Date),
				PropTypes.oneOf([null]),
			]),
		})
	),
}

export default CvPreview
