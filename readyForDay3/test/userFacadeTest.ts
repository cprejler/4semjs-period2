import UserFacade from '../src/facades/user';
import { expect } from "chai";
import { ApiError } from '../src/errors/apiError';
import { bryptAsync, bryptCheckAsync } from '../src/utils/bcrypt-async-helper'
import IGameUser from '../src/interfaces/GameUser'
import { assert } from 'console';

describe("Verify the UserFacade", () => {

  beforeEach(async function() {
     const hash: string = await bryptAsync("secret");
    UserFacade.users = [
      { name: "Peter Pan", userName: "pp@b.dk", password: hash, role: "user" },
      { name: "Donald Duck", userName: "dd@b.dk", password: hash, role: "user" },
      { name: "admin", userName: "admin@a.dk", password: hash, role: "admin" }
    ]
  })

})


it("Should Add the user Kurt", async () => {
  const newUser = { name: "Jan Olsen", userName: "jo@b.dk", password: "secret", role: "user" }
  try {
    const status = await UserFacade.addUser(newUser);
    const jan = await UserFacade.getUser("jo@b.dk");
    const passwordOK = await bryptCheckAsync("secret", jan.password);
    expect(status).to.be.equal("User was added")
    expect(UserFacade.users.length).to.equal(4)
  } catch (err) {
    expect.fail("Seems like password was not hashed correctly")
  } finally { }
})
it("Should remove the user Peter", async () => {
  try {
    const status = await UserFacade.deleteUser("pp@b.dk")
    expect(status).to.be.equal("User was deleted")
    expect(UserFacade.users.length).to.equal(3)
  } catch (err) {
    expect.fail("Something went wrong deleting the user")
  } finally { }
})
it("Should get three users", async () => {
  try {
    const users = await UserFacade.getAllUsers();
    expect(users.length).to.equal(3);
  } catch (error) {
    console.log(error)
    
  }finally{
  }
})

it("Should find Donald Duck", async () => {
  try {
    const user = await UserFacade.getUser("dd@b.dk")
    expect(user.name).to.equal("Donald Duck");
  } catch (error) {
    console.log(error);
    
  }
})
it("Should not find xxx.@.b.dk", async () => {
  try {
    const user = await UserFacade.getUser("xxx.@.b.dk");
    expect.fail("User Not Found");
  } catch (error) {
    console.log(error);
    
  }
})

