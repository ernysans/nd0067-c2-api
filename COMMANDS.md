Switch to the postgres user su postgres
Start psql psql postgres
In psql run the following:
`CREATE USER full_stack_user WITH PASSWORD 'password123';`
`CREATE DATABASE full_stack_dev;`
`\c full_stack_dev`
`GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;`
To test that it is working run \dt and it should output "No relations found."

### Other
List of tables:
`\dt`

### Migrations
Create a migration `db-migrate create mythical-worlds-table --sql-file`
Add the SQL you need to the up and down sql files
Bring the migration up `db-migrate up`
Bring the migration down `db-migrate down`