import React from 'react'
import { IndexRoute, Route, Router } from 'react-router'

import About from './pages/About'
import App from './App'
import DownloadsAndDocs from './pages/DownloadsAndDocs'
import Explorer from './pages/Explorer'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import history from './util/history'

const scrollToTop = () => window.scroll(0, 0)

const routes = (
  <Router history={history} onUpdate={scrollToTop}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/downloads-and-docs" component={DownloadsAndDocs} />
      <Route path="/explorer/:pageType" component={Explorer} />
      <Route path="/explorer/:placeType/:place/:pageType" component={Explorer} />
      <Route path="/about" component={About} />
      <Route path="/*" component={NotFound} />
    </Route>
  </Router>
)

export default routes
