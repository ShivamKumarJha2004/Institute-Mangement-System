import express from "express";
import cors from "cors";
import connection from "./config/db.js";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import router from "./Routes/userRoutes.js";
import courseRoute from "./Routes/courseRoutes.js";
import dotenv from "dotenv"
import studentRoute from "./Routes/StudentRoutes.js";
import paymentRoute from "./Routes/PaymentRoutes.js";
dotenv.config();
// console.log(process.env.URL);

const app = express();
const port = 4001;

// Connect to the database
connection();

// Middleware

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload({
    useTempFiles: true,
    // tempFileDir: '/tmp/' // Uncomment and specify if temporary files need to be stored elsewhere
}));

// Routes
app.use('/api', router);
app.use('/course',courseRoute)
app.use('/student',studentRoute)
app.use('/payment',paymentRoute)

// Test route
app.get("/", async (req, res) => {
    res.send("hello");
});

// Start the server
app.listen(port, () => {
    console.log(`App is starting at port ${port}`);
});
