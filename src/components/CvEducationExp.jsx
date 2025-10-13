import PropTypes from "prop-types";

const CvEducationExp = ({
  titleStudy = "Title Study",
  schoolName = "School Nam",
  dateOfStudy = null,
  textColor,
  accentColor,
}) => {
  const hasValidDate =
    dateOfStudy instanceof Date && !Number.isNaN(dateOfStudy.getTime());

  // Formatage de la date pour n'afficher que le mois et l'année
  const formattedDate = hasValidDate
    ? dateOfStudy.toLocaleString("default", {
        month: "long", // Affiche le mois complet
        year: "numeric", // Affiche l'année
      })
    : null;

  const containerStyle = textColor ? { color: textColor } : undefined;
  const headingStyle = accentColor ? { color: accentColor } : undefined;

  return (
    <div className="education-experience font-normal ps-3 mb-3">
      <h3
        className="font-medium uppercase text-sm tracking-wide"
        style={headingStyle}
      >
        {titleStudy}
      </h3>
      <p className="text-sm" style={containerStyle}>
        {[schoolName, formattedDate || "Date à préciser"]
          .filter(Boolean)
          .join(" | ")}
      </p>
    </div>
  );
};

// Utilisation de PropTypes pour valider les props
CvEducationExp.propTypes = {
  titleStudy: PropTypes.string, // Valeur par défaut, donc pas de isRequired
  schoolName: PropTypes.string, // Valeur par défaut, donc pas de isRequired
  dateOfStudy: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.oneOf([null]),
  ]), // Validation pour s'assurer que c'est une date
  textColor: PropTypes.string,
  accentColor: PropTypes.string,
};

export default CvEducationExp;
