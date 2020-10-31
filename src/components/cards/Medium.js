import React from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import MediumType from '../../proptypes/Medium';
import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import CardHeaderOwner from './Owner';
import Player from '../Player';
import ReadMore from '../ReadMore';
import contentfilter from '../contentfilter';

import {
  getAuthor,
  getURL,
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

const MediumCard = (props) => {
  const {
    classes,
    medium,
    stats,
    actions,
    menu,
    handleView,
    history,
  } = props;

  const portrait = getPortraitURL(medium);
  const cover = getCoverURL(medium);
  const url = getURL(medium);
  const author = getAuthor(medium);

  return (
    <Card component="article">
      {medium.author && medium.owner.id !== medium.author.id &&
        <CardHeaderOwner node={medium} />
      }
      {cover &&
        <Link href={url}>
          <CardMedia
            className={classes.cover}
            image={cover}
            title={medium.name}
            src="picture"
          />
        </Link>
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
          <Link href={url}>
            <ReactTimeAgo
              date={new Date(medium.creationTime)}
            />
          </Link>
        }
        action={menu}
      />
      {portrait &&
        <ButtonBase
          style={{
            width: '100%',
            display: 'inline',
          }}
          onClick={(e) => {
            if (handleView) {
              return handleView(e, medium);
            }

            return history.push(url);
          }}
        >
          <CardMedia
            className={classes.portrait}
            title={medium.name}
            image={portrait}
            src="picture"
          />
        </ButtonBase>
      }
      {medium.body &&
        <Player text={medium.body} />
      }
      <CardContent component="article">
        {medium.name &&
          <Typography
            variant="h2"
            className={classes.title}
          >
            <Link href={url}>
              {medium.name}
            </Link>
          </Typography>
        }
        {medium.body &&
          <ReadMore>
            {contentfilter({
              text: medium.body,
              filters: [
                'hashtag',
                'mention',
                'url',
              ],
            })}
          </ReadMore>
        }
      </CardContent>
      {actions &&
        <CardActions>
          {actions}
        </CardActions>
      }
      {stats &&
        <CardActions>
          {stats}
        </CardActions>
      }
    </Card>
  );
};

MediumCard.propTypes = {
  classes: PropTypes.object.isRequired,
  stats: PropTypes.node,
  actions: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  handleView: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

MediumCard.defaultProps = {
  actions: null,
  menu: null,
  stats: null,
  handleView: null,
};

export default withRouter(withStyles(styles)(MediumCard));
