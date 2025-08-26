-- 001_initial_schema.sql
-- FiscalFlow Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'USD',
    role VARCHAR(20) DEFAULT 'user' CHECK (
        role IN (
            'user',
            'admin',
            'super_admin'
        )
    ),
    subscription_tier VARCHAR(20) DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    notification_enabled BOOLEAN DEFAULT true,
    push_subscription JSONB,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    type VARCHAR(10) CHECK (
        type IN ('income', 'expense', 'both')
    ),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT false,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')),
    description TEXT,
    date DATE NOT NULL,
    recurring BOOLEAN DEFAULT false,
    tags TEXT[],
    attachment_url TEXT,
    bank_transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories (id),
    amount DECIMAL(12, 2) NOT NULL,
    period VARCHAR(10) DEFAULT 'monthly',
    start_date DATE,
    end_date DATE,
    alert_threshold INTEGER DEFAULT 80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Insights cache table
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    insight_type VARCHAR(50),
    content JSONB,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_transactions_user_date ON transactions (user_id, date DESC);

CREATE INDEX idx_transactions_category ON transactions (category_id);

CREATE INDEX idx_budgets_user ON budgets (user_id);

CREATE INDEX idx_users_subscription ON users (
    subscription_tier,
    subscription_expires_at
);

CREATE INDEX idx_users_role ON users (role);

-- Insert default categories
INSERT INTO categories (name, icon, color, type, is_default) VALUES
('Food & Dining', '🍽️', '#FF6B6B', 'expense', true),
('Transportation', '🚗', '#4ECDC4', 'expense', true),
('Shopping', '🛒', '#45B7D1', 'expense', true),
('Entertainment', '🎬', '#96CEB4', 'expense', true),
('Bills & Utilities', '⚡', '#FFEAA7', 'expense', true),
('Healthcare', '🏥', '#DDA0DD', 'expense', true),
('Education', '📚', '#98D8C8', 'expense', true),
('Salary', '💰', '#6C5CE7', 'income', true),
('Freelance', '💼', '#A29BFE', 'income', true),
('Investment', '📈', '#FD79A8', 'income', true),
('Gift', '🎁', '#FDCB6E', 'both', true),
('Other', '📝', '#74B9FF', 'both', true);