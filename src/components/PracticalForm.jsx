import PropTypes from "prop-types";

const formatDateInputValue = (date) => {
  if (!(date instanceof Date)) {
    return "";
  }

  return Number.isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

const PracticalForm = ({ practicalInfo, onChange, formId }) => {
  const currentCheckboxId = `practical-current-${formId ?? "item"}`;
  const hasInvalidRange =
    !practicalInfo.isCurrent &&
    practicalInfo.startDate instanceof Date &&
    practicalInfo.endDate instanceof Date &&
    !Number.isNaN(practicalInfo.startDate.getTime()) &&
    !Number.isNaN(practicalInfo.endDate.getTime()) &&
    practicalInfo.startDate > practicalInfo.endDate;

  return (
    <div>
      <div>
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor={`practical-title-${formId}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Poste occupé
          </label>
          <input
            type="text"
            id={`practical-title-${formId}`}
            name="practicalTitle"
            placeholder="Ex. Développeur Front-end"
            value={practicalInfo.practicalTitle || ""} // Ajout de la liaison
            onChange={onChange} // Appel du gestionnaire
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          />
        </div>
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor={`company-${formId}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Entreprise ou organisation
          </label>
          <input
            type="text"
            name="company"
            id={`company-${formId}`}
            placeholder="Ex. Elikya Tech"
            value={practicalInfo.company || ""} // Gestion des valeurs vides
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          />
        </div>
        <div className="input-container relative z-0 w-full mb-4 group">
          <label
            htmlFor={`location-${formId}`}
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Ville ou lieu
          </label>
          <input
            type="text"
            name="location"
            id={`location-${formId}`}
            placeholder="Ex. Remote, Paris"
            value={practicalInfo.location || ""} // Gestion des valeurs vides
            onChange={onChange}
            className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
          />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id={currentCheckboxId}
            name="isCurrent"
            checked={Boolean(practicalInfo.isCurrent)}
            onChange={onChange}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor={currentCheckboxId}
            className="text-sm font-medium text-gray-900"
          >
            Je travaille encore dans ce poste
          </label>
        </div>

        <div className="input-container relative z-0 w-full mb-4 group grid grid-cols-2 gap-4">
          <div className="input-container ">
            <label
              htmlFor={`start-date-${formId}`}
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Date de début
            </label>
            <input
              type="date"
              name="startDate"
              id={`start-date-${formId}`}
              value={formatDateInputValue(practicalInfo.startDate)} // Formater la date
              onChange={onChange}
              className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            />
          </div>
          <div className="input-container">
            <label
              htmlFor={`end-date-${formId}`}
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Date de fin
            </label>
            <input
              type="date"
              name="endDate"
              id={`end-date-${formId}`}
              value={formatDateInputValue(practicalInfo.endDate)} // Formater la date
              disabled={Boolean(practicalInfo.isCurrent)}
              onChange={onChange}
              className="bg-gray-50 border border-slate-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 disabled:bg-gray-100 disabled:text-gray-400"
            />
            {practicalInfo.isCurrent ? (
              <p className="mt-1 text-xs text-slate-500">
                La date de fin est désactivée tant que le poste est en cours.
              </p>
            ) : null}
          </div>
        </div>
        {hasInvalidRange ? (
          <p className="text-xs text-red-600">
            Vérifiez les dates : la date de début doit être antérieure à la date
            de fin.
          </p>
        ) : null}
      </div>
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
    isCurrent: PropTypes.bool,
  }),
  onChange: PropTypes.func.isRequired,
  formId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default PracticalForm;
