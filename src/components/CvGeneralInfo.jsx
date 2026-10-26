import PropTypes from "prop-types";

const CvGeneralInfo = ({
  name = "",
  profession = "",
  email = "",
  phone = "",
  accentColor = "#1d4ed8",
  textColor = "#0f172a",
  photoUrl,
  compact = false,
}) => {
  const containerClass = compact
    ? "flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
    : "grid grid-cols-12 gap-6 items-center";

  return (
    <div className={containerClass} style={{ color: textColor }}>
      <div
        className={
          compact
            ? "flex items-center gap-6"
            : "col-span-8 flex items-center gap-6"
        }
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${name} portrait`}
            className="h-20 w-20 rounded-full object-cover shadow-lg"
            style={{ border: `3px solid ${accentColor}` }}
          />
        ) : null}
        <div>
          <h1
            className="text-2xl uppercase tracking-widest font-semibold"
            style={{ color: accentColor }}
          >
            {name}
          </h1>
          {profession && <p className="uppercase font-normal text-sm opacity-80">{profession}</p>}
        </div>
      </div>
      <div
        className={
          compact
            ? "flex flex-col items-start gap-1 text-sm"
            : "ek-contact-info col-span-4 flex flex-col gap-1 text-sm items-start"
        }
      >
        {email && <p className="font-medium">{email}</p>}
        {phone && <p>{phone}</p>}
      </div>
    </div>
  );
};

CvGeneralInfo.propTypes = {
  name: PropTypes.string,
  profession: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  accentColor: PropTypes.string,
  textColor: PropTypes.string,
  photoUrl: PropTypes.string,
  compact: PropTypes.bool,
};

export default CvGeneralInfo;
