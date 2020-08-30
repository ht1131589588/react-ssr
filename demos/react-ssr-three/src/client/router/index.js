import Layout from "../app/layout"
import React from 'react'
import { Route, Switch } from 'react-router-dom'

function Router({ routeList }) {
  return (
    <Layout>
      <Switch>
        {routeList.map(item => (
          <Route key={item.path} {...item} />
        ))}
      </Switch>
    </Layout>
  )
}

export default Router