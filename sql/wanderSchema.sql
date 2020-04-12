--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

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
-- Name: doggos; Type: TABLE; Schema: public; Owner: asawo
--

CREATE TABLE public.doggos (
    doggoid integer NOT NULL,
    doggoname character varying(25),
    description text,
    datecreated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    dateupdated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    userid integer,
    imageurl text,
    username text
);


ALTER TABLE public.doggos OWNER TO asawo;

--
-- Name: doggos_doggoid_seq; Type: SEQUENCE; Schema: public; Owner: asawo
--

CREATE SEQUENCE public.doggos_doggoid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.doggos_doggoid_seq OWNER TO asawo;

--
-- Name: doggos_doggoid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asawo
--

ALTER SEQUENCE public.doggos_doggoid_seq OWNED BY public.doggos.doggoid;


--
-- Name: likes; Type: TABLE; Schema: public; Owner: asawo
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    userid integer,
    doggoid integer,
    dateliked timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    likecount integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.likes OWNER TO asawo;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: asawo
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.likes_id_seq OWNER TO asawo;

--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: asawo
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: asawo
--

CREATE SEQUENCE public.users_userid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_userid_seq OWNER TO asawo;

--
-- Name: users; Type: TABLE; Schema: public; Owner: asawo
--

CREATE TABLE public.users (
    userid integer DEFAULT nextval('public.users_userid_seq'::regclass) NOT NULL,
    username character varying(12),
    password character varying(100)
);


ALTER TABLE public.users OWNER TO asawo;

--
-- Name: doggos doggoid; Type: DEFAULT; Schema: public; Owner: asawo
--

ALTER TABLE ONLY public.doggos ALTER COLUMN doggoid SET DEFAULT nextval('public.doggos_doggoid_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: asawo
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Data for Name: doggos; Type: TABLE DATA; Schema: public; Owner: asawo
--

COPY public.doggos (doggoid, doggoname, description, datecreated, dateupdated, userid, imageurl, username) FROM stdin;
33	Huskyboi	Winter is coming ❄️	2020-03-21 19:55:27.574149	2020-03-21 19:55:27.574149	35	https://wander-love-images.s3-ap-northeast-1.amazonaws.com/35/84770292-32a1-473c-b9c5-88d42280b241.png	hi
29	Happy dog	Happiest pupper in the house	2020-03-21 16:15:47.306611	2020-03-21 16:15:47.306611	53	https://wander-love-images.s3-ap-northeast-1.amazonaws.com/53/a0414a36-a91c-48d7-b788-a9470196bb6f.png	test
27	Ken	Very good doggo	2020-03-15 20:46:55.72179	2020-03-15 20:46:55.72179	28	https://wander-love-images.s3-ap-northeast-1.amazonaws.com/28/f438d1eb-6e63-43a8-a9ee-ef6f3e22e8f0.png	asawo
111	Japanese Doggo	Konbanwan 🐕	2020-03-29 20:50:47.641148	2020-03-29 20:50:47.641148	35	https://wander-love-images.s3-ap-northeast-1.amazonaws.com/35/5eaf7a9b-e678-4f9d-9179-285d36dede2c.jpeg	hi
28	Looking up dog	hi 👀	2020-03-16 20:19:22.63673	2020-03-16 20:19:22.63673	35	https://wander-love-images.s3-ap-northeast-1.amazonaws.com/35/15763b35-6619-4cfc-934d-7ddf09bc0cc8.png	hi
\.


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: asawo
--

COPY public.likes (id, userid, doggoid, dateliked, likecount) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: asawo
--

COPY public.users (userid, username, password) FROM stdin;
83	bloody	$2b$10$irZ2uSyH47NUlHKA/75./.m41cp5QjfZEZDW9V0Euno850BmfQ3LO
87	account	$2b$10$LCvtV3JyGO1YegnMNmMlO.lffoTDxfbZdO443BKP2AFVHbm5hOSw2
27	polly	$2b$10$m3x1dOMH9b4LV23FTpkrMuiqgs9am489PXmKzlGNZ7EsoKxzvZ062
28	asawo	$2b$10$BXlMi4Oq6S3QxShMRDCQS.JkjDAS0ynWzIAquZBg7cunL6RjFnQva
32	hello	$2b$10$u6ROsvgvDzDOn6MoOxE5Sut6ddl2dwOPjEkQHsAl/nC5forjK3cz6
34	blub	$2b$10$g/CT.XPVpP6YgmGjH3LOjuav6f4U76GWfK7VERPl3hDa/ldvErTve
35	hi	$2b$10$NYLwnQUIvGWxBqsb64EA4.catdKxFq5dO4pC0QMjcS4GSqxAVZaia
53	test	$2b$10$4dgWuM4hGt3jxG1YZ3Z7E.u7IEIjL/9jeQmy14zFbHigmYFEAHM2a
\.


--
-- Name: doggos_doggoid_seq; Type: SEQUENCE SET; Schema: public; Owner: asawo
--

SELECT pg_catalog.setval('public.doggos_doggoid_seq', 197, true);


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: asawo
--

SELECT pg_catalog.setval('public.likes_id_seq', 1, false);


--
-- Name: users_userid_seq; Type: SEQUENCE SET; Schema: public; Owner: asawo
--

SELECT pg_catalog.setval('public.users_userid_seq', 170, true);


--
-- Name: doggos doggos_pkey; Type: CONSTRAINT; Schema: public; Owner: asawo
--

ALTER TABLE ONLY public.doggos
    ADD CONSTRAINT doggos_pkey PRIMARY KEY (doggoid);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: asawo
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: asawo
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: likes doggoid; Type: FK CONSTRAINT; Schema: public; Owner: asawo
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT doggoid FOREIGN KEY (doggoid) REFERENCES public.doggos(doggoid);


--
-- Name: doggos doggos_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: asawo
--

ALTER TABLE ONLY public.doggos
    ADD CONSTRAINT doggos_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: likes userid; Type: FK CONSTRAINT; Schema: public; Owner: asawo
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT userid FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- PostgreSQL database dump complete
--

