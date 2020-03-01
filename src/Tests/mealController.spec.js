import app from "../../app";
import User from "../Models/userModel";
import signToken from "./Token";
import chai from 'chai';
import chaiHttp from 'chai-http';

const urlPrefix = '/api/v1/meals';
const {expect} = chai;

chai.use(chaiHttp);

let token ;

describe("Create Meals", () => {
   beforeEach(async()=>{
    token = await signToken("5e4fa48ef4fe0713482ae34f");
   });
  it("It should create a meal", done => {
    chai
      .request(app)
      .get(`${urlPrefix}/`)
      .set("Authorization","Bearer "+token)
      .end((err, res) => {
        expect(res).to.have.status(401);
        // expect(res.body.status).to.equals("success");
        // expect(res.body.message).to.equals("success");
        done();
      });
      
  });
});
