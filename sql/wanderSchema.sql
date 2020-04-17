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
