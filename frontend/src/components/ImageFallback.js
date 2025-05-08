import React, { useState } from "react";
import PropTypes from "prop-types";

const ImageFallback = ({ src, alt, fallbackSrc, style, ...rest }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      src={error ? fallbackSrc : src}
      alt={alt}
      onError={handleError}
      style={style}
      {...rest}
    />
  );
};

ImageFallback.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default ImageFallback;
