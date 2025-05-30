import PropTypes from 'prop-types';

const LoadingScreen = ({ message = 'Loading DevConnect...' }) => {
  return (
    <div className="loading-container ">
      <div className="text-center font-light">
        <div className="app-loading-spinner mx-auto"></div>
        <p className="mt-4 text-white text-base sm:text-lg font-light">{message}</p>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
};

export default LoadingScreen;
