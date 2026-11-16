import express from 'express';
const app = express();
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello ITss meee.' });
});
app.listen(3000, () => {
    console.log('Server running into the port 3000. http://localhost:3000');
});
//# sourceMappingURL=index.js.map