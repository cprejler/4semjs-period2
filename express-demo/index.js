const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json());
const courses = [
	{ id: 1, name: 'math'},
	{ id: 2, name: 'biology'}
];
app.get('/', (req, res) =>{
	res.send('hello world');
});

app.get('/api/courses', (req, res) =>{
	res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
	let course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) res.status(404).send('The course with the given paramater not found');
	res.send(course);
});

app.post('/api/courses', (req, res) =>{
	const schema = Joi.object( {
		name: Joi.string().min(3).required()
	});

	const result = 	schema.validate(req.body, schema.name);

	if(result.error){
		//400 bad reqyest
		res.status(400).send(result.error.details[0].message);
		return;
	}
	const course = {
		id: courses.length +1,
		name: req.body.name
	};
	courses.push(course);
	res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
	let course = courses.find(c => c.id === parseInt(req.params.id));
	if (!course) res.status(404).send('The course with the given paramater not found');

	const schema = Joi.object( {
		name: Joi.string().min(3).required()
	});

	const result = 	schema.validate(req.body, schema.name);
	if(result.error){
		//400 bad reqyest
		res.status(400).send(result.error.details[0].message);
		return;
	}
	course.name = req.body.name;

	res.send(course);
});


// PORT Env Variable

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));


