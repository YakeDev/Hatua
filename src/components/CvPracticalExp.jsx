import PropTypes from "prop-types";

const CvPracticalExp = ({
  practicalTitle = "",
  company = "",
  location = "",
  startDate = null,
  endDate = null,
  isCurrent = false,
  textColor,
  accentColor,
}) => {
  const hasValidStart =
    startDate instanceof Date && !Number.isNaN(startDate.getTime());
  const hasValidEnd =
    endDate instanceof Date && !Number.isNaN(endDate.getTime());

  // Formatage des dates pour n'afficher que le mois et l'année
  const formattedStartDate = hasValidStart
    ? startDate.toLocaleString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : null;

  const formattedEndDate = hasValidEnd
    ? endDate.toLocaleString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : null;

  let dateRange = "";
  if (formattedStartDate && formattedEndDate) {
    dateRange = `${formattedStartDate} - ${formattedEndDate}`;
  } else if (formattedStartDate && isCurrent) {
    dateRange = `${formattedStartDate} - Présent`;
  } else if (formattedStartDate) {
    dateRange = formattedStartDate;
  } else if (formattedEndDate && !isCurrent) {
    dateRange = formattedEndDate;
  } else if (isCurrent) {
    dateRange = "Présent";
  }

  const containerStyle = textColor ? { color: textColor } : undefined;
  const headingStyle = accentColor ? { color: accentColor } : undefined;

  return (
    <div className="practical-experience font-normal text-sm ps-3 mb-3" style={containerStyle}>
      <p className="uppercase font-semibold" style={headingStyle}>
        {practicalTitle}
      </p>
      <p>
        <span className="font-medium text-sm">{company}</span>
        <span>{company && location ? " • " : ""}</span>
        <span>{location}</span>
        {dateRange && <span>{` | ${dateRange}`}</span>}
      </p>
    </div>
  );
};

// Utilisation de PropTypes pour valider les props
CvPracticalExp.propTypes = {
  practicalTitle: PropTypes.string, // Valeur par défaut, donc pas de isRequired
  company: PropTypes.string, // Valeur par défaut, donc pas de isRequired
  location: PropTypes.string, // Valeur par défaut, donc pas de isRequired
  startDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.oneOf([null]),
  ]), // Validation pour s'assurer que c'est une date
  endDate: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.oneOf([null]),
  ]), // Validation pour s'assurer que c'est une date
  isCurrent: PropTypes.bool,
  textColor: PropTypes.string,
  accentColor: PropTypes.string,
};

export default CvPracticalExp;
