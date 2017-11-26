import {
  RECEIVE_SECRETS,
  SAVE_SECRET,
  UPDATE_SECRET,
  DELETE_SECRET
} from './constants'

const secrets = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_SECRETS:
      return action.secrets

    case SAVE_SECRET:
      return state.concat(action.secret)

    case UPDATE_SECRET:
      return state.map(secret => {
        return secret.uuid == action.secret.uuid ? action.secret : secret
      })

    case DELETE_SECRET:
      return state.filter(secret => {
        return secret.uuid != action.secret.uuid
      })

    default:
      return state
  }
};

export default secrets
