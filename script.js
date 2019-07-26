const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

const customers = [
    {title: 'Kirtan', id:1},
    {title: 'Tom', id: 2},
    {title: 'Harry', id: 3},
    {title: 'Josh', id: 4},
    {title: 'Tyler', id: 5}
]

app.get('/', (req, res) => {
    res.send("Welcome to REST");
});

app.get('/api/customers', (req, res) => {
    res.send(customers);
});

app.get('/api/customers/:id', (req,res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color:darkred;">Ooops... Resource not found</h2>');     
    res.send(customer);
});

app.post('/api/customers', (req, res) => {
    const {error} = ValidateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const customer = {
        id: customers.length + 1,
        title: req.body.title
    };
    customers.push(customer);
    res.send(customer);
})

app.put('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color:darkred;">Ooops... Resource not found</h2>');
    const { error } = ValidateCustomer(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    } 
    customer.title = req.body.title;
    res.send(customer);
});

app.delete('/api/customers/:id', (req, res) => {
    const customer = customers.find(c => c.id === parseInt(req.params.id));
    if (!customer) res.status(404).send('<h2 style="font-family: Malgun Gothic; color:darkred;">Ooops... Resource not found</h2>');
    const index = customers.indexOf(customer);
    customers.splice(index, 1);
    customers.length-1;
    res.send(customer);
});

function ValidateCustomer(customer) {
    const schema = {
        title: Joi.string().min(3).required()
    };
    return Joi.validate(customer, schema);
}

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listing to port ${port}..`));