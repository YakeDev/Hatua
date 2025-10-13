import PracticalForm from "./PracticalForm";
import PropTypes from "prop-types";
import { useState } from "react";
import { BiChevronUp, BiChevronDown, BiTrash } from "react-icons/bi";

const PracticalToggle = ({
  title = "Practical Experience",
  id,
  onDelete,
  onChange,
  practicalInfo,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handlePracticalChange = (event) => {
    const { name, value } = event.target;
    let updatedValue = value;

    if (name === "startDate" || name === "endDate") {
      if (!value) {
        updatedValue = null;
      } else {
        const parsedDate = new Date(value);
        updatedValue = Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
      }
    }

    const updatedPracticalInfo = {
      ...practicalInfo,
      [name]: updatedValue,
    };

    onChange(id, updatedPracticalInfo);
  };

  return (
    <div className="border border-gray-200 rounded-xl mb-3">
      <div className="toggle-header flex items-center justify-between w-full p-3 font-medium rtl:text-right text-gray-500  focus:ring-4 rounded-xl border border-t-0 border-x-0  focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-slate-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3">
        <p>{title}</p>
        <button onClick={handleToggle} className="text-xl p-1">
          {isOpen ? <BiChevronDown /> : <BiChevronUp />}
        </button>
      </div>

      {isOpen && (
        <div className="ek-toggle p-3">
          <PracticalForm
            practicalInfo={practicalInfo}
            onChange={handlePracticalChange}
          />
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="flex items-center text-lg border px-12 py-1.5 rounded-lg hover:bg-red-700 bg-red-600 text-white transition duration-700 ease-in-out"
          >
            <BiTrash /> <span className="text-base"> Delete</span>
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
  }).isRequired, // Ensure practicalInfo is always provided
};

export default PracticalToggle;
