const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const path = require('path')
const SALT_ROUNDS = 10
const db = pgp(CONNECTION_STRING)
const CONNECTION_STRING =
	process.env.DATABASE_URL || 'postgres://localhost:5432/wander'
