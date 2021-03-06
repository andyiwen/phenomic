import test from "ava"
import webpack from "webpack"
import { sync as rimraf } from "rimraf"

import PhenomicLoaderWebpackPlugin from "../../loader/plugin.js"
import PhenomicLoaderFeedWebpackPlugin from "../index.js"

const outputPath = __dirname + "/_output/"
rimraf(outputPath)

test.cb("loader feed webpack plugin", (t) => {
  webpack(
    {
      module: {
        loaders: [
          {
            test: /\.md$/,
            loader: __dirname + "/../../loader/index.js",
            exclude: /node_modules/,
          },
        ],
      },
      entry: __dirname + "/fixtures/script.js",
      resolve: { extensions: [ "" ] },
      output: {
        path: outputPath + "/routes",
        filename: "routes.js",
      },
      plugins: [
        new PhenomicLoaderWebpackPlugin(),
        new PhenomicLoaderFeedWebpackPlugin({
          feedsOptions: {
            title: "title",
            site_url: "site_url",
          },
          feeds: {
            "feed.xml": {},
          },
        }),
      ],
    },
    function(err, stats) {
      if (err) {
        throw err
      }

      t.falsy(stats.hasErrors(), "doesn't give any error")
      if (stats.hasErrors()) {
        console.error(stats.compilation.errors)
      }

      t.falsy(stats.hasWarnings(), "doesn't give any warning")
      if (stats.hasWarnings()) {
        console.log(stats.compilation.warnings)
      }

      const feed = stats.compilation.assets["feed.xml"]
      if (!feed) {
        console.log(stats.compilation.assets)
      }
      t.truthy(
        feed && feed._value,
        "should create a xml for the feed"
      )

      t.end()
    }
  )
})
