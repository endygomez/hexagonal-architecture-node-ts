#!/bin/bash

# Cargar variables desde .env
ENV_FILE="../.env"

DB_USER=$(grep -E '^DATABASE_URL=' $ENV_FILE | sed -E 's|.*://([^:]+):.*|\1|')
DB_NAME=$(grep -E '^DATABASE_URL=' $ENV_FILE | sed -E 's|.*/([^/?]+).*|\1|')
MIGRATION_DIR=$(grep -E '^MIGRATION_DIR=' $ENV_FILE | cut -d '=' -f2)

# Valor por defecto si no está en .env
MIGRATION_DIR=${MIGRATION_DIR:-"./migrations"}

for migration in $(ls $MIGRATION_DIR/V*.sql | sort -V); do
    version=$(basename $migration .sql)
    
    # Verificar si la migración ya fue aplicada
    if ! psql -U $DB_USER -d $DB_NAME -t -c "SELECT version FROM schema_migrations WHERE version = '$version'" | grep -q "$version"; then
        echo "Aplicando migración: $version"
        
        # Ejecutar la migración dentro de una transacción
        psql -U $DB_USER -d $DB_NAME <<EOF
        BEGIN;
        \i $migration
        INSERT INTO schema_migrations (version) VALUES ('$version');
        COMMIT;
EOF
    fi
done