import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import InfiniteScroll from 'react-infinite-scroller';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Progress from '../../components/Progress';

import appActions from '../../actions/app';
import { hashtags as actions } from '../../actions';
import i18n from '../../languages';
import { App as APP } from '../../constants';

const {
  LIMIT,
  SORTING: {
    TRENDING,
    TOP,
    RECENT,
  },
} = APP.BROWSE;
const TABS = [TRENDING, TOP, RECENT];

const styles = {
  appBar: {
    marginBottom: 8 * 2,
    position: 'sticky',
    top: 8 * 7,
    zIndex: 8,
  },
};

class HashtagsBrowse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hashtags: {
        byId: {},
        allIds: [],
      },
      sort: 'trending',
      error: '',
      hasMore: true,
      selectedTab: 0,
    };

    this.offset = 0;
    this.fetchList = this.fetchList.bind(this);
    this.changeTab = this.changeTab.bind(this);

    const { setAppTitle } = props;
    setAppTitle(i18n.t('hashtags:cTitle'));
  }

  static getDerivedStateFromProps(nextProps) {
    const {
      hashtags,
      error,
      hasMore,
    } = nextProps;

    return {
      hashtags,
      error,
      hasMore,
    };
  }

  componentWillUnmount() {
    const { resetHashtags } = this.props;
    resetHashtags();
  }

  fetchList() {
    const { sort } = this.state;
    const { browseHashtags } = this.props;

    browseHashtags({
      sort,
      start: this.offset,
      limit: LIMIT,
    }).then(() => {
      this.offset += LIMIT;
    });
  }

  changeTab(event, value) {
    const { resetHashtags } = this.props;

    this.offset = 0;
    resetHashtags();

    this.setState({
      selectedTab: value,
      sort: TABS[value],
    });
  }

  render() {
    const {
      hashtags,
      error,
      hasMore,
      selectedTab,
    } = this.state;

    if (error) {
      return (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      );
    }

    return (
      <React.Fragment>
        <AppBar
          position="sticky"
          color="inherit"
          style={styles.appBar}
          elevation={1}
        >
          <Tabs
            value={selectedTab}
            onChange={this.changeTab}
            centered
            variant="fullWidth"
          >
            <Tab label="Trending" />
            <Tab label="Top" />
            <Tab label="Recent" />
          </Tabs>
        </AppBar>
        <List>
          <InfiniteScroll
            loadMore={this.fetchList}
            hasMore={hasMore}
            useWindow
            loader={
              <Progress key="hashtags-progress" />
            }
          >
            {hashtags.allIds.map((hashtagId) => {
              const hashtag = hashtags.byId[hashtagId];
              return (
                <React.Fragment key={`hashtag_list_item_container_${hashtag.id}`}>
                  <ListItem
                    key={`hashtag_list_item_${hashtag.id}`}
                    href={`/hashtags/${hashtag.alias}/`}
                    button
                    component="a"
                  >
                    <ListItemAvatar>
                      <Avatar>
                        #
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={hashtag.name} />
                  </ListItem>
                  <Divider
                    component="li"
                    light
                    key={`hashtag_list_divider_${hashtag.id}`}
                  />
                </React.Fragment>
              );
            })}
          </InfiniteScroll>
        </List>
      </React.Fragment>
    );
  }
}

HashtagsBrowse.propTypes = {
  setAppTitle: PropTypes.func.isRequired,
  browseHashtags: PropTypes.func.isRequired,
  resetHashtags: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    hashtags,
    error,
    isFetching,
    hasMore,
  } = state.hashtags;

  return {
    hashtags,
    error,
    isFetching,
    hasMore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseHashtags: (params) => {
      return dispatch(actions.browse(params));
    },
    resetHashtags: () => {
      return dispatch(actions.reset());
    },
    setAppTitle: (title) => {
      dispatch(appActions.setAppTitle(title));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HashtagsBrowse);
