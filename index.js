export default function reduxOrder() {
  return ({dispatch, getState}) => next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    const {types = [], promise} = action;
    const [REQUEST, SUCCESS, FAIL] = types;
    function orderAction(type, resultType, result) {
      const state = {type, [resultType]: result};
      Object.keys(action).forEach(item => {
        if (item === 'types' || item === 'promise' || item === 'type') return;
        state[item] = action[item];
      });
      return state;
    }
    if (!promise) {
      return next(action);
    }
    dispatch(orderAction(REQUEST));
    return action.promise.then(res => {
      if (!SUCCESS) return;
      return dispatch(orderAction(SUCCESS, 'res', res));
    }).catch((err) => {
      if (!FAIL) return;
      return dispatch(orderAction(FAIL, 'err', err));
    });
  };
}
