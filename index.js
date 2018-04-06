export default function reduxOrder() {
  return ({dispatch, getState}) => next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    const {types, promise, ...rest} = action;
    if (!promise) {
      return next(action);
    }
    const [REQUEST, SUCCESS, FAIL] = types;
    dispatch({type: REQUEST, ...rest});
    return action.promise.then(res => {
      return dispatch({type: SUCCESS, res, ...rest});
    }).catch((err) => {
      return dispatch({type: FAIL, err, ...rest});
    });
  };
}
