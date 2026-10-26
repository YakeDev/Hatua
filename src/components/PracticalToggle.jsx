import PracticalForm from "./PracticalForm";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { BiChevronUp, BiChevronDown, BiTrash } from "react-icons/bi";

const PracticalToggle = ({
  title = "Practical Experience",
  id,
  onDelete,
  onChange,
  practicalInfo,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handlePracticalChange = (event) => {
    const { name, value, type, checked } = event.target;
    let updatedValue = value;

    if (name === "startDate" || name === "endDate") {
      if (!value) {
        updatedValue = null;
      } else {
        const parsedDate = new Date(value);
        updatedValue = Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
      }
    }
    if (name === "isCurrent" && type === "checkbox") {
      updatedValue = checked;
    }

    const updatedPracticalInfo = {
      ...practicalInfo,
      [name]: updatedValue,
    };

    onChange(id, updatedPracticalInfo);
  };

  const summary = useMemo(() => {
    const formatSummaryDate = (date) => {
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
      return date.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      });
    };

    const role = practicalInfo.practicalTitle || "Rôle à préciser";
    const company = practicalInfo.company || "Entreprise";
    const start = formatSummaryDate(practicalInfo.startDate);
    const end = practicalInfo.isCurrent
      ? "Présent"
      : formatSummaryDate(practicalInfo.endDate);

    const dateSegment =
      start || end ? `${start ?? "Date à définir"} – ${end ?? "Date à définir"}` : "";

    return [role, company, dateSegment]
      .filter((segment) => Boolean(segment))
      .join(" • ");
  }, [practicalInfo]);

  return (
    <div className="border border-gray-200 rounded-xl mb-3">
      <div className="toggle-header flex items-start justify-between w-full p-3 font-medium rtl:text-right text-gray-500  focus:ring-4 rounded-xl border border-t-0 border-x-0  focus:ring-gray-200 hover:bg-gray-100 gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          {summary ? (
            <p className="mt-1 text-xs font-normal text-slate-500">{summary}</p>
          ) : (
            <p className="mt-1 text-xs font-normal text-slate-400">
              Ajoutez les informations de cette expérience.
            </p>
          )}
        </div>
        <button type="button" onClick={handleToggle} aria-label={`${isOpen ? 'Réduire' : 'Ouvrir'} ${title}`} aria-expanded={isOpen} aria-controls={`practical-${id}`} className="text-xl p-1">
          {isOpen ? <BiChevronDown /> : <BiChevronUp />}
        </button>
      </div>

      {isOpen && (
        <div className="ek-toggle p-3" id={`practical-${id}`}>
          <PracticalForm
            practicalInfo={practicalInfo}
            onChange={handlePracticalChange}
            formId={id}
          />
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="flex items-center text-lg border px-12 py-1.5 rounded-lg hover:bg-red-700 bg-red-600 text-white transition duration-700 ease-in-out"
          >
            <BiTrash /> <span className="text-base"> Supprimer</span>
          </button>
        </div>
      )}
    </div>
  );
};

PracticalToggle.propTypes = {
  title: PropTypes.string, // Optional
  id: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  practicalInfo: PropTypes.shape({
    practicalTitle: PropTypes.string.isRequired,
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
  }).isRequired, // Ensure practicalInfo is always provided
  defaultOpen: PropTypes.bool,
};

export default PracticalToggle;
