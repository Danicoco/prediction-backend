/** @format */

import cors from "cors"
import helmet from "helmet"
import express from "express"
import "./modules/common/utils/config"

import routes from "./routes"
import { errorHandler } from "./modules/common/utils"
import compression from "compression"

const app = express()

// const apiLimiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     message: "Too many request from this IP, please try again after 10 minutes",
// })

// Middlewares
// @ts-ignore
app.use(compression())

app.use(
    helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            fontSrc: ["'self'"],
            imgSrc: ["'self'"],
            scriptSrc: ["'self'", "https://sdk.monnify.com", "'unsafe-inline'"],
            connectSrc: ["'self'", "https://sandbox.sdk.monnify.com", "'unsafe-inline'"],
            frameSrc: ["'self'", "https://sandbox.sdk.monnify.com", "'unsafe-inline'"],
            styleSrc: ["'self'"],
          },
        //   reportOnly: true, // Set
        },
    })
)
app.use(
    cors({
        origin: (_origin, callback) => {
            callback(null, true)
        },
        credentials: true,
    })
)

app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(express.json({ limit: "10mb" }))
app.use(express.static("public"))
app.disable("x-powered-by")

app.set("view engine", "ejs")

app.use("/", routes)

// Error handlers
app.use(errorHandler)

export default app
