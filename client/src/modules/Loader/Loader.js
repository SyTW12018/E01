import React from 'react';
import { Dimmer, Loader as SLoader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function Loader(props) {
  const { size, text } = props;

  return (
    <Dimmer active>
      <SLoader size={size}>{text}</SLoader>
    </Dimmer>
  );
}

Loader.propTypes = {
  size: PropTypes.string,
  text: PropTypes.string,
};

Loader.defaultProps = {
  size: 'massive',
  text: '',
};

export default Loader;
