import express, { json } from 'express';
import cors from 'cors';
import cookieParse from 'cookie-parser';
import sessionProfile from './middlewares/checkToken.ts';
import { rateLimit } from 'express-rate-limit'
const app = express();

// routes
import routerMessage from './modules/message/router.ts';
import routerOrder from './modules/order/routeOrder.ts';
import loginRoute from './modules/login/loginRouter.ts';
import categoryRoute from './modules/category/cRoute.ts';
import productRouter from './modules/products/routeProducts.ts';
import path from 'path';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por ventana (`windowMs`) por IP
    standardHeaders: true, // Devuelve los headers estándar de rate limit (`RateLimit-*`)
    legacyHeaders: false, // Desactiva los headers antiguos (`X-RateLimit-*`)
    message: {
        success: false,
        error: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo después de 15 minutos.'
    }
});

// middlewares
app.use(json());
app.use(cookieParse());
const corsOptions = {
    origin: ['http://localhost:5173', 'https://mimandao.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// 1. CORS siempre de primero
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Responde explícitamente a todos los preflights

// 2. Resto de middlewares
app.use(json());
app.use(cookieParse());

app.use('/images', express.static(path.join('./src', 'images')));
app.use(limiter)

app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello Its Meee... The api....'})
})

const mainRoot = '/api';
app.use('/api/', limiter);
app.use(mainRoot, loginRoute);
app.use(mainRoot,sessionProfile, routerMessage);
app.use(mainRoot,sessionProfile, routerOrder);
app.use(mainRoot,sessionProfile, categoryRoute);
app.use(mainRoot,sessionProfile, productRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server running into the port ${PORT}. http://localhost:${PORT}`);
}) 