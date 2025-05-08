--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

-- This Pg dump is from the working database during all of testing and development
--  *** THE OTHER FILE IS THE SCHEMA ***

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: confirmed_rides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.confirmed_rides (
    post_id integer NOT NULL,
    driver_id integer,
    rider_id integer,
    driver_confirmed boolean DEFAULT false,
    rider_confirmed boolean DEFAULT false
);


ALTER TABLE public.confirmed_rides OWNER TO postgres;

--
-- Name: match_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.match_requests (
    id integer NOT NULL,
    post_id integer,
    rider_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.match_requests OWNER TO postgres;

--
-- Name: match_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.match_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.match_requests_id_seq OWNER TO postgres;

--
-- Name: match_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.match_requests_id_seq OWNED BY public.match_requests.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    post_id integer,
    sender_email text NOT NULL,
    recipient_email text NOT NULL,
    message text NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_post_id_seq OWNER TO postgres;

--
-- Name: posts_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_post_id_seq OWNED BY public.posts.post_id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    post_id integer,
    requester_id integer,
    status text DEFAULT 'pending'::text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT requests_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'denied'::text])))
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.requests_id_seq OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

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


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_review_id_seq OWNER TO postgres;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: match_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_requests ALTER COLUMN id SET DEFAULT nextval('public.match_requests_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: posts post_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN post_id SET DEFAULT nextval('public.posts_post_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: confirmed_rides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.confirmed_rides (post_id, driver_id, rider_id, driver_confirmed, rider_confirmed) FROM stdin;
3	10	11	f	f
4	11	10	f	f
6	11	10	f	f
7	11	10	f	f
\.


--
-- Data for Name: match_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.match_requests (id, post_id, rider_id, created_at) FROM stdin;
1	3	11	2025-05-07 22:33:44.490088
2	4	10	2025-05-07 22:37:08.211357
3	6	10	2025-05-07 23:02:26.710691
4	7	10	2025-05-07 23:04:01.06568
5	8	11	2025-05-07 23:22:25.507615
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, post_id, sender_email, recipient_email, message, "timestamp") FROM stdin;
7	3	rjoshi@umass.edu	test@umass.edu	hey test man, i need a ride from you and am interested! Lets do this.	2025-05-07 19:22:34.99862-04
8	3	rjoshi@umass.edu	test@umass.edu	yo	2025-05-07 19:23:01.85745-04
9	3	rjoshi@umass.edu	test@umass.edu	yooo test wassup G	2025-05-07 19:34:24.530542-04
10	3	rjoshi@umass.edu	test@umass.edu	bruh	2025-05-07 19:35:15.596402-04
11	3	rjoshi@umass.edu	test@umass.edu	hi	2025-05-07 19:38:36.812026-04
12	3	rjoshi@umass.edu	test@umass.edu	ssss	2025-05-07 19:38:53.482091-04
13	3	rjoshi@umass.edu	test@umass.edu	22	2025-05-07 19:39:05.587368-04
14	3	rjoshi@umass.edu	test@umass.edu	YEET	2025-05-07 19:41:47.228555-04
15	3	rjoshi@umass.edu	test@umass.edu	ssss	2025-05-07 19:45:27.642638-04
16	3	rjoshi@umass.edu	test@umass.edu	hey	2025-05-07 19:58:20.380401-04
17	3	test@umass.edu	rjoshi@umass.edu	brooo wsg 	2025-05-07 19:58:30.952397-04
18	3	rjoshi@umass.edu	test@umass.edu	omg this works LFG	2025-05-07 19:58:38.145745-04
19	3	rjoshi@umass.edu	test@umass.edu	heyy	2025-05-07 20:01:29.507451-04
20	3	test@umass.edu	rjoshi@umass.edu	hey	2025-05-07 20:01:32.91817-04
21	3	test@umass.edu	rjoshi@umass.edu	ohhh it updates when you send a message frfrfr	2025-05-07 20:01:44.686757-04
22	3	rjoshi@umass.edu	test@umass.edu	YE	2025-05-07 20:01:48.426053-04
23	4	test@umass.edu	rjoshi@umass.edu	hello!!	2025-05-07 22:35:07.61437-04
24	4	rjoshi@umass.edu	test@umass.edu	yo	2025-05-07 22:35:14.835342-04
25	4	rjoshi@umass.edu	test@umass.edu	you wanna match?... ;-;	2025-05-07 22:35:23.845031-04
26	4	test@umass.edu	rjoshi@umass.edu	sureeee	2025-05-07 22:35:31.692448-04
27	4	rjoshi@umass.edu	test@umass.edu	BET	2025-05-07 22:35:37.967044-04
28	4	test@umass.edu	rjoshi@umass.edu	I just sent it!	2025-05-07 22:37:21.364278-04
29	4	rjoshi@umass.edu	test@umass.edu	bet	2025-05-07 22:37:27.428509-04
30	6	test@umass.edu	rjoshi@umass.edu	broskiiiii u a litty	2025-05-07 23:02:36.538164-04
31	6	rjoshi@umass.edu	test@umass.edu	wwww	2025-05-07 23:02:42.502353-04
32	8	rjoshi@umass.edu	test@umass.edu	hey	2025-05-07 23:22:41.257211-04
33	8	test@umass.edu	rjoshi@umass.edu	hi	2025-05-07 23:22:49.339258-04
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (post_id, user_id, role, from_location, to_location, ride_date, seats, created_at, is_matched) FROM stdin;
3	10	driver	Mall 2	Boston	2025-05-09	3	2025-05-07 19:22:02.617398	t
4	11	driver	ss	xx	2025-05-10	2	2025-05-07 22:34:47.494305	t
5	10	rider	ee	d	2025-05-15	1	2025-05-07 22:58:58.872288	f
6	11	driver	eq	dgsf	2025-05-10	3	2025-05-07 23:02:06.014581	t
7	11	driver	s	saafew	2025-05-08	2	2025-05-07 23:03:55.351383	t
8	10	driver	1241	1224321123	2025-05-23	1	2025-05-07 23:22:06.12686	f
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, post_id, requester_id, status, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (review_id, post_id, reviewer_id, target_id, stars, comment, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at) FROM stdin;
10	Test Man	test@umass.edu	$2b$10$DlkQNQQxRqsjocgk4k7g7.Wg8Idz6zLu3ovSIvTxbU6QCny3AX276	2025-05-07 19:21:12.436376
11	Rohit Man	rjoshi@umass.edu	$2b$10$pSz5Xc2kLwv362m6GEIQzOXFimbc/Ftd/iql9dFj1xYlVHRttk..S	2025-05-07 19:21:34.060363
\.


--
-- Name: match_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.match_requests_id_seq', 6, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 33, true);


--
-- Name: posts_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_post_id_seq', 8, true);


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_id_seq', 1, false);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11, true);


--
-- Name: confirmed_rides confirmed_rides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.confirmed_rides
    ADD CONSTRAINT confirmed_rides_pkey PRIMARY KEY (post_id);


--
-- Name: match_requests match_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_requests
    ADD CONSTRAINT match_requests_pkey PRIMARY KEY (id);


--
-- Name: match_requests match_requests_post_id_rider_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_requests
    ADD CONSTRAINT match_requests_post_id_rider_id_key UNIQUE (post_id, rider_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (post_id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: reviews reviews_post_id_reviewer_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_post_id_reviewer_id_key UNIQUE (post_id, reviewer_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: confirmed_rides confirmed_rides_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.confirmed_rides
    ADD CONSTRAINT confirmed_rides_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id);


--
-- Name: confirmed_rides confirmed_rides_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.confirmed_rides
    ADD CONSTRAINT confirmed_rides_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE;


--
-- Name: confirmed_rides confirmed_rides_rider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.confirmed_rides
    ADD CONSTRAINT confirmed_rides_rider_id_fkey FOREIGN KEY (rider_id) REFERENCES public.users(id);


--
-- Name: match_requests match_requests_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_requests
    ADD CONSTRAINT match_requests_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE;


--
-- Name: match_requests match_requests_rider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.match_requests
    ADD CONSTRAINT match_requests_rider_id_fkey FOREIGN KEY (rider_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE;


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: requests requests_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE;


--
-- Name: requests requests_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(post_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: TABLE confirmed_rides; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.confirmed_rides TO hijack_user;


--
-- Name: TABLE match_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.match_requests TO hijack_user;


--
-- Name: SEQUENCE match_requests_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.match_requests_id_seq TO hijack_user;


--
-- Name: TABLE messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.messages TO hijack_user;


--
-- Name: SEQUENCE messages_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.messages_id_seq TO hijack_user;


--
-- Name: TABLE posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.posts TO hijack_user;


--
-- Name: SEQUENCE posts_post_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.posts_post_id_seq TO hijack_user;


--
-- Name: TABLE requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.requests TO hijack_user;


--
-- Name: SEQUENCE requests_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.requests_id_seq TO hijack_user;


--
-- Name: TABLE reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reviews TO hijack_user;


--
-- Name: SEQUENCE reviews_review_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.reviews_review_id_seq TO hijack_user;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO hijack_user;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO hijack_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO hijack_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO hijack_user;


--
-- PostgreSQL database dump complete
--

