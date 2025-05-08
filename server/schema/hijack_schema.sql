-- Hijack UMass Rideshare - Clean Database Schema
-- Only includes table definitions, sequences, and indexes
-- Safe to use in version control or for reinitializing local DBs

CREATE TABLE public.confirmed_rides (
    post_id integer NOT NULL,
    driver_id integer,
    rider_id integer,
    driver_confirmed boolean DEFAULT false,
    rider_confirmed boolean DEFAULT false
);
CREATE TABLE public.match_requests (
    id integer NOT NULL,
    post_id integer,
    rider_id integer,
    created_at timestamp without time zone DEFAULT now()
);
CREATE SEQUENCE public.match_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.messages (
    id integer NOT NULL,
    post_id integer,
    sender_email text NOT NULL,
    recipient_email text NOT NULL,
    message text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now()
);
CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.posts (
    post_id integer NOT NULL,
    user_id integer,
    role text NOT NULL,
    from_location text NOT NULL,
    to_location text NOT NULL,
    ride_date date NOT NULL,
    seats integer,
    created_at timestamp without time zone DEFAULT now(),
    is_matched boolean DEFAULT false,
    CONSTRAINT posts_role_check CHECK ((role = ANY (ARRAY['rider'::text, 'driver'::text]))),
    CONSTRAINT posts_seats_check CHECK ((seats > 0))
);
CREATE SEQUENCE public.posts_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.requests (
    id integer NOT NULL,
    post_id integer,
    requester_id integer,
    status text DEFAULT 'pending'::text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'denied'::text])))
);
CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    post_id integer,
    reviewer_id integer,
    target_id integer,
    stars integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT reviews_stars_check CHECK (((stars >= 1) AND (stars <= 5)))
);
CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;