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

We can then do your assertions

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

