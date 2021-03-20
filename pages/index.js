// import Link from 'next/link'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux';
import RushRecordsContainer from '../components/containers/RushRecordsContainer';
import rootReducer from '../client/reducers'
import React from 'react';


const preloadedState = {}
const store = createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(thunk)
)

export default function Home() {
  return (
    <Provider store={store}>
      <div className="background">
        <RushRecordsContainer />
        {/*<Link href="/test">
          <a> test </a>
        </Link>*/}
      </div>
    </Provider>
  )
}
