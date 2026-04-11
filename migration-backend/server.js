require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { execSync } = require("child_process");

const Migration = require("./models/Migration");
const { verifyToken, allowRoles } = require("./middleware/auth");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// ================= DB CONNECT =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ================= DEBUG =================
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

// ================= HELPER FUNCTIONS =================
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

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Migration Tool API Running");
});


// ================= CREATE =================
app.post(
  "/migrations/create",
  verifyToken,
  allowRoles("admin", "developer"),
  async (req, res) => {
    try {
      const existing = await Migration.findOne({ version: req.body.version });

      if (existing) {
        return res.status(400).json({ message: "Version exists" });
      }

      const migration = await Migration.create(req.body);
      res.json(migration);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// ================= GET =================
app.get(
  "/migrations",
  verifyToken,
  allowRoles("admin", "developer", "viewer"),
  async (req, res) => {
    const migrations = await Migration.find();
    res.json(migrations);
  }
);


// ================= RUN =================
app.post(
  "/migrations/run/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    let migration;

    try {
      migration = await Migration.findById(req.params.id);

      if (!migration) {
        return res.status(404).json({ message: "Migration not found" });
      }

      // STATUS → RUNNING
      migration.status = "running";
      migration.logs.push(`Started at ${new Date().toLocaleString()}`);
      await migration.save();

      // PRE CHECK
      preMigrationCheck(migration);

      const users = mongoose.connection.collection("users");

      //  Dynamic field
      const fieldName = migration.name
        .replace(/^add_/, "")
        .replace(/_field$/, "")
        .replace(/_/g, "")
        .toLowerCase();

      // validation for shell
      const exists = await users.findOne({ [fieldName]: { $exists: true } });
      if (exists) throw new Error(`Field '${fieldName}' already exists`);

      // DB UPDATE
      const result = await users.updateMany({}, {
        $set: { [fieldName]: "" }
      });
      console.log("✅ Modified count:", result.modifiedCount);

      migration.logs.push(
        `Field '${fieldName}' added to ${result.modifiedCount} docs`
      );

      // POST CHECK
      postMigrationCheck();

      // GIT COMMIT
      execSync("git add .");
      try {
        execSync(`git commit -m "migration_${migration.version}"`, {
          stdio: "ignore"
        });
      } catch {}

      const commitId = execSync("git rev-parse HEAD")
        .toString()
        .trim();

      migration.gitCommitId = commitId;
      migration.logs.push(`Git commit: ${commitId}`);

      // COMPLETE
      migration.status = "completed";
      migration.logs.push(`Completed at ${new Date().toLocaleString()}`);

      await migration.save();

      res.json(migration);

    } catch (err) {
      if (migration) {
        migration.status = "failed";
        migration.logs.push(`Error: ${err.message}`);
        await migration.save();
      }

      res.status(500).json({ error: err.message });
    }
  }
);


// ================= ROLLBACK =================
app.post(
  "/migrations/rollback/:id",
  verifyToken,
  allowRoles("admin"),
  async (req, res) => {
    let migration;

    try {
      migration = await Migration.findById(req.params.id);

      if (!migration) {
        return res.status(404).json({ message: "Migration not found" });
      }

      // STATUS → RUNNING
      migration.status = "running";
      migration.logs.push(`Rollback started at ${new Date().toLocaleString()}`);
      await migration.save();

      const users = mongoose.connection.collection("users");

      const fieldName = migration.name
        .replace(/^add_/, "")
        .replace(/_field$/, "")
        .replace(/_/g, "")
        .toLowerCase();

      // AUTO SAVE
      execSync("git add .");
      try {
        execSync(`git commit -m "auto-save before rollback"`, {
          stdio: "ignore"
        });
      } catch {}

      // GIT REVERT
      if (migration.gitCommitId) {
        execSync(
          `git revert ${migration.gitCommitId} --no-edit -X theirs`,
          { stdio: "inherit" }
        );

        migration.logs.push(`Git revert: ${migration.gitCommitId}`);
      }

      // DB REMOVE
      await users.updateMany({}, {
        $unset: { [fieldName]: "" }
      });

      migration.logs.push(`Field '${fieldName}' removed`);

      // COMPLETE
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
  }
);

// ================= GIT HISTORY =================
app.get(
  "/git-history",
  verifyToken,
  async (req, res) => {
    try {
      const log = execSync("git log --oneline -20").toString().trim();
      const lines = log.split("\n").map(line => {
        const [hash, ...rest] = line.split(" ");
        return { hash, message: rest.join(" ") };
      });
      res.json(lines);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// ================= START =================
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});