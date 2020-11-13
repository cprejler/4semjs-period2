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

TBD

### Explain a setup for Express/Node/Test/Mongo-DB development with Typescript, and how it handles "secret values",  debug and testing.

TBD

