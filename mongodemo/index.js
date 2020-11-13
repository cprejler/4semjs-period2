
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://fullstack:Dadlerfar007!@fullstack.k5eim.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
/*client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/
async function mongoTest() {
    try {
        await client.connect();
        const dogs = client.db("kennel")
        const dogsCollection = dogs.collection("dogs")
        await dogsCollection.insertMany([{name: "Togo"}, {name: "Fido"}, {name:"Tut", race: "Dog"}])
        await dogsCollection.insertOne({name: "Fido2"})
        const allDogs = await dogsCollection.find({}).toArray()
        console.log(allDogs)
    } catch (error) {
        console.log(error)
    }finally{
        client.close()
    }
}
mongoTest();