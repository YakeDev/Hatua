import EducationForm from "./EducationForm";
import PropTypes from "prop-types";
import { useState } from "react";
import { BiChevronUp, BiChevronDown, BiTrash } from "react-icons/bi";

const EducationToggle = ({
  title = "Education Toggle",
  id,
  onDelete,
  onChange,
  educationInfo,
}) => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className=" border border-slate-200 rounded-xl mb-3">
      <div className="toggle-header flex items-center justify-between w-full p-3 font-medium rtl:text-right text-gray-500  focus:ring-4 rounded-xl border border-t-0 border-x-0  focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-slate-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3">
        <p>{title}</p>
        <button onClick={handleToggle} className="text-xl p-1">
          {isOpen ? <BiChevronDown /> : <BiChevronUp />}
        </button>
      </div>
      {isOpen && (
        <div className="ek-toggle p-3">
          <EducationForm
            educationInfo={educationInfo}
            onChange={handleEducationChange}
          />
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="flex items-center text-lg border px-12 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition duration-700 ease-in-out"
          >
            <BiTrash /> <span className="text-base"> Delete</span>
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
};

export default EducationToggle;
