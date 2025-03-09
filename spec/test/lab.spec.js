const supertest = require("supertest");
const app = require("../..");
const { clearDatabase } = require("../../db.connection");

let req = supertest(app);

describe("lab testing:", () => {
  describe("users routes:", () => {
    let newUser, userInDB;
    beforeAll(async () => {
      newUser = {
        name: "Rahma",
        email: "Rahma@gmail.com",
        password: "123456",
      };
      let signup = await req.post("/user/signup").send(newUser);
      userInDB = signup.body.data;
    });

    it("req to get(/user/search) ,expect to get the correct user with his name", async () => {
      let res = await req.get("/user/search").query({ name: "Rahma" });
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(userInDB);
    });
    it("req to get(/user/search) with invalid name ,expect res status and res message to be as expected", async () => {
      let res = await req.get("/user/search").query({ name: "mohamed" });
      expect(res.status).toBe(404);
      expect(res.body.message).toContain("no user");
    });
  });

  ///////////////////////////////////////////////////////////////////////////////
  describe("todos routes:", () => {
    let newUser, token, createdTodo, userIdInDB;

    beforeAll(async () => {
      newUser = {
        name: "mohamed",
        email: "mohamed@gmail.com",
        password: "123456",
      };
      let userRegister = await req.post("/user/signup").send(newUser);

      userIdInDB = userRegister.body.data._id;

      let loginuser = await req.post("/user/login").send(newUser);

      token = loginuser.body.data;

      let todo = await req
        .post("/todo")
        .send({ title: "shopping" })
        .set({ authorization: token });
      createdTodo = todo.body.data;
    });

    it("req to patch( /todo/) with id only ,expect res status and res message to be as expected", async () => {
      let res = await req
        .patch("/todo/" + createdTodo._id)
        .set({ authorization: token });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("must provide title and id to edit todo");
    });

    it("req to patch( /todo/) with id and title ,expect res status and res to be as expected", async () => {
      let res = await req
        .patch("/todo/" + createdTodo._id)
        .send({ title: "swimming" })
        .set({ authorization: token });
      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });

    it("req to get( /todo/user) ,expect to get all user's todos", async () => {
      let res = await req.get("/todo/user").set({ authorization: token });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
    });


  });

  afterAll(async () => {
    await clearDatabase();
  });
});
