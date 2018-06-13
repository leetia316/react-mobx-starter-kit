import 'babel-polyfill'
import 'core-js/modules/es7.promise.finally'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from '../app'
import HomePage from './topics-page'
import TopicPage from './topic-page'
import { mobileHack } from '@utils'

mobileHack()

Route.defaultProps = {
  exact: true
}

ReactDOM.render(
  <BrowserRouter>
    <App>
      <Switch>
        <Route path="/" component={HomePage}/>
        <Route path="/topics/:id" component={TopicPage}/>
      </Switch>
    </App>
  </BrowserRouter>,
  document.querySelector('#app'),
)
