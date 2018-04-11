function reduxOrder() {
  return function(reduxAction) {
    return function(next) {
      return function(action) {
        var dispatch = reduxAction.dispatch;
        var getState = reduxAction.getState;
        if (typeof action === 'function') {
          return action(dispatch, getState);
        }
        var types = (action || {}).types || [];
        var promise = (action || {}).promise || null;
        var REQUEST = types[0];
        var SUCCESS = types[1];
        var FAIL = types[2];
        function orderAction(type, resultType, result) {
          var state = {type: type};
          state[resultType] = result;
          for (var item in action) {
            if (item === 'types' || item === 'promise' || item === 'type') break;
            state[item] = action[item];
          };
          return state;
        };
        if (!promise) {
          return next(action);
        }
        dispatch(orderAction(REQUEST));
        return action.promise.then(function(res) {
          if (!SUCCESS) return;
          return dispatch(orderAction(SUCCESS, 'res', res));
        }).catch(function(err) {
          if (!FAIL) return;
          return dispatch(orderAction(FAIL, 'err', err));
        });
      };
    };
  };
};
export default reduxOrder;
