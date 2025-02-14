import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import formRouter from './routes/form.routes.js'
import formSubmissionRouter from './routes/formSubmission.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"

//routes declaration
app.use("/api/healthcheck", healthcheckRouter)
app.use("/api/users", userRouter)
app.use("/api/forms", formRouter)
app.use("/api/form-submissions", formSubmissionRouter)

export { app }