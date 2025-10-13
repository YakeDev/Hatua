import PropTypes from "prop-types";

const CvObjective = ({ objectiveText = "", textColor }) => {
  const textStyle = textColor ? { color: textColor } : undefined;

  return (
    <div
      className="font-normal text-sm leading-relaxed ps-3 mb-3"
      style={textStyle}
    >
      {objectiveText ? (
        <p>{objectiveText}</p>
      ) : (
        <p>Aucun objectif défini.</p>
      )}
    </div>
  );
};

CvObjective.propTypes = {
  objectiveText: PropTypes.string,
  textColor: PropTypes.string,
};

export default CvObjective;
