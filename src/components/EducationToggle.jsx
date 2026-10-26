import EducationForm from "./EducationForm";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { BiChevronUp, BiChevronDown, BiTrash } from "react-icons/bi";

const EducationToggle = ({
  title = "Education Toggle",
  id,
  onDelete,
  onChange,
  educationInfo,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleEducationChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;

    if (name === "dateOfStudy") {
      if (!value) {
        updatedValue = null;
      } else {
        const parsedDate = new Date(value);
        updatedValue = Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
      }
    }

    const updatedEducationInfo = {
      ...educationInfo,
      [name]: updatedValue,
    };

    onChange(id, updatedEducationInfo); // Faire remonter les informations à App
  };

  const summary = useMemo(() => {
    const formatSummaryDate = (date) => {
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
      return date.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      });
    };

    const parts = [];

    if (educationInfo.studyTitle) {
      parts.push(educationInfo.studyTitle);
    }

    if (educationInfo.schoolName) {
      parts.push(educationInfo.schoolName);
    }

    const formattedDate = formatSummaryDate(educationInfo.dateOfStudy);
    if (formattedDate) {
      parts.push(formattedDate);
    }

    return parts.join(" • ");
  }, [educationInfo]);

  return (
    <div className=" border border-slate-200 rounded-xl mb-3">
      <div className="toggle-header flex items-start justify-between w-full p-3 font-medium rtl:text-right text-gray-500 focus:ring-4 rounded-xl border border-t-0 border-x-0 focus:ring-gray-200 hover:bg-gray-100 gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          {summary ? (
            <p className="mt-1 text-xs font-normal text-slate-500">{summary}</p>
          ) : (
            <p className="mt-1 text-xs font-normal text-slate-400">
              Ajoutez les informations de cette formation.
            </p>
          )}
        </div>
        <button type="button" onClick={handleToggle} aria-label={`${isOpen ? 'Réduire' : 'Ouvrir'} ${title}`} aria-expanded={isOpen} aria-controls={`education-${id}`} className="text-xl p-1">
          {isOpen ? <BiChevronDown /> : <BiChevronUp />}
        </button>
      </div>
      {isOpen && (
        <div className="ek-toggle p-3" id={`education-${id}`}>
          <EducationForm
            educationInfo={educationInfo}
            onChange={handleEducationChange}
            formId={id}
          />
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="flex items-center text-lg border px-12 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-700 ease-in-out"
          >
            <BiTrash /> <span className="text-base"> Supprimer</span>
          </button>
        </div>
      )}
    </div>
  );
};

EducationToggle.propTypes = {
  title: PropTypes.string,
  id: PropTypes.number,
  onDelete: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  educationInfo: PropTypes.shape({
    schoolName: PropTypes.string,
    studyTitle: PropTypes.string,
    dateOfStudy: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.oneOf([null]),
    ]),
  }).isRequired,
  defaultOpen: PropTypes.bool,
};

export default EducationToggle;
