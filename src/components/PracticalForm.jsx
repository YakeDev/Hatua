import PropTypes from "prop-types";

const formatDateInputValue = (date) => {
  if (!(date instanceof Date)) {
    return "";
  }

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const PracticalForm = ({ practicalInfo, onChange }) => {
  return (
    <div>
      <form>
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor="practicle-title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title:
          </label>
          <input
            type="text"
            id="practicle-title"
            name="practicalTitle"
            required
            placeholder="Title"
            value={practicalInfo.practicalTitle || ""} // Ajout de la liaison
            onChange={onChange} // Appel du gestionnaire
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor="company"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Company:
          </label>
          <input
            type="text"
            name="company"
            id="company"
            required
            placeholder="Company"
            value={practicalInfo.company || ""} // Gestion des valeurs vides
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor="location"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Location:
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            placeholder="Location"
            value={practicalInfo.location || ""} // Gestion des valeurs vides
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="input-container relative z-0 w-full mb-4 group grid grid-cols-2 gap-4">
          <div className="input-container ">
            <label
              htmlFor="start-date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Start date:
            </label>
            <input
              type="date"
              name="startDate"
              id="start-date"
              value={formatDateInputValue(practicalInfo.startDate)} // Formater la date
              onChange={onChange}
              className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="input-container">
            <label
              htmlFor="end-date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              End date:
            </label>
            <input
              type="date"
              name="endDate"
              id="end-date"
              value={formatDateInputValue(practicalInfo.endDate)} // Formater la date
              onChange={onChange}
              className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

// Define PropTypes for the component
PracticalForm.propTypes = {
  practicalInfo: PropTypes.shape({
    practicalTitle: PropTypes.string,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    startDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.oneOf([null]),
    ]),
    endDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.oneOf([null]),
    ]),
  }),
  onChange: PropTypes.func.isRequired,
};

export default PracticalForm;
