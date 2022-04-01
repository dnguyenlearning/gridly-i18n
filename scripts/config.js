exports.API_URL = "https://api.gridly.com/v1";
exports.API_KEY =
  process.env.TRANSLATION_API_KEY ||
  "QUFBQUFBQUFBSU09ISYjfjo7JycrQUFBQmRJL1BMK2s9"; // grab it on grid. in API section
exports.VIEW_ID = process.env.TRANSLATION_VIEW_ID || "3jev3400yv82x5q"; // grab it on grid. in API section

//name your grid columns to this mapping.
exports.COLUMN_IDS = {
  RAW_US: "raw_us",
  US: "us",
  VN: "vn",
};

exports.MAX_LIMIT = 1000; // all records api have limit 1000.
exports.MAX_LIMIT = 1000;
