# redux-order


>redux-order是处理redux的中间件，简化redux的异步流控制处理。





### 安装



```
npm install redux-order
```

引入redux-order

```javascript
import {createStore, applyMiddleware, compose} from 'redux';
import reduxOrder from 'redux-order';
import reducers from './reduces';

const enhancer = compose(
  //引入中间件
  applyMiddleware(reduxOrder())
);

const store = createStore(
  reducers,
  enhancer
);

export default store;

```

reduces中处理异步

```javascript
// action
const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';

const initialState = {};
// reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN:
      console.log(action);
      return {
        ...state,
        requesting: true,
        requested: false,
    };
    case LOGIN_SUCCESS:
      console.log(action);
      return {
        ...state,
        requesting: false,
        requested: true,
        auth: action.res
    };
    case LOGIN_FAIL:
      console.log(action);
      return {
        ...state,
        requesting: false,
        requested: true,
        loginError: action.err
    };
    default:
      return state;
  }
}
// 触发 action
export function login(user, pass) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: axios.post('/api/login', {user, pass}),
    data: 'message',
    list: [1, 2, 3, 4]
  };
}
```


#### 异步action

 - 在上面的例子里，我们创建了`异步`的redux请求。例子中定义了`LOGIN`、`LOGIN_SUCCESS`、`LOGIN_FAIL`三个action，依次代表请求发出、请求成功、请求失败。在发出一个异步`promise`请求后，首先触发了`LOGIN`,假如请求成功则进入`LOGIN_SUCCESS`，否则就进入`LOGIN_FAIL`。
 - 异步动作需要定义`types`，types为数组并且至少需要两个action（发出请求和结果），`promise`参数为异步请求，异步请求必须为promise对象。
 - 请求的结果在reducer中的action对象中获得，如果是成功的返回结果为`action.req`，失败的则是`action.err`。
 - 在发出action时，还可以携带payload。可以自定义需要携带的参数，在reducer中即可访问action携带的参数。

#### 同步action
```javascript
export function logout() {
  return {
    type: LOGOUT
  };
}
```
上面为触发一个同步的action，`type` 参数定义要触发的动作，同样也可以携带payload。注意⚠️异步的action参数为`types`，而同步的为`type`。
