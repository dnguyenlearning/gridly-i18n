const axios = require("axios");
const fs = require("fs");
const {
  API_URL,
  API_KEY,
  VIEW_ID,
  COLUMN_IDS,
  MAX_LIMIT,
} = require("./config");

/**
 * Explain: Some people can add more placeholder in grid. So this action will sync records into *.json files.
 */
async function downSync() {
  try {
    let records = [];
    let totalRecord = 0;
    let offset = 0;

    do {
      const params = { limit: MAX_LIMIT, offset };
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
      offset = offset + MAX_LIMIT;
    } while (offset < totalRecord);

    const columnIds = Object.values(COLUMN_IDS);
    for await (const columnId of columnIds) {
      const translationObject = {};
      records.forEach((record) => {
        const translationKey = record?.id;
        const cell = record?.cells?.find((cell) => cell?.columnId === columnId);
        const translationValue = cell?.value;
        if (translationValue) {
          translationObject[translationKey] = translationValue;
        }
      });
      await fs.writeFileSync(
        `src/i18next/${columnId}.json`,
        JSON.stringify(translationObject)
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}

downSync();
