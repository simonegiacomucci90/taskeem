# Taskeem - Task Management System

A task management system built with .NET 10, React, TypeScript, and SQL Server.

## Architecture

The system consists of:
- **Backend**: ASP.NET Core REST API (.NET 10) with Entity Framework Core
- **Frontend**: React application with TypeScript, Vite, Material-UI, and Redux Toolkit
- **Database**: SQL Server with automatic migrations
- **Containerization**: Docker Compose for complete orchestration

## Prerequisites

Before starting, make sure you have installed:

- [**Docker Desktop**](https://www.docker.com/products/docker-desktop/) (version 24+)
- [**Docker Compose**](https://docs.docker.com/compose/install/) (version 2.0+) - Usually included with Docker Desktop
- [**Git**](https://git-scm.com/downloads)

### For local development (optional):
- [**Microsoft .NET SDK**](https://dotnet.microsoft.com/download) 10.0+
- [**Node.js**](https://nodejs.org/) 18+ with npm
- [**SQL Server**](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (if you don't want to use Docker)

## Quick Installation and Startup

### 1. Clone the repository
```bash
git clone <repository-url>
cd taskeem
```

### 2. Start the complete system
```bash
docker-compose up --build
```

This command will:
1. Start SQL Server and wait for it to be ready
2. Build and start the backend which automatically runs database migrations
3. Start the initialization service that inserts demo data
4. Build and start the frontend

### 3. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger API Docs**: http://localhost:8080/swagger

## Configuration

### Database
The system uses SQL Server with the following default credentials:
- **Server**: sqlserver (container name) / localhost:1433
- **Database**: Taskeem
- **Username**: sa
- **Password**: StrongPassword123!

### CORS
The backend is configured to accept requests from:
- http://localhost:3000 (development frontend)
- http://localhost:5173 (Vite dev server)

## Local Development

### Backend (.NET)
```bash
cd TaskeemBackend/Taskeem.Api
dotnet restore
dotnet run
```

### Frontend (React)
```bash
cd TaskeemFrontend/taskeem-frontend
npm install
npm run dev
```

### Local Database
If you prefer to use local SQL Server instead of Docker:
1. Modify the connection string in `TaskeemBackend/Taskeem.Api/appsettings.json`
2. Ensure SQL Server is running
3. The database will be created automatically by migrations

## Database Structure

The system includes:
- **Users**: system user management
- **Tasks** (UserTasks): assigned task management

### Demo Data
The system comes with pre-loaded demo data:
- 1 demo user: `demo@company.com`
- 2 sample tasks

## Useful Docker Commands

```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build --force-recreate

# Remove volumes (complete database reset)
docker-compose down --volumes
```

## Troubleshooting

### SQL Server won't start
- Make sure Docker Desktop is running
- Check that port 1433 is not already in use
- SQL Server logs may take several minutes to complete initialization

### Backend can't connect to database
- Verify SQL Server is healthy: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`

### Frontend won't load
- Ensure backend is running on http://localhost:8080
- Check the `VITE_API_URL` variable in the frontend

### Port already in use
If ports 3000, 8080, or 1433 are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:80"    # Change 3000 to 3001
  - "8081:8080"  # Change 8080 to 8081
  - "1434:1433"  # Change 1433 to 1434
```