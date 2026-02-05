-- PostgreSQL
CREATE DATABASE bookgoblin;
CREATE USER bookgoblin_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE bookgoblin TO bookgoblin_user;
                                 -- Activity Logs table
CREATE TABLE activity_logs (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
                               activity_type VARCHAR(50) NOT NULL,
                               description TEXT,
                               ip_address VARCHAR(45),
                               user_agent TEXT,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               INDEX idx_activity_user (user_id),
                               INDEX idx_activity_type (activity_type),
                               INDEX idx_activity_created (created_at)
);

-- Update users table for better admin features
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Create index for user activities
CREATE INDEX idx_user_books_status ON user_books (user_id, status);
CREATE INDEX idx_user_books_added ON user_books (added_at);