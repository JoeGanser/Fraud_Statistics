import {
  SUMMARIZED_FAILED,
  SUMMARIZED_FETCHING,
  SUMMARIZED_RECEIVED,
} from '../actions/constants'

const initialState = {
  data: {},
  error: null,
  loading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SUMMARIZED_FAILED:
      return {
        ...state,
        error: {
          code: action.error.response.status,
          message: action.error.message,
          url: action.error.config.url,
        },
        loading: false,
      }
    case SUMMARIZED_FETCHING:
      return {
        ...state,
        error: null,
        loading: true,
      }
    case SUMMARIZED_RECEIVED:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.summarized,
        },
        loading: false,
      }
    default:
      return state
  }
}
