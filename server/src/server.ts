import cors from 'cors';
import express from 'express';
import routes from './routes';
import path from 'path';
import { errors } from 'celebrate'
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

//Função express.static serve para mostrar arquivos staticos
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());
app.listen(3333);