import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../../actions';
import form from '../../../utils/form';

import NoteForm from '../../../components/composers/Note';
import AcctorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';
import MediumDefault from '../../../proptypes/MediumDefault';

const formFields = form.createFormFields([
  'body',
]);

const MediaComposerNotes = (props) => {
  const {
    owner,
    viewer,
    addItem,
    success,
    error,
    isFetching,
  } = props;

  const [fields, setFields] = useState(formFields);
  const [medium, setMedium] = useState({
    ...MediumDefault,
    is_private: 0,
  });

  const handleOnChange = (event) => {
    const { target } = event;
    const {
      name,
      value,
      type,
      checked,
    } = target;

    if (type === 'checkbox') {
      medium[name] = checked;
    } else {
      medium[name] = value;
    }

    const newFields = form.validateField(target, fields);

    setMedium({ ...medium });
    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const formData = form.fieldsToData(newFields);
      addItem({
        composed: 1,
        ...formData,
      }, owner).then(() => {
        setMedium({
          ...medium,
          body: '',
          is_private: false,
        });
        setFields({ ...formFields });
      });
    }
  };

  return (
    <NoteForm
      owner={owner}
      viewer={viewer}
      medium={medium}
      fields={fields}
      handleOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      isFetching={isFetching}
    />
  );
};

MediaComposerNotes.propTypes = {
  addItem: PropTypes.func.isRequired,
  owner: AcctorType.isRequired,
  viewer: PersonType.isRequired,
  success: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    success,
    error,
    isFetching,
  } = state.notes;

  const { viewer } = state.session;

  return {
    viewer,
    error,
    success,
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (note, owner) => {
      return dispatch(actions.notes.add(note, owner));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MediaComposerNotes);
