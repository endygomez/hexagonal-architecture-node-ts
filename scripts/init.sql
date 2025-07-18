-- Initial database setup
-- This script creates the basic tables for the hexagonal architecture example

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
CREATE INDEX IF NOT EXISTS idx_tenants_name ON tenants(name);
CREATE INDEX IF NOT EXISTS idx_tenants_deleted_at ON tenants(deleted_at);

-- Insert some sample data
INSERT INTO users (id, name, email, password) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'john@example.com', '$2b$10$hashedpassword1'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Jane Smith', 'jane@example.com', '$2b$10$hashedpassword2')
ON CONFLICT (email) DO NOTHING;

INSERT INTO tenants (id, name) VALUES 
    ('660e8400-e29b-41d4-a716-446655440000', 'Acme Corp'),
    ('660e8400-e29b-41d4-a716-446655440001', 'TechStart Inc')
ON CONFLICT (id) DO NOTHING;
