# Migrate-tool
A web-based tool to manage and execute MongoDB database migrations in Node.js applications.

## ✨Core Features

### Migration Designer
- Web interface for defining schema changes that mimics Express route design patterns
- Pre-built templates for common migration operations:
  - Create collection
  - Add/remove field
  - Rename field
  - Index creation
- Form-based migration configuration with validation

### Storage System
- Backend stores migration templates and configurations
- Simulates MongoDB document storage using native data structures
- Persists migration definitions, execution history, and logs

### Migration Queue System
- Mock asynchronous migration execution with realistic state transitions
- Migration states: Pending, Running, Completed, Failed
- Detailed execution logs for each migration with timestamps
- Simulated processing delays to demonstrate real-world behavior

### Version Control Simulation
- Track migrations with simulated Git-like commit history
- Each migration gets a unique version identifier
- Rollback functionality to revert to previous migration versions
- Visual commit timeline showing migration progression

### Validation System
- Mock pre-migration and post-migration data validation checks
- Simulated structure comparison with highlighted anomalies
- Mock Unix file permission validation for migration scripts
- Randomized validation warnings for demonstration purposes

### Logging and Monitoring
- Comprehensive visual timeline of all migration activities
- Real-time status updates during migration execution
- Simulated data corruption detection with warning alerts
- Detailed audit trail for all operations

## User Interface

### Dashboard Layout
Four main tabs:
1. **Design Migration** - Create and configure new migrations
2. **Migration Queue** - View and manage pending/running migrations
3. **History/Logs** - Browse migration history and detailed logs
4. **Validation Results** - Review validation checks and warnings

### Interactive Features
- Real-time progress indicators during migration execution
- One-click rollback controls with confirmation dialogs
- Migration template library with search and filtering
- Export/import migration configurations

## Backend Data Storage

The backend must store:
- Migration templates and configurations
- Migration execution history and status
- Detailed logs for each migration run
- Simulated Git commit history
- Validation results and warnings
- User-created migration definitions

## Simulation Behavior

All processes are simulated for educational purposes:
- No actual database connections required
- Realistic timing delays for migration execution
- Randomized success/failure scenarios for demonstration
- Mock validation results with educational examples

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, Vite, TailwindCSS            |
| Backend   | Express.js (simulation), Node.js    |
| Storage   | Native JS data structures (MongoDB simulation) |

### Prerequisites 
   - Node.js (latest stable version recommended)
   - Git (for cloning the repository) 
---

### ⚙️Installation

1. Clone the repository
2. Install client dependencies:

   ```
   cd client
   npm install
   ```

3. Install server dependencies:

   ```
   cd server
   python -m venv myenv
   source myenv/bin/activate
   pip install -r requirements.txt
   ```

4. Set up environment variables for API keys

### Running the Application

1. Start the backend server:

   ```
   cd server
   source myenv/bin/activate
   uvicorn main:app --reload
   ```

2. Start the frontend development server:

   ```
   cd client
   npm run dev
   ```


## Usage

1. Design Migration – Create and configure new migrations
2. Migration Queue – View and manage pending/running migrations
3. History/Logs – Browse migration history and detailed logs
4. Validation Results – Review validation checks and warnings
5. Use interactive features like rollback, template library, and export/
