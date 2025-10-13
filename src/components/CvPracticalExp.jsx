import PropTypes from "prop-types";

const CvPracticalExp = ({
  practicalTitle = "Practical Title",
  company = "Company name",
  location = "Company location",
  startDate = null,
  endDate = null,
}) => {
  const hasValidStart =
    startDate instanceof Date && !Number.isNaN(startDate.getTime());
  const hasValidEnd =
    endDate instanceof Date && !Number.isNaN(endDate.getTime());

  // Formatage des dates pour n'afficher que le mois et l'année
  const formattedStartDate = hasValidStart
    ? startDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      })
    : null;

  const formattedEndDate = hasValidEnd
    ? endDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      })
    : null;

  let dateRange = "Dates not specified";
  if (formattedStartDate && formattedEndDate) {
    dateRange = `${formattedStartDate} - ${formattedEndDate}`;
  } else if (formattedStartDate) {
    dateRange = `${formattedStartDate} - Present`;
  } else if (formattedEndDate) {
    dateRange = formattedEndDate;
  }

  return (
    <div className="font-normal text-sm text-slate-500 ps-3 mb-3">
      <p className="text-slate-600 uppercase font-semibold">{practicalTitle}</p>
      <p>
        <span className="font-medium text-sm">{company}, </span>
        <span>{location} | </span>
        <span>{dateRange}</span>
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
};

export default CvPracticalExp;
