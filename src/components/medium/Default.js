import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import withStyles from '@material-ui/core/styles/withStyles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import MediumType from '../../proptypes/Medium';
import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import CardHeaderOwner from '../cards/Owner';
import Player from '../Player';
import EntityBody from '../EntityBody';
import contentfilter from '../contentfilter';

import {
  getAuthor,
  getPortraitURL,
  getCoverURL,
} from '../utils';

const styles = (theme) => {
  return {
    cover: {
      height: 0,
      paddingTop: '30%',
    },
    portrait: {
      height: 0,
      paddingTop: '100%',
    },
    title: {
      fontSize: 24,
      marginBottom: theme.spacing(2),
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 12,
    },
  };
};

const TABS = {
  COMMENTS: 'comments',
  LOCATIONS: 'locations',
};

const MediumDefault = (props) => {
  const {
    classes,
    medium,
    actions,
    menu,
    locations,
    comments,
  } = props;

  const [tab, setTab] = useState(TABS.COMMENTS);

  const changeTab = (event, value) => {
    setTab(value);
  };

  const portrait = getPortraitURL(medium, 'original');
  const cover = getCoverURL(medium);
  const author = getAuthor(medium);

  return (
    <Grid
      container
      justify="center"
      spacing={2}
    >
      <Grid item xs={12} md={8}>
        <Card>
          {medium.owner.objectType.split('.')[1] !== 'people' &&
            <CardHeaderOwner node={medium} />
          }
          {cover &&
            <CardMedia
              className={classes.cover}
              title={medium.name}
              image={cover}
              src="picture"
            />
          }
          {portrait &&
            <CardMedia
              className={classes.portrait}
              title={medium.name}
              image={portrait}
              src="picture"
            />
          }
          <CardHeader
            avatar={
              <ActorAvatar
                actor={author}
                linked={Boolean(author.id)}
              />
            }
            title={
              <ActorTitle
                actor={author}
                linked={Boolean(author.id)}
              />
            }
            subheader={
              <ReactTimeAgo
                date={new Date(medium.creationTime)}
              />
            }
            action={menu}
          />
          {medium.body &&
            <Player text={medium.body} />
          }
          <CardContent component="article">
            {medium.name &&
              <Typography
                variant="h2"
                className={classes.title}
              >
                {medium.name}
              </Typography>
            }
            {medium.body &&
              <EntityBody>
                {contentfilter({
                  text: medium.body,
                  filters: [
                    'hashtag',
                    'mention',
                    'url',
                  ],
                })}
              </EntityBody>
            }
            {actions &&
              <CardActions>
                {actions}
              </CardActions>
            }
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Tabs
          value={tab}
          onChange={changeTab}
          centered
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Comments" value={TABS.COMMENTS} />
          <Tab label="Locations" value={TABS.LOCATIONS} />
        </Tabs>
        {tab === TABS.COMMENTS && comments}
        {tab === TABS.LOCATIONS && locations}
      </Grid>
    </Grid>
  );
};

MediumDefault.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  locations: PropTypes.node,
  comments: PropTypes.node,
};

MediumDefault.defaultProps = {
  actions: null,
  menu: null,
  locations: null,
  comments: null,
};

export default withStyles(styles)(MediumDefault);