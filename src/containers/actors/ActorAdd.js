import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ActorInfoForm from '../../components/ActorInfoForm';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import actions from '../../actions/actor';

import ActorType from '../../proptypes/Actor';

const BODY_CHARACTER_LIMIT = 350;

class ActorAddPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actor: {},
      nameError: false,
      nameHelperText: '',
      bodyError: false,
      bodyHelperText: '',
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      actor: { ...nextProps.actor },
    });
  }

  handleFieldChange(event) {
    const { actor } = this.state;
    const { name, value } = event.target;

    this.validateField(name, value.trim());
    actor[name] = value;

    this.setState({ actor });
  }

  validateField(name, value) {
    const fieldError = {
      error: false,
      helperText: '',
    };

    switch (name) {
      case 'name':
        if (value.length < 6) {
          fieldError.error = true;
          fieldError.helperText = 'At least 6 characters are required!';
        }
        break;
      case 'body':
        if (value.length > BODY_CHARACTER_LIMIT) {
          fieldError.error = true;
          fieldError.helperText = `You have exceeded the ${BODY_CHARACTER_LIMIT} character limit!`;
        }
        break;
      default:
        if (value === '') {
          fieldError.error = true;
          fieldError.helperText = 'This field is required!';
        }
    }

    this.setState({
      [`${name}Error`]: fieldError.error,
      [`${name}HelperText`]: fieldError.helperText,
    });

    return !fieldError.error;
  }

  validate() {
    const { name, body } = this.state.actor;
    const nameValidated = this.validateField('name', name);
    const bodyValidated = this.validateField('body', body);

    return nameValidated && bodyValidated;
  }

  saveActor() {
    const { actor } = this.state;
    const { namespace, addActor } = this.props;

    addActor(actor, namespace);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    if (this.validate()) {
      this.saveActor();
    }
  }

  render() {
    const {
      namespace,
      success,
      error,
      isFetching,
    } = this.props;

    const {
      actor,
      nameError,
      nameHelperText,
      bodyError,
      bodyHelperText,
    } = this.state;

    return (
      <React.Fragment>
        <Card>
          <CardHeader
            title={actor.name}
            avatar={
              <Avatar
                aria-label={actor.name || ''}
                alt={actor.name || ''}
              >
                {actor.name ? actor.name.charAt(0).toUpperCase() : <GroupAddIcon />}
              </Avatar>
            }
          />
          <ActorInfoForm
            formTitle={`Add new ${singularize(namespace)}`}
            name={actor.name}
            nameError={nameError}
            nameHelperText={nameHelperText}
            body={actor.body}
            bodyError={bodyError}
            bodyHelperText={bodyHelperText}
            handleFieldChange={this.handleFieldChange}
            handleFormSubmit={this.handleFormSubmit}
            isFetching={isFetching}
            dismissPath={`/${namespace}/`}
          />
        </Card>
        {error &&
          <SimpleSnackbar
            isOpen={Boolean(error)}
            message="Something went wrong!"
            type="error"
          />
        }
        {success && actor.id &&
          <Redirect to={`/${namespace}/${actor.id}/`} />
        }
      </React.Fragment>
    );
  }
}

ActorAddPage.propTypes = {
  addActor: PropTypes.func.isRequired,
  actor: ActorType,
  namespace: PropTypes.string.isRequired,
  success: PropTypes.bool,
  error: PropTypes.string,
  isFetching: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const {
    actor,
    success,
    error,
    isFetching,
  } = state.actor;

  return {
    actor,
    success,
    error,
    isFetching,
  };
};

ActorAddPage.defaultProps = {
  actor: {
    id: null,
    name: '',
    body: '',
  },
  isFetching: false,
  success: false,
  error: '',
};

const mapDispatchToProps = (dispatch) => {
  return {
    addActor: (actor, namespace) => {
      dispatch(actions.add(actor, namespace));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorAddPage);