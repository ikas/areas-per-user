const MongoClient = require('mongodb').MongoClient;

const main = async () => {
    let client;
    try {
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
        const countAreas = await client.db('area').collection('areas').countDocuments();
        console.log(`Total AoI count: ${countAreas}`);
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
