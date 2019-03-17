import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from '../../../actions/actor';
import { Person as PERSON } from '../../../constants';
import CoverForm from '../../../components/actor/CoverForm';

import ActorType from '../../../proptypes/Actor';
import PersonType from '../../../proptypes/Person';

class ActorsCover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      coverLoaded: false,
    };

    this.cover = new Image();
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.loadCover(this.props.actor);
  }

  componentWillReceiveProps(nextProps) {
    this.loadCover(nextProps.actor);
  }

  componentWillUnmount() {
    this.cover.onload = null;
    this.cover.onerror = null;
  }

  loadCover(actor) {
    this.cover.onload = () => {
      this.setState({
        coverLoaded: true,
      });
    };
    this.cover.onError = () => {
      this.setState({
        coverLoaded: false,
      });
    };

    this.cover.src = actor.coverURL &&
    actor.coverURL.large &&
    actor.coverURL.large.url;
  }

  addCover() {
    const { actor, addCover } = this.props;
    addCover(actor, this.file);
  }

  deleteCover() {
    const { actor, deleteCover } = this.props;
    deleteCover(actor);
  }

  handleFieldChange(event) {
    const file = event.target.files[0];
    this.file = file;
    this.addCover();
    this.setState({
      anchorEl: null,
    });
  }

  handleDelete() {
    this.deleteCover();
    this.setState({
      anchorEl: null,
    });
  }

  handleOpen(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  handleClose() {
    this.setState({
      anchorEl: null,
    });
  }

  canEdit() {
    const { viewer, actor } = this.props;

    if (viewer.id === actor.id) {
      return true;
    }

    if (actor.administratorIds) {
      if (actor.administratorIds.indexOf(String(viewer.id)) > -1) {
        return true;
      }
    }

    if ([
      PERSON.TYPE.ADMIN,
      PERSON.TYPE.SUPER_ADMIN,
    ].includes(viewer.usertype)) {
      return true;
    }

    return false;
  }

  hasCover() {
    const { actor } = this.props;
    return Boolean(actor.coverURL && actor.coverURL.large);
  }

  isWaiting() {
    return (this.hasCover() && !this.state.coverLoaded) || this.props.isFetching;
  }

  render() {
    const {
      isFetching,
      actor,
    } = this.props;

    const { anchorEl, coverLoaded } = this.state;
    const canEdit = this.canEdit();
    const hasCover = this.hasCover();
    const isWaiting = this.isWaiting();

    return (
      <CoverForm
        isFetching={isFetching}
        name={actor.name}
        cover={this.cover}
        anchorEl={anchorEl}
        canEdit={canEdit}
        hasCover={hasCover}
        isWaiting={isWaiting}
        isCoverLoaded={coverLoaded}
        handleOpen={this.handleOpen}
        handleClose={this.handleClose}
        handleFieldChange={this.handleFieldChange}
        handleDelete={this.handleDelete}
      />
    );
  }
}

ActorsCover.propTypes = {
  addCover: PropTypes.func.isRequired,
  deleteCover: PropTypes.func.isRequired,
  actor: ActorType.isRequired,
  viewer: PersonType.isRequired,
  isFetching: PropTypes.bool,
};

ActorsCover.defaultProps = {
  isFetching: false,
};

const mapStateToProps = (state) => {
  const {
    viewer,
  } = state.auth;

  return {
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCover: (actor, file) => {
      dispatch(actions.addCover(actor, file));
    },
    deleteCover: (actor) => {
      dispatch(actions.deleteCover(actor));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsCover);