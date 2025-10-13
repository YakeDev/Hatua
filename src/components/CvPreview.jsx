import PropTypes from "prop-types";
import { FaBriefcase, FaBullseye, FaGraduationCap } from "react-icons/fa6";

import CvEducationExp from "./CvEducationExp";
import CvGeneralInfo from "./CvGeneralInfo";
import CvObjective from "./CvObjective";
import CvPracticalExp from "./CvPracticalExp";

const SectionHeading = ({
  icon: Icon,
  label,
  accentColor,
  accentLight,
  compact = false,
}) => (
  <div
    className={`mb-4 flex items-center gap-2 rounded-md font-semibold uppercase tracking-wide ${
      compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
    }`}
    style={{ backgroundColor: accentLight, color: accentColor }}
  >
    <Icon />
    <span>{label}</span>
  </div>
);

SectionHeading.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  accentColor: PropTypes.string.isRequired,
  accentLight: PropTypes.string.isRequired,
  compact: PropTypes.bool,
};

const CvPreview = ({
  generalInfo,
  objectiveText,
  educationInfos = [],
  practicalInfos = [],
  theme,
  fontFamily,
  templateStyle = "classic",
  photoUrl,
}) => {
  const accentColor = theme?.accentColor ?? "#1d4ed8";
  const accentLight = theme?.accentLight ?? "#e2e8f0";
  const headingColor = theme?.text ?? "#0f172a";
  const bodyColor = theme?.bodyText ?? "#475569";

  const isCompact = templateStyle === "compact";
  const sectionSpacing = isCompact ? "mb-6 px-10" : "mb-8 px-16";
  const generalInfoPadding = isCompact ? "px-10 py-10" : "px-14 py-14";
  const rootSpacingClass = isCompact ? "space-y-6 pb-8" : "space-y-8 pb-12";

  return (
    <div className={rootSpacingClass} style={{ fontFamily }}>
      <div
        className={`ek-cv-section ek-cv-general-info ${generalInfoPadding}`}
        style={{ backgroundColor: accentLight, color: headingColor }}
      >
        <CvGeneralInfo
          name={generalInfo?.name || "Votre nom"}
          profession={generalInfo?.profession || "Votre fonction"}
          email={generalInfo?.email || "contact@email.com"}
          phone={generalInfo?.phone || "Téléphone"}
          accentColor={accentColor}
          textColor={headingColor}
          photoUrl={photoUrl}
          compact={isCompact}
        />
      </div>

      <div className={`ek-cv-section ${sectionSpacing}`}>
        <SectionHeading
          icon={FaBullseye}
          label="Objectif"
          accentColor={accentColor}
          accentLight={accentLight}
          compact={isCompact}
        />
        <CvObjective
          objectiveText={objectiveText?.objective || ""}
          textColor={bodyColor}
        />
      </div>

      <div className={`ek-cv-section ${sectionSpacing}`}>
        <SectionHeading
          icon={FaGraduationCap}
          label="Formation"
          accentColor={accentColor}
          accentLight={accentLight}
          compact={isCompact}
        />
        {educationInfos.length > 0 ? (
          educationInfos.map((educationInfo, index) => (
            <CvEducationExp
              key={`education-${index}`}
              titleStudy={educationInfo?.studyTitle || "Intitulé à préciser"}
              schoolName={educationInfo?.schoolName || "Établissement"}
              dateOfStudy={educationInfo?.dateOfStudy}
              textColor={bodyColor}
              accentColor={accentColor}
            />
          ))
        ) : (
          <p className="text-sm text-slate-400">
            Renseignez vos études pour enrichir le CV.
          </p>
        )}
      </div>

      <div className={`ek-cv-section ${sectionSpacing}`}>
        <SectionHeading
          icon={FaBriefcase}
          label="Expérience"
          accentColor={accentColor}
          accentLight={accentLight}
          compact={isCompact}
        />
        {practicalInfos.length > 0 ? (
          practicalInfos.map((practicalInfo, index) => (
            <CvPracticalExp
              key={`practical-${index}`}
              practicalTitle={
                practicalInfo?.practicalTitle || "Intitulé du poste"
              }
              company={practicalInfo?.company || "Entreprise"}
              location={practicalInfo?.location || "Localisation"}
              startDate={practicalInfo?.startDate}
              endDate={practicalInfo?.endDate}
              isCurrent={Boolean(practicalInfo?.isCurrent)}
              textColor={bodyColor}
              accentColor={accentColor}
            />
          ))
        ) : (
          <p className="text-sm text-slate-400">
            Ajoutez vos expériences professionnelles marquantes.
          </p>
        )}
      </div>
    </div>
  );
};

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
      isCurrent: PropTypes.bool,
    })
  ),
  theme: PropTypes.shape({
    accentColor: PropTypes.string,
    accentLight: PropTypes.string,
    text: PropTypes.string,
    bodyText: PropTypes.string,
  }),
  fontFamily: PropTypes.string,
  templateStyle: PropTypes.oneOf(["classic", "compact"]),
  photoUrl: PropTypes.string,
};

export default CvPreview;
