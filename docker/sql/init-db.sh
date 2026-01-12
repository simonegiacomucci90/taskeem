#!/bin/sh

echo "Waiting for SQL Server..."

until /opt/mssql-tools/bin/sqlcmd \
  -S sqlserver \
  -U sa \
  -P "$SA_PASSWORD" \
  -Q "SELECT 1"
do
  sleep 2
done

echo "Running init.sql..."

/opt/mssql-tools/bin/sqlcmd \
  -S sqlserver \
  -U sa \
  -P "$SA_PASSWORD" \
  -i /scripts/init.sql

echo "Database initialized."