// const swaggerAutogen = require('swagger-autogen')();
import swaggerAutogen from "swagger-autogen";


const doc = {
    info: {
        title: "Auth Service",
        version: "1.0.0",
        description: "API for user registration and login",
    },
   host: "localhost:6001",
   schemes:["http"],
}

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/auth.router.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);