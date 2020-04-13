CREATE TABLE "public"."likes" (

"id" serial,

"userid" integer,

"doggoid" integer,

"dateliked" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,

"likecount" integer NOT NULL DEFAULT '1',

PRIMARY KEY ("id"),

CONSTRAINT "userid" FOREIGN KEY ("userid") REFERENCES "public"."users"("userid"),

CONSTRAINT "doggoid" FOREIGN KEY ("doggoid") REFERENCES "public"."doggos"("doggoid")

);