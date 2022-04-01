# Getting Started Translation file with Gridly.

## Set up scripts config
* `Access "./scripts/config.js"` and replace your public api_key and view_id (you can grab it when access Grid on [https://app.gridly.com](https://app.gridly.com))

<pre><code>exports.API_KEY = "your_api_key"; // grab it on grid. in API section
exports.VIEW_ID = "your_view_id"; // grab it on grid. in API section
</code></pre>

* `Create your json files`

* `In config.js` please map like below: 

<pre><code>exports.COLUMN_IDS = {
  RAW_US: "raw_us",
  US: "us",
  VN: "vn",
};</code></pre>

**raw_us**: should be the same name with json file and columnId (on Gridly app).

## `Run node ./scripts/upSync.js`
This action will push your new strings in raw_us to the view. 

## `Run node ./scripts/downSync.js`
After Translator translate your raw_us strings to others language. you can sync all those translates to your json files by run this function. 


## `Hook those scripts to deploy site`
put
<code>"prebuild": "node ./scripts/upSync.js && node ./scripts/downSync.js"</code>
this into your `package.json` file

