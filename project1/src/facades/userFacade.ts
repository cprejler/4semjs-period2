import { nextTick } from "process";
import bcrypt from "bcryptjs";
interface IGameUser {id: number, name: string, userName: string, password: string, role: string }

const users: Array<IGameUser> = [];

class UserFacade {
    static addUser(user: IGameUser): boolean {
        /*Info: Import bcryptjs and (npm install bcryptjs) and hash before you store */
        
        bcrypt.genSalt(10, function (err: any, salt: any) {
            if (err) return false;
            bcrypt.hash(user.password, salt,(err: any, hash: string)=> {
                user.password = hash;
            })
        });
        
        users.push(user)
        return true;
    }
    static deleteUser(id: number): boolean {
        let user = users.find(u => u.id === id);
        if(!user) throw new Error("Couldn't find users with that id");
        for (var i = users.length - 1; i >= 0; --i) {
            if (users[i].id == id) {
                users.splice(i, 1);
            }
        }
        return true;
    }
    static getAllUsers(): Array<IGameUser> { 
        return users;
     }
    
    static getUser(userId: number): IGameUser {
        let user = users.find(u => u.id === userId);
        if(!user) throw new Error("Couldn't find users with that id");
        return user;
        
    }
    static checkUser(userName: string, password: string): boolean {
        /*Use bcrypjs's compare method */
        users.forEach(user => {
            if(user.name === userName){
                bcrypt.compare(password, user.password).then((isMatch: any) =>{
                    if(isMatch){
                        return true;
                    }
                    else{
                        return false;
                    }
                })
            }
        });
        throw new Error("Couldn't find any users with that username");
        
        
    }

}

export {UserFacade}
export {IGameUser}