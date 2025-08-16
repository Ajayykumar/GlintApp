import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router.js';
import  SwaggerUi  from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';





const app = express();
console.log("Hi Ajay Welcome to Auth service")
app.use(cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser())
app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API' });
});
app.use("/api-doc",SwaggerUi.serve, SwaggerUi.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
    res.json(swaggerDocument);
})
//Routes
app.use('/api', router);

app.use(errorMiddleware)

const port = process.env.PORT || 6001;
const server = app.listen(port, () => {
    console.log(`Auth service is running at  http://localhost:${port}/api`);
    console.log(`Swagger Docs available at http://localhost${port}/docs)`)
})

server.on('error', (err) => console.log("server err:", err));