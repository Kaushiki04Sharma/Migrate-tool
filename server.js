const { execSync } = require("child_process");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const Migration = require("./models/Migration");

const app = express();
app.use(express.json());
app.use(cors());

// ADD THIS HERE
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;


//MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

//HELPER FUNCTIONS (Shell Simulation)

function preMigrationCheck(migration) {
  console.log("🔍 Pre-migration check");

  if (!migration.name) {
    throw new Error("Migration name missing");
  }

  if (!migration.up || !migration.down) {
    throw new Error("Invalid migration actions");
  }
}

function postMigrationCheck() {
  console.log("✅ Post migration validation done");
}


// Test route
app.get("/", (req, res) => {
  res.send("Migration Tool API Running");
});


// CREATE MIGRATION (Duplicate Version Check)
app.post("/migrations/create", async (req, res) => {
  try {
    const { version } = req.body;

    const existing = await Migration.findOne({ version });

    if (existing) {
      return res.status(400).json({ message: "Version already exists" });
    }

    const migration = await Migration.create(req.body);

    res.json(migration);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET ALL MIGRATIONS
app.get("/migrations", async (req, res) => {
  const migrations = await Migration.find();
  res.json(migrations);
});


//  RUN MIGRATION (FULL UPGRADE)
app.post("/migrations/run/:id", async (req, res) => {
  let migration;

  try {
    migration = await Migration.findById(req.params.id);

    if (!migration) {
      return res.status(404).json({ message: "Migration not found" });
    }

      // STATUS → RUNNING
      migration.status = "running";
      migration.logs.push(`Started at ${new Date().toLocaleString()}`);

      //  ADD HERE (Git integration)
      execSync("git add .");
      execSync(`git commit -m "migration_${migration.version}"`);

      const commitId = execSync("git rev-parse HEAD")
        .toString()
        .trim();

        
      migration.gitCommitId = commitId;
      migration.logs.push(`Git commit: ${commitId}`);

    // GIT SIMULATION
    migration.gitCommitId = "commit_" + Date.now();

    await migration.save();

    // SHELL PRE CHECK
    preMigrationCheck(migration);

    const db = mongoose.connection.db;
const usersCollection = db.collection("users");

if (migration.up.action === "addField") {

  const exists = await usersCollection.findOne({ email: { $exists: true } });

  if (exists) {
    throw new Error("Field 'email' already exists");
  }

  const result = await usersCollection.updateMany(
    {},
    { $set: { email: "" } }
  );

  console.log("✅ Modified count:", result.modifiedCount);

  migration.logs.push(`Field 'email' added to ${result.modifiedCount} docs`);
}
    if (migration.up.action === "removeField") {
      const sample = await usersCollection.findOne();

      if (!sample || sample.email === undefined) {
        throw new Error("Field 'email' does not exist");
      }

      await usersCollection.updateMany({}, { $unset: { email: "" } });
      migration.logs.push("Field 'email' removed");
    }

    // POST CHECK
    postMigrationCheck();

    // STATUS → COMPLETED
    migration.status = "completed";
    migration.logs.push(`Completed at ${new Date().toLocaleString()}`);

    await migration.save();

    res.json(migration);

  } catch (err) {
    console.error(err);

    if (migration) {
      migration.status = "failed";
      migration.logs.push(`Error: ${err.message}`);
      await migration.save();
    }

    res.status(500).json({ error: err.message });
  }
});


//  ROLLBACK MIGRATION
app.post("/migrations/rollback/:id", async (req, res) => {
  let migration;

  try {
    migration = await Migration.findById(req.params.id);

    if (!migration) {
      return res.status(404).json({ message: "Migration not found" });
    }

    migration.status = "running";
    migration.logs.push(`Rollback started at ${new Date().toLocaleString()}`);

    await migration.save();

    const usersCollection = mongoose.connection.collection("users");

    if (migration.down.action === "removeField") {
      await usersCollection.updateMany({}, { $unset: { email: "" } });
      migration.logs.push("Field 'email' removed (rollback)");
    }

    if (migration.down.action === "addField") {
      await usersCollection.updateMany({}, { $set: { email: "" } });
      migration.logs.push("Field 'email' added (rollback)");
    }

    migration.status = "rolled_back";
    migration.logs.push(`Rollback completed at ${new Date().toLocaleString()}`);

    await migration.save();

    res.json(migration);

  } catch (err) {
    if (migration) {
      migration.status = "failed";
      migration.logs.push(`Rollback error: ${err.message}`);
      await migration.save();
    }

    res.status(500).json({ error: err.message });
  }
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});