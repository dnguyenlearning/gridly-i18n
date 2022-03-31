const axios = require("axios");
const fs = require("fs");
const { API_URL, API_KEY, VIEW_ID, COLUMN_IDS } = require("./config");

let totalRecord = 0;
let OFFSET = 0;
const MAX_LIMIT = 1000;

async function downSync() {
  try {
    let records = [];

    do {
      const params = { limit: MAX_LIMIT, offset: OFFSET };
      const query = new URLSearchParams({
        page: JSON.stringify(params),
      }).toString();

      const res = await axios.get(
        `${API_URL}/views/${VIEW_ID}/records?${query}`,
        {
          headers: { Authorization: `ApiKey ${API_KEY}` },
        }
      );
      records.push(...res?.data);
      totalRecord = parseInt(res.headers["x-total-count"]);
      OFFSET = OFFSET + MAX_LIMIT;
    } while (OFFSET < totalRecord);

    Object.values(COLUMN_IDS).forEach((lang) => {
      const translationObject = {};
      records.forEach((record) => {
        const translationKey = record?.id;
        const cell = record?.cells?.find((cell) => cell?.columnId === lang);
        const translationValue = cell?.value;
        if (translationValue) {
          translationObject[translationKey] = translationValue;
        }
      });
      fs.writeFileSync(
        `src/i18next/${lang}.json`,
        JSON.stringify(translationObject)
      );
    });
  } catch (error) {
    console.log(error.message);
  }
}

downSync();
