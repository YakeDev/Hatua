import PropTypes from "prop-types"; // Import PropTypes

const formatDateInputValue = (date) => {
  if (!(date instanceof Date)) {
    return "";
  }

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const EducationForm = ({ educationInfo, onChange }) => {
  return (
    <div>
      <form className="max-w-sm mx-auto">
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor="study-title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title of Study:
          </label>
          <input
            id="study-title"
            type="text"
            name="studyTitle"
            required
            placeholder="Title of study"
            value={educationInfo.studyTitle}
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor="school-name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            School Name:
          </label>
          <input
            id="school-name"
            type="text"
            name="schoolName"
            required
            placeholder="School name"
            value={educationInfo.schoolName}
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor="date-of-study"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Date of Study:
          </label>
          <input
            type="date"
            id="date-of-study"
            name="dateOfStudy"
            value={formatDateInputValue(educationInfo.dateOfStudy)} // Format Date for input
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </form>
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
};

export default EducationForm;
