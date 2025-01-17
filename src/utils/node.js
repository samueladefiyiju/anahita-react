import { pluralize } from 'inflection';
import countryList from 'country-list';
import i18n from '../languages';
import { Person as PERSON } from '../constants';

const {
  REGISTERED,
  ADMIN,
  SUPER_ADMIN,
} = PERSON.FIELDS.TYPE;

const OWNER_NAME_CHAR_LIMIT = 16;

const OBJECT_TYPES = {
  ACTOR: [
    'com.actors.actor',
    'com.groups.group',
    'com.people.person',
  ],
  MEDIUM: [
    'com.articles.article',
    'com.documents.document',
    'com.notes.note',
    'com.topics.topic',
    'com.photos.photo',
    'com.photos.set',
    'com.todos.todo',
  ],
};

const MEDIUM_WITH_HTML_BODY = [
  'com.articles.article',
  'com.topics.topic',
];

const isActor = (node) => {
  return node.objectType ? OBJECT_TYPES.ACTOR.includes(node.objectType) : false;
};

const isPerson = (node) => {
  return node.objectType ? node.objectType.split('.')[1] === 'people' : false;
};

const isAdmin = (actor) => {
  return [SUPER_ADMIN, ADMIN].includes(actor.usertype);
};

const isRegistered = (actor) => {
  return [SUPER_ADMIN, ADMIN, REGISTERED].includes(actor.usertype);
};

const isMedium = (node) => {
  return node.objectType ? OBJECT_TYPES.MEDIUM.includes(node.objectType) : false;
};

const isComment = (node) => {
  return node.objectType.split('.')[2] === 'comment';
};

const isCommentable = (medium) => {
  return OBJECT_TYPES.MEDIUM.includes(medium.objectType);
};

const isLikeable = (medium) => {
  return OBJECT_TYPES.MEDIUM.includes(medium.objectType);
};

const isSubscribable = (medium) => {
  return OBJECT_TYPES.MEDIUM.includes(medium.objectType);
};

const isFollowable = (actor) => {
  return isActor(actor);
};

const isLeadable = (actor) => {
  return isPerson(actor);
};

const isBodyHtml = (medium) => {
  return MEDIUM_WITH_HTML_BODY.includes(medium.objectType);
};

const getActorInitials = (actor) => {
  if (actor.givenName && actor.familyName) {
    return `${actor.givenName.charAt(0).toUpperCase()}${actor.familyName.charAt(0).toUpperCase()}`;
  }

  return actor.name.charAt(0).toUpperCase();
};

const getPersonInitials = (person) => {
  const givenName = person.givenName.charAt(0);
  const familyName = person.familyName.charAt(0);
  return `${givenName}${familyName}`;
};

const getPersonName = (person) => {
  return `${person.givenName} ${person.familyName}`;
};

const getAddress = (node) => {
  const fields = [];

  if (node.address) {
    fields.push(node.address);
  }

  if (node.city) {
    fields.push(node.city);
  }

  if (node.state_province) {
    fields.push(node.state_province);
  }

  if (node.country) {
    fields.push(countryList.getName(node.country));
  }

  return fields.join(', ');
};

const getAuthor = (node) => {
  return node.author || {
    id: null,
    name: i18n.t('actor:unknown'),
    givenName: '?',
    familyName: '?',
    objectType: OBJECT_TYPES.ACTOR.PERSON,
    imageURL: {},
  };
};

const getCommentURL = (comment) => {
  const { id, parentId, objectType } = comment;
  const namespace = objectType.split('.')[1];

  return `/${namespace}/${parentId}/#${id}`;
};

const getCoverURL = (node, size = 'medium') => {
  const path = node.coverURL && node.coverURL[size] && node.coverURL[size].url;

  if (path) {
    return path.substring(0, 4) === 'http' ? path : new URL(path, process.env.REACT_APP_API_BASE_URL).href;
  }

  return '';
};

const getOwnerName = (node) => {
  const { owner: { name } } = node;
  if (name.length > OWNER_NAME_CHAR_LIMIT) {
    return `${name.substring(0, OWNER_NAME_CHAR_LIMIT)}...`;
  }
  return name;
};

const getPortraitURL = (node, size = 'medium') => {
  const path = node.imageURL && node.imageURL[size] && node.imageURL[size].url;

  if (path) {
    return path.substring(0, 4) === 'http' ? path : new URL(path, process.env.REACT_APP_API_BASE_URL).href;
  }

  return '';
};

/*
* @TODO add support for array of objects
*/
const getStoryObjectName = (story) => {
  return story.object && story.object.name;
};

const getStorySubject = (story) => {
  return story.subject || {
    id: null,
    name: i18n.t('actor:unknown'),
    givenName: '?',
    familyName: '?',
    objectType: OBJECT_TYPES.ACTOR.PERSON,
    imageURL: {},
  };
};

const getURL = (node) => {
  if (node.id && node.objectType) {
    const namespace = pluralize(node.objectType.split('.')[2]);
    let identifier = '';

    if (namespace === 'people') {
      identifier = node.alias;
    } else if (node.alias) {
      identifier = `${node.id}-${node.alias}`;
    } else {
      identifier = node.id;
    }

    return `/${namespace}/${identifier}/`;
  }

  return '/';
};

const getNamespace = (node) => {
  return pluralize(node.objectType.split('.')[2]);
};

export default {
  isActor,
  isPerson,
  isAdmin,
  isRegistered,
  isMedium,
  isComment,
  isCommentable,
  isLikeable,
  isSubscribable,
  isFollowable,
  isLeadable,
  isBodyHtml,
  getNamespace,
  getPersonInitials,
  getPersonName,
  getActorInitials,
  getAddress,
  getAuthor,
  getCommentURL,
  getCoverURL,
  getOwnerName,
  getPortraitURL,
  getStoryObjectName,
  getStorySubject,
  getURL,
};
