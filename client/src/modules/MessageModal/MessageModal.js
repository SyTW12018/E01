import React from 'react';
import { Modal, Button, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function MessageModal(props) {
  const {
    open, size, canDismiss, onClose, buttonText, headerText, text, errors,
  } = props;

  return (
    <Modal
      open={open}
      closeOnEscape={canDismiss}
      closeOnDimmerClick={canDismiss}
      onClose={onClose}
      size={size}
    >
      {headerText !== '' ? <Modal.Header>{headerText}</Modal.Header> : null}
      <Modal.Content>
        {(() => {
          if (errors.length === 1) {
            return (
              <Message negative>
                <p>{errors[0]}</p>
              </Message>
            );
          }

          if (errors.length > 1) {
            return (
              <Message
                negative
                list={errors}
              />
            );
          }

          return <p>{text}</p>;
        })()}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>
          {buttonText}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

MessageModal.propTypes = {
  open: PropTypes.bool,
  size: PropTypes.string,
  canDismiss: PropTypes.bool,
  onClose: PropTypes.func,
  text: PropTypes.string,
  errors: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  headerText: PropTypes.string,
  buttonText: PropTypes.string,
};

MessageModal.defaultProps = {
  open: false,
  size: 'mini',
  canDismiss: true,
  onClose: () => {},
  buttonText: 'Ok',
  text: '',
  errors: [],
  headerText: '',
};

export default MessageModal;
