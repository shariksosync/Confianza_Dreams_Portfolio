import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { MongoClient } from "mongodb";

const newUri =
  "mongodb+srv://confianzaevents2024_db_user:cy7ZRvW8okRAjNKk@cluster0.rllxgeo.mongodb.net/confianza?appName=Cluster0";

async function checkOldUrls() {
  const client = new MongoClient(newUri);
  await client.connect();
  const db = client.db("confianza");
  const docs = await db.collection("sitecontents").find({}).toArray();
  for (const doc of docs) {
    const str = JSON.stringify(doc);
    const regex = /https?:\/\/[^\s"']+tridevsosync[^\s"']*/g;
    const matches = str.match(regex);
    if (matches) {
      console.log("Doc key:", doc.key);
      console.log("Matches:", matches);
    }
  }
  await client.close();
}
checkOldUrls().catch(console.error);
