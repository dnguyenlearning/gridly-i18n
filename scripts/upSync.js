const axios = require("axios");
const fs = require("fs");
const {
  API_KEY,
  VIEW_ID,
  COLUMN_IDS,
  API_URL,
  MAX_LIMIT,
} = require("./config");

async function upSync() {
  try {
    let viewRecords = [];
    let totalRecords = 0;
    let offset = 0;

    do {
      const params = { limit: MAX_LIMIT, offset };
      const query = new URLSearchParams({
        page: JSON.stringify(params),
        columnIds: ["_recordId"],
      }).toString();

      const res = await axios.get(
        `${API_URL}/views/${VIEW_ID}/records?${query}`,
        {
          headers: { Authorization: `ApiKey ${API_KEY}` },
        }
      );

      viewRecords.push(...res?.data);
      totalRecords = +res?.headers["x-total-count"];
      offset = offset + MAX_LIMIT;
    } while (offset < totalRecords);

    const localJsonRecords = await fs.readFileSync(
      `src/i18next/${COLUMN_IDS.RAW_US}.json`
    );
    const localRecordsObj = JSON.parse(localJsonRecords);

    //get all local recordIds
    const localRecordIds = Object.keys(localRecordsObj);

    //pull recordIds from grid
    const viewRecordIds = viewRecords?.map((record) => record?.id);

    // check => is there any deleted strings.
    const newlyDeletedRecordIds = viewRecordIds.filter(
      (recordId) => !localRecordIds.includes(recordId) && recordId !== undefined
    );

    //get all added strings.
    const newlyUpdatedRecordIds = [
      ...new Set(
        localRecordIds.filter(
          (recordId) => !newlyDeletedRecordIds.includes(recordId)
        )
      ),
    ];

    // delete all deleted strings to grid
    if (newlyDeletedRecordIds.length > 0) {
      const deleteRecordsBody = {
        ids: newlyDeletedRecordIds,
      };
      await axios.delete(`${API_URL}/views/${VIEW_ID}/records`, {
        data: deleteRecordsBody,
        headers: { Authorization: `ApiKey ${API_KEY}` },
      });
    }

    //push new added strings to grid
    if (newlyUpdatedRecordIds.length > 0) {
      const chunk = 1000;

      for (let i = 0, j = newlyUpdatedRecordIds.length; i < j; i += chunk) {
        const recordIdsByChunk = newlyUpdatedRecordIds.slice(i, i + chunk);
        const addRecordsBody = recordIdsByChunk.map((recordId) => {
          return {
            id: recordId,
            cells: [
              {
                columnId: COLUMN_IDS.RAW_US,
                value: localRecordsObj?.[recordId],
              },
            ],
          };
        });

        await axios.post(
          `${API_URL}/views/${VIEW_ID}/records`,
          addRecordsBody,
          {
            headers: { Authorization: `ApiKey ${API_KEY}` },
          }
        );
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

upSync();
