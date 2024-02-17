// Core
import { glob } from "glob";

// Firebase
import admin from "firebase-admin";

// Ours - Secrets
import serviceAccount from "../secrets/service-account.json";

const MIGRATIONS_DIR = "migrations";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
  }),
});

const firestore = admin.firestore();
glob(`${MIGRATIONS_DIR}/v*__*.ts`).then((paths) => {
  console.log("paths", paths);
  paths.forEach(async (path) => {
    path = path.replace(MIGRATIONS_DIR, ".");
    console.log("importing", path);
    const { default: migration } = await import(path);
    await migration(firestore);
  });
});

/*
// Load all migrations in the current directory
const migrations = await glob("./v*__*.ts");
for (const path of migrations) {
  const { default: migration } = await import(path);
  await migration(admin.firestore());
}
*/
