import PropTypes from "prop-types"; // Import PropTypes

const formatDateInputValue = (date) => {
  if (!(date instanceof Date)) {
    return "";
  }

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const EducationForm = ({ educationInfo, onChange, formId }) => {
  return (
    <div>
      <div className="max-w-sm mx-auto">
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor={`study-title-${formId}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Diplôme ou formation
          </label>
          <input
            id={`study-title-${formId}`}
            type="text"
            name="studyTitle"
            placeholder="Ex. Ingénierie logicielle (M2)"
            value={educationInfo.studyTitle}
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          />
        </div>
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor={`school-name-${formId}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Établissement
          </label>
          <input
            id={`school-name-${formId}`}
            type="text"
            name="schoolName"
            placeholder="Ex. Université de Lubumbashi"
            value={educationInfo.schoolName}
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          />
        </div>

        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor={`date-of-study-${formId}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Date de fin (facultatif)
          </label>
          <input
            type="date"
            id={`date-of-study-${formId}`}
            name="dateOfStudy"
            value={formatDateInputValue(educationInfo.dateOfStudy)} // Format Date for input
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          />
          <p className="mt-1 text-xs text-slate-500">
            Laissez vide si la formation est toujours en cours.
          </p>
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for the component
EducationForm.propTypes = {
  educationInfo: PropTypes.shape({
    studyTitle: PropTypes.string.isRequired,
    schoolName: PropTypes.string.isRequired,
    dateOfStudy: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.oneOf([null]),
    ]), // Expect a Date object or null
  }).isRequired, // This prop is required
  onChange: PropTypes.func.isRequired, // Expect a function for onChange
  formId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default EducationForm;
