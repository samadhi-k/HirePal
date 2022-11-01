import express from "express";

const app = express()

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

app.get('/', (req, res)=>{
    res.send('WElcome')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

app.listen( port, () => {
        console.log(`server listening on port ${port}`)
    })