-- carpool_demo.sql
-- This SQL script inserts example data into your carpool database and then
-- runs queries to verify the inserted data.

-----------------------------
-- 1. Insert Two Users
-----------------------------
-- Insert a rider
INSERT INTO users (name, email, phone, role)
VALUES ('Alice Rider', 'alice.rider@example.com', '555-1234', 'rider');

-- Insert a driver
INSERT INTO users (name, email, phone, role)
VALUES ('Bob Driver', 'bob.driver@example.com', '555-5678', 'driver');

-----------------------------
-- 2. Create Posts for a Ride Request and a Ride Offer
-----------------------------
-- Alice creates a ride request (rider post)
INSERT INTO posts (user_id, place_from, place_to, time_from, seats_needed, is_rider_post)
VALUES (
    (SELECT user_id FROM users WHERE email = 'alice.rider@example.com'),
    'Downtown',
    'City Airport',
    '08:00',
    1,         -- she needs 1 seat
    TRUE       -- indicates a rider post
);

-- Bob creates a ride offer (driver post)
INSERT INTO posts (user_id, place_from, place_to, time_from, available_seats, is_rider_post)
VALUES (
    (SELECT user_id FROM users WHERE email = 'bob.driver@example.com'),
    'Suburbs',
    'City Airport',
    '07:45',
    3,         -- he has 3 available seats
    FALSE      -- indicates a driver post
);

-----------------------------
-- 3. Create a Match Between Posts
-----------------------------
INSERT INTO matches (rider_post_id, driver_post_id, status)
VALUES (
    (SELECT post_id FROM posts WHERE is_rider_post = TRUE
     AND user_id = (SELECT user_id FROM users WHERE email = 'alice.rider@example.com')),
    (SELECT post_id FROM posts WHERE is_rider_post = FALSE
     AND user_id = (SELECT user_id FROM users WHERE email = 'bob.driver@example.com')),
    'pending'
);

-----------------------------
-- 4. Record Ride History
-----------------------------
-- For demonstration, we assume the ride_id is 101
INSERT INTO ride_history (user_id, ride_id, role, action)
VALUES (
    (SELECT user_id FROM users WHERE email = 'alice.rider@example.com'),
    101,         -- replace with an actual ride_id if available
    'rider',
    'requested'
);

-----------------------------
-- 5. Add a Review After the Ride
-----------------------------
INSERT INTO reviews (user_id, reviewer_id, rating, comment)
VALUES (
    (SELECT user_id FROM users WHERE email = 'bob.driver@example.com'),  -- user being reviewed
    (SELECT user_id FROM users WHERE email = 'alice.rider@example.com'), -- reviewer
    5,
    'Great ride, very punctual and friendly!'
);

-----------------------------
-- 6. Querying Data to Verify Inserts
-----------------------------
-- Listing all users
SELECT * FROM users;

-- Viewing all posts
SELECT * FROM posts;

-- Checking current matches
SELECT * FROM matches;

-- Viewing ride history
SELECT * FROM ride_history;

-- Listing reviews
SELECT * FROM reviews;
