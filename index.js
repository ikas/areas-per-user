const fs = require('fs');
const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;

const fetchPageOfAreas = async (client, page) => {
    const limit = 200;
    const skip = (page - 1) * limit;
    const areas = [];

    const areasPage = await client
        .db('area')
        .collection('areas')
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

    await areasPage.forEach(doc => areas.push(doc));
    return areas;
}

const main = async () => {
    let client;
    try {
        const client = await MongoClient.connect(
            process.env.MONGO_URI,
            { useNewUrlParser: true, useUnifiedTopology: true },
        );

        let page = 1;
        let areas = await fetchPageOfAreas(client, page);
        const userAreasCount = [];

        while (areas.length > 0) {
            for (const area of areas) {
                const el = userAreasCount.find(el => el.userId === area.userId);
                if (!el) {
                    userAreasCount.push({ countAreas: 1, userId: area.userId })
                } else {
                    el.countAreas++;
                }
            }

            page++;
            console.log(`Fetching page ${page}...`);
            areas = await fetchPageOfAreas(client, page);
        }

        const sortedResults = _.reverse(_.sortBy(userAreasCount, 'countAreas'));

        // Write results to CSV file
        const file = fs.createWriteStream('countAreas.csv');
        fs.truncateSync('countAreas.csv', 0);
        file.write('UserId,Count Areas\n');
        sortedResults.forEach(el => file.write(`${el.userId},${el.countAreas}\n`));
        file.end();

    } catch (err) {
        console.err(err);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

main()
    .then(() => { console.log('script ended'); })
    .catch(err => { console.error(err); });
