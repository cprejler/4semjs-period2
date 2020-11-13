# 4semjs-period2

## Learning Goals

### Explain Pros & Cons in using Node.js + Express to implement your Backend compared to a strategy using, for example, Java/JAX-RS/Tomcat
 **Node:**
  - Is great at at handling a lot of concurrent requests because of its asynchronous event handling
  - Share the same piece of code with both server and client side.
  - A big drawback is node's lack of ability to do CPU heavy tasks
  
 
 **Java:**
 
 - More mature development stack than node.
 - 


### Explain the difference between Debug outputs and ApplicationLogging. What’s wrong with console.log(..) statements in our backend code.

The problem with console logging is that it only shows when the application is running. By using ApplicationLogging, we log the events on the server, so we are able to log at the logs and diagnose the problem after it has occured.

### Demonstrate a system using application logging and environment controlled debug statements.

```javascript
import winston from "winston";
import * as expressWinston from "express-winston";
import path from "path"

let requestLoggerTransports: Array<any> = [
  new winston.transports.File({ filename: path.join(process.cwd(), "logs", "request.log") })
]
let errorLoggerTransports: Array<any> = [
  new winston.transports.File({ filename: path.join(process.cwd(), "logs", "error.log") })
]
if (process.env.NODE_ENV !== 'production') {
  requestLoggerTransports.push(new winston.transports.Console());
  errorLoggerTransports.push(new winston.transports.Console());
}
let requestLogger = expressWinston.logger({
  transports: requestLoggerTransports,
  format: winston.format.combine(
    winston.format.colorize(), winston.format.json()
  ),
  expressFormat: true,
  colorize: false
})

let errorLogger = expressWinston.errorLogger({
  transports: errorLoggerTransports,
  format: winston.format.combine(
    winston.format.colorize(), winston.format.json()
  )
})
```

### Explain, using relevant examples, concepts related to testing a REST-API using Node/JavaScript/Typescript + relevant packages 
Using the Chai framework to test endpoints:
```javascript

it("Should get the message Hello", async () => {
    const result = await fetch(`${URL}/api/dummy`).then(r => r.json());
    expect(result.msg).to.be.equal("Hello")
  })

  it("Should get three users", async () => {
    const result = await fetch(`${URL}/api/users`).then(r => r.json());
    expect(result.length).to.be.equal(3);

  })
  it("Should Add the user Jan", async () => {
    const newUser = { name: "Jan Olsen", userName: "jo@b.dk", password: "secret", role: "user" }
    const config = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    }
    const result = await fetch(`${URL}/api/users`, config).then(r => r.json());
    expect(result.status).to.be.equal("User was added")
  })

```



### Explain a setup for Express/Node/Test/Mongo-DB development with Typescript, and how it handles "secret values",  debug and testing.

Before each test we insert the test data in a database. We use BCrypt to hash the passwords

```javascript

beforeEach(async () => {

    if (userCollection === null) {
      throw new Error("userCollection not set")
    }
    await userCollection.deleteMany({})
    const secretHashed = await bryptAsync("secret");
    await userCollection.insertMany([
      { name: "Peter Pan", userName: "pp@b.dk", password: secretHashed, role: "user" },
      { name: "Donald Duck", userName: "dd@b.dk", password: secretHashed, role: "user" },
      { name: "admin", userName: "admin@a.dk", password: secretHashed, role: "admin" }
    ])
  })
```

We can then do the assertions

```javascript

  it("Should Add the user Kurt", async () => {
    const newUser = { name: "Jan Olsen", userName: "jo@b.dk", password: "secret", role: "user" }
    try {
      const status = await UserFacade.addUser(newUser);
      expect(status).to.be.equal("User was added")

      if (userCollection === null) {
        throw new Error("Collection was null")
      }
      const jan = await userCollection.findOne({ userName: "jo@b.dk" })
      expect(jan.name).to.be.equal("Jan Olsen")
    } catch (err) {
      debug(err)
    } finally { }
  })
  
    it("Should remove the user Peter", async () => {
    try {
      const status = await UserFacade.deleteUser("pp@b.dk");
      expect(status).to.be.equal("User was deleted");

      if (userCollection === null) {
        throw new Error("Collection was null");
      }

      const users = await UserFacade.getAllUsers();
      expect(users.length).to.be.equal(3)

    } catch (error) {
      debug(error);  
    }

  })
  
```

### Explain, preferably using an example, how you have deployed your node/Express applications, and which of the Express Production best practices you have followed.

### Explain possible steps to deploy many node/Express servers on the same droplet, how to deploy the code and how to ensure servers will continue to operate, even after a droplet restart.

### Explain, your chosen strategy to deploy a Node/Express application including how to solve the following deployment problems:

**- Ensure that you Node-process restarts after a (potential) exception that closed the application**

**- Ensure that you Node-process restarts after a server (Ubuntu) restart**

**- Ensure that you can run “many” node-applications on a single droplet on the same port (80)**


### Explain, using relevant examples, the Express concept; middleware.

Middleware in express are functions you can use to make a request/response cycle. 

For example we have this basic authentication function:

```javascript
var authMiddleware = async function (req: any, res: Response, next: Function) {
  var credentials = auth(req)

  try {
    if (credentials && await UserFacade.checkUser(credentials.name, credentials.pass)) {
      
      const user = await UserFacade.getUser(credentials.name)
      req.userName = user.userName;
      req.role = user.role;
      return next();
    }
  } catch (err) {
    console.log("UPS")
  }
  res.statusCode = 401
  res.setHeader('WWW-Authenticate', 'Basic realm="example"')
  res.end('Access denied')
}

```

The key function argument here is the next argument. If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

The authentication middleware can then be used to log a user in to a webpage. If the user doesn't enter a wrong username/password combination, it returns next()
and the request-response cycle continues and we can send the user to their profile page for example.

We can do the same thing for logging.


### Explain, using relevant examples, your strategy for implementing a REST-API with Node/Express  + TypeScript and demonstrate how you have tested the API.

Here we use chai to test our endpoints:

```javascript

describe("Create/Update Comments", function () {
  //Change mocha's default timeout, since we are using a "slow" remote database for testing
  this.timeout(Number(process.env["MOCHA_TIMEOUT"]));
  let URL: string;
  before((done) => {
    process.env["PORT"] = TEST_PORT;
    process.env["SKIP_AUTHENTICATION"] = "1";
    process.env["DB_NAME"] = "semester_case_test"
    server = require("../src/app").server;
    URL = `http://localhost:${process.env.PORT}`;
    done();
  })


  beforeEach(async function () {
    //Observe, no use of facade, but operates directly on connection
    const client = await getConnectedClient();
    const db = client.db(process.env.DB_NAME)

    const usersCollection = db.collection("users")
    await usersCollection.deleteMany({})
    const secretHashed = await bryptAsync("secret");
    const status = await usersCollection.insertMany([
      { name: "Peter Pan", userName: "pp@b.dk", password: secretHashed, role: "user" },
      { name: "Donald Duck", userName: "dd@b.dk", password: secretHashed, role: "user" },
      { name: "admin", userName: "admin@a.dk", password: secretHashed, role: "admin" }
    ])
  })

  after(async () => {
    // DONT CALL THIS. Will make additonal tests fail -->server.close();
  })

  it("Should get the message Hello", async () => {
    const result = await fetch(`${URL}/api/dummy`).then(r => r.json());
    expect(result.msg).to.be.equal("Hello")
  })

  it("Should get three users", async () => {
    const result = await fetch(`${URL}/api/users`).then(r => r.json());
    expect(result.length).to.be.equal(3);

```





### Explain, using relevant examples, how to test JavaScript/Typescript Backend Code, relevant packages (Mocha, Chai etc.) and how to test asynchronous code.

Here we use Chai to test our backend db code.

```javascript
beforeEach(async () => {
    const hash: string = await bryptAsync("secret");

    UserFacade.users = [
      { name: "Peter Pan", userName: "pp@b.dk", password: hash, role: "user" },
      { name: "Donald Duck", userName: "dd@b.dk", password: hash, role: "user" },
      { name: "admin", userName: "admin@a.dk", password: hash, role: "admin" }
    ]
  })

  after(async () => {
    server.close();
  })

  it("Should get the message Hello", async () => {
    const result = await fetch(`${URL}/api/dummy`).then(r => r.json());
    expect(result.msg).to.be.equal("Hello")
  })

  it("Should get three users", async () => {
    const result = await fetch(`${URL}/api/users`).then(r => r.json());
    expect(result.length).to.be.equal(3);

```

### Explain, generally, what is meant by a NoSQL database.

NoSQL databases, or non-relational databases, can be document based, graph databases, key-value pairs, or wide-column stores. NoSQL databases don’t require any predefined schema, allowing you to work more freely with “unstructured data.” 

### Explain Pros & Cons in using a NoSQL database like MongoDB as your data store, compared to a traditional Relational SQL Database like MySQL.

Relational databases are vertically scalable, but usually more expensive, whereas the horizontal scaling nature of NoSQL databases is more cost-efficient.

Horizontal scaling means scaling by adding more machines to your pool of resources (also described as “scaling out”), whereas vertical scaling refers to scaling by adding more power (e.g. CPU, RAM) to an existing machine (also described as “scaling up”).

Scaling a NoSQL database is much cheaper, compared to a relational database, because you can add capacity by scaling horizontally over cheap, commodity servers. 

NoSQL databases tend to be more a part of the open-source community. Relational databases are typically closed source with licensing fees baked into the use of their software. 

https://www.section.io/blog/scaling-horizontally-vs-vertically/

### Explain about indexes in MongoDB, how to create them, and demonstrate how you have used them.



### Explain, using your own code examples, how you have used some of MongoDB's "special" indexes like TTL and 2dsphere and perhaps also the Unique Index.

### Demonstrate, using a REST-API designed by you, how to perform all CRUD operations on a MongoDB

### Explain, using a relevant example, a full JavaScript backend including relevant test cases to test the REST-API (not on the production database)


