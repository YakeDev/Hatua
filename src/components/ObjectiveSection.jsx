import PropTypes from "prop-types";

const ObjectiveSection = ({ objectiveText, onChange }) => {
  return (
    <div>
      <div className="mx-auto">
        <div className="input-container">
          <label
            htmlFor="objective"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Votre profil en quelques mots
          </label>
          <textarea
            name="objective"
            id="objective"
            rows="4"
            placeholder="Ex. Développeuse web avec trois ans d’expérience en création de sites accessibles…"
            value={objectiveText.objective}
            onChange={onChange}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
          <p className="mt-1 text-xs text-slate-500">
            Résumez vos forces en 2&nbsp;ou 3 phrases pour capter l’attention.
          </p>
        </div>
      </div>
    </div>
  );
};

// Définition des types de props
ObjectiveSection.propTypes = {
  objectiveText: PropTypes.shape({
    objective: PropTypes.string.isRequired,
  }),
  onChange: PropTypes.func,
};

export default ObjectiveSection;
