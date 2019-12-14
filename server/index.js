import { renderToString } from 'react-dom/server'
import express from 'express'
import proxy from 'http-proxy-middleware'
import React from 'react'
import { Provider } from 'react-redux'
import chalk from 'chalk'
import axios from '../src/utils/axios'
import { StaticRouter, Route, matchPath } from 'react-router-dom'
import routes from '../src/App'
import Header from '../src/components/Header'
import { getServerStore } from '../src/store'

const app = express()
const store = getServerStore()

app.use(express.static('public'))

app.use('/api', proxy({ target: 'http://localhost:9090/', changeOrigin: true }))

app.get('*', (req, res) => {
  // 获取匹配路由中需要初始化请求数据的方法
  const promises = []
  routes.some((route) => {
    const loadData = route.component.loadData
    if (matchPath(req.path, route) && typeof loadData === 'function') {
      // promises.push(loadData(store))
      // 处理异步任务报错，页面不会渲染
      promises.push(
        new Promise((resolve) => {
          loadData({ ...store, axios })
            .then(resolve)
            .catch((err) => {
              console.error(chalk.redBright(err))
              resolve(err)
            })
        })
      )
    }
  })

  Promise.all(promises).then((data) => {
    const content = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url}>
          <Header />
          {routes.map((route) => (
            <Route {...route} />
          ))}
        </StaticRouter>
      </Provider>
    )
    // 向window.__context注入服务端store的内容
    const initialState = `
      <script>
        window.__context = ${JSON.stringify(store.getState())}
      </script>
    `
    res.send(`
      <!doctype html>
      <html>
        <head>
          <title>react ssr</title>
          <meta charset="utf-8" />
          ${initialState}
        </head>
        <body>
          <div id="root">${content}</div>
          <script src="bundle.js"></script>
        </body>
      </html>
    `)
  })
})

app.listen(8091, () => {
  console.log('监听完毕')
})
