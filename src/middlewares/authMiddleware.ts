import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

const router = Router();

const customers : any = [];

function verifyIfExistsAccountCPF(request:Request, response:Response, next:NextFunction) {
  const { cpf } : any = request.headers;

  const customer = customers.find((customer: { cpf: any; }) => customer.cpf === cpf);
  
  if (!customer) {
    return response.status(400).json({ error: 'Customer not found'})
  }

  request.customer = customer;
  
  return next();
};

function getBalance(statement: any[]) {
  const balance = statement.reduce((acc: number, operation: { type: string; amount: number; }) => {
    if (operation.type === 'credit') {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
    }, 0);
    return balance;
}

router.post('/account', (request:Request, response:Response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customer : any) => customer.cpf === cpf
    );

    if (customerAlreadyExists) {
      return response.status(400).json({ error: "Customer already exists!"});
    }
  
  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

router.get('/statement', verifyIfExistsAccountCPF, (request:Request, response:Response) => {
  const { customer } = request;
  return response.json(customer.statement);
});

router.post('/deposit', verifyIfExistsAccountCPF, (request:Request, response:Response) => {
  const { description, amount } = request.body;

  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }
  customer.statement.push(statementOperation);
  return response.status(201).send();
})

router.post('/withdraw', verifyIfExistsAccountCPF, (request:Request, response:Response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return response.status(400).json({ error: "insufficient funds!"});
  }
  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit',
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

router.get('/statement/date', verifyIfExistsAccountCPF, (request:Request, response:Response) => {
  const { customer } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + ' 00:00');

  //const statement = customer.statement.filter((statement: { created_at: { toDateString: () => string; }; }) => 
  //statement.created_at.toDateString() === new Date(dateFormat).toDateString());

  const statement = customer.statement.filter((statement : any) => statement.created_at.toDateString() === 
  new Date(dateFormat).toDateString());
  
  return response.json(statement);
});

router.put('/account', verifyIfExistsAccountCPF, (request:Request, response:Response) => {
  const { name } = request.body;
  const { customer } = request;

  customer.name = name;
  return response.status(201).send();
});

router.get('/account', verifyIfExistsAccountCPF, (request:Request, response:Response) => {
  const { customer } = request;

  return response.json(customer);
});

router.delete('/account', verifyIfExistsAccountCPF, (request:Request, response:Response) => {
  const { customer } = request;

  //splice
  customers.splice(customer, 1);
  return response.status(200).json(customers);
});

router.get('/balance', verifyIfExistsAccountCPF, (request:Request, response:Response) => {
  const { customer } = request;

  const balance = getBalance(customer.statement);
  return response.json(balance);
})

export { router };