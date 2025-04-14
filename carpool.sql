-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT CHECK (role IN ('rider', 'driver', 'both')),
    rating FLOAT DEFAULT 5.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,      -- the user being reviewed
    reviewer_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,    -- the one leaving the review
    
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_review UNIQUE (user_id, reviewer_id)
);

-- Ride History Table
CREATE TABLE ride_history (
    history_id SERIAL PRIMARY KEY,
    
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    ride_id INTEGER,                     -- Could later reference matches(match_id) or another rides table
    role TEXT CHECK (role IN ('rider', 'driver')),
    action TEXT CHECK (action IN ('requested', 'matched', 'cancelled', 'completed')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unified Posts Table
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    place_from TEXT NOT NULL,
    place_to   TEXT NOT NULL,
    -- Uncomment dates if needed:
    -- departure_date DATE NOT NULL,
    time_from  TIME NOT NULL,
    time_to    TIME,  -- Optional: range for time availability
    is_rider_post BOOLEAN NOT NULL,  -- TRUE for rider, FALSE for driver

    -- Role-specific columns:
    available_seats INTEGER CHECK (available_seats >= 0),
    seats_needed    INTEGER CHECK (seats_needed >= 0),
    
    is_findable BOOLEAN DEFAULT TRUE,  
    is_completed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Enforce that exactly one of the role-specific columns is set:
    CHECK (
        (is_rider_post = TRUE  AND seats_needed  IS NOT NULL AND available_seats IS NULL)
     OR (is_rider_post = FALSE AND available_seats IS NOT NULL AND seats_needed  IS NULL)
    )
);

-- Matches Table (updated to use unified posts table)
CREATE TABLE matches (
    match_id SERIAL PRIMARY KEY,
    
    rider_post_id INTEGER REFERENCES posts(post_id),
    driver_post_id INTEGER REFERENCES posts(post_id),
    
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- when the match was created
    confirmed_at TIMESTAMP,                         -- when both parties confirmed
    cancelled_at TIMESTAMP,                         -- if cancelled
    
    status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
    
    message TEXT,                  -- optional message
    estimated_duration INTERVAL,   -- ride duration estimate
    estimated_distance FLOAT,      -- ride distance (km/miles, as per your convention)
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
