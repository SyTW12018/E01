import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function Loading(props) {
  const { size, text } = props;

  return (
    <Dimmer active>
      <Loader size={size}>{text}</Loader>
    </Dimmer>
  );
}

Loading.propTypes = {
  size: PropTypes.string,
  text: PropTypes.string,
};

Loading.defaultProps = {
  size: 'massive',
  text: '',
};

export default Loading;
