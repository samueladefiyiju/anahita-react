import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import FollowAction from '../actions/FollowAction';

import {
  browseActors,
  resetActors,
} from '../../actions/actors';

import ActorCard from '../../components/cards/ActorCard';

const styles = theme => ({
  root: {
    width: '100%',
  },
  title: {
    textTransform: 'capitalize',
  },
  progress: {
    marginLeft: '48%',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class ActorsPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      disabledFilter: false,
      keywordFilter: '',
    };

    this.fetchActors = this.fetchActors.bind(this);
  }

  componentWillUnmount() {
    this.props.resetActors();
  }

  canFollow(actor) {
    const { viewer, isAuthenticated } = this.props;
    return isAuthenticated && (viewer.id !== actor.id) && !actor.isBlocked;
  }

  fetchActors() {
    const { disabledFilter, keywordFilter } = this.state;
    const {
      offset,
      limit,
      queryFilters,
      namespace,
    } = this.props;

    this.props.browseActors({
      q: keywordFilter,
      disabled: disabledFilter,
      start: offset,
      limit,
      ...queryFilters,
    }, namespace);
  }

  hasMore() {
    const {
      offset,
      total,
      actors,
    } = this.props;

    return offset === 0 || (Object.keys(actors).length < total);
  }

  render() {
    const {
      classes,
      actors,
      namespace,
    } = this.props;

    const hasMore = this.hasMore();

    return (
      <div className={classes.root}>
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.title}>
            {namespace}
          </Typography>
        </Toolbar>
        <InfiniteScroll
          loadMore={this.fetchActors}
          hasMore={hasMore}
          loader={<CircularProgress key={0} className={classes.progress} />}
        >
          <StackGrid
            columnWidth={320}
            gutterWidth={20}
            gutterHeight={20}
          >
            {actors.map((actor) => {
              const key = `actor_${actor.id}`;
              const avatarSrc = actor.imageURL.medium && actor.imageURL.medium.url;
              const coverSrc = actor.coverURL.medium && actor.coverURL.medium.url;
              const canFollow = this.canFollow(actor);
              return (
                <ActorCard
                  key={key}
                  name={actor.name}
                  alias={actor.alias}
                  description={actor.body}
                  avatar={avatarSrc}
                  cover={coverSrc}
                  profile={`/${namespace}/${actor.id}/`}
                  action={canFollow &&
                    <FollowAction actor={actor} />
                  }
                />
              );
            })
            }
          </StackGrid>
        </InfiniteScroll>
      </div>
    );
  }
}

ActorsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  browseActors: PropTypes.func.isRequired,
  resetActors: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  actors: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired,
  offset: PropTypes.number,
  limit: PropTypes.number,
  total: PropTypes.number,
  viewer: PropTypes.object.isRequired,
  queryFilters: PropTypes.object,
};

ActorsPage.defaultProps = {
  queryFilters: {},
  total: 0,
  limit: 20,
  offset: 0,
};

const mapStateToProps = (state) => {
  const {
    actors,
    errorMessage,
    offset,
    limit,
    total,
  } = state.actorsReducer;

  const {
    isAuthenticated,
    viewer,
  } = state.authReducer;

  return {
    actors,
    errorMessage,
    offset,
    limit,
    total,
    isAuthenticated,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseActors: (params, namespace) => {
      dispatch(browseActors(params, namespace));
    },
    resetActors: () => {
      dispatch(resetActors());
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActorsPage));