import express from 'express';

const app = express();

app.use(express.json()); // middleware

/**
 * GET / POST / PUT / PATCH / DELETE 
 */

/**
 * 
 * TIPOS DE PARÂMETROS
 * 
 * Route Params => Identificar um recurso editar / deletar / buscar
 * Query Params => Paginação / filtro
 * Body params => Os objetos inserção / alteração (JSON)
 * 
 */


app.get('/courses', (request, response) => {
	const query = request.query;
	console.log(query);
	return response.json([ 'Curso 1', 'Curso 2', 'Curso 3' ]);
});

app.post('/courses', (request, response) => {
	const body = request.body;
	console.log(body);
	return response.json([ 'Curso 1', 'Curso 2', 'Curso 3', 'Curso 4', ]);
});

app.listen(3333, () => {
	console.log('🚀🚀 Server Started!!');
});
