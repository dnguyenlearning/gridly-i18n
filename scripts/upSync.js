const axios = require("axios");
const fs = require("fs");
const { API_KEY, VIEW_ID, COLUMN_IDS, API_URL } = require("./config");

let TOTAL_RECORD = 0;
let OFFSET = 0;
const MAX_LIMIT = 1000;

async function upSync() {
  try {
    let gridRecords = [];

    do {
      const params = { limit: MAX_LIMIT, offset: OFFSET };
      const query = new URLSearchParams({
        page: JSON.stringify(params),
        columnIds: ["_recordId"],
      }).toString();

      console.log("fuck", `${API_URL}/views/${VIEW_ID}/records?${query}`);
      const gridRecordsResponse = await axios.get(
        `${API_URL}/views/${VIEW_ID}/records?${query}`,
        {
          headers: { Authorization: `ApiKey ${API_KEY}` },
        }
      );

      gridRecords.push(...gridRecordsResponse.data);
      TOTAL_RECORD = parseInt(gridRecordsResponse.headers["x-total-count"]);
      OFFSET = OFFSET + MAX_LIMIT;
    } while (OFFSET < TOTAL_RECORD);

    const localRecords = await fs.readFileSync(
      `src/i18next/${COLUMN_IDS.RAW_US}.json`
    );
    const localRecordsObj = JSON.parse(localRecords);
    //get all local recordIds
    const localRecordIds = Object.keys(localRecordsObj);

    //pull recordIds from grid
    const gridRecordIds = gridRecords.map((record) => record?.id);

    // check => is there any deleted strings.
    const newlyDeletedRecordIds = gridRecordIds.filter(
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

    console.log("hehehe", newlyUpdatedRecordIds);

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
