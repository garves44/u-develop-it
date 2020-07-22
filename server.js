const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//EXPRESS MIDDLEWARE
app.use(express.urlencoded({ express: false}));
app.use(express.json());

//GET ROUTE FOR ROOT
app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

//Default response for any (NOTFOUND) requests Catch all
app.use((req, res) => {
    res.status(404).end();
});

//APP LISTENER
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});