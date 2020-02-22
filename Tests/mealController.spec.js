import app from "./../app";
import User from "./../Models/userModel";
import signToken from "./Token";
import supertest from "supertest";

const request = supertest(app);
let token;
const url = ""
 describe("Retrieve Meals", ()=>{

    beforeAll( (done)=>{
        const user = User.findOne({ email: 'nehe@gmail.com'});
        token = signToken(user._id);
        done();
    });

    test("should return all meals",(done)=>{
        request
        .get("/api/v1/memals/")
        .set("Authorization")
        .expect(200)        
        done();
    });

 });




 


