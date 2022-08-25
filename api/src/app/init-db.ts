import path from "path";
import { User } from "../entities/user";
import { createConnection, Db, getConnection } from "typeorm";
import { AppContext } from "./init-context";
import { Post } from "../entities/Post";
import { __LEDGERS_DB__ } from "./app-constants";
import argon2 from "argon2";

const init = async (_: AppContext) => {
  console.log("init db:", __LEDGERS_DB__);
  const conn = await createConnection({
    type: "postgres",
    url: __LEDGERS_DB__,
    logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "../migrations/*")],
    entities: [User, Post],
  });

  //TODO: move this to use seed library
  await seedUserData();
  //await seedPostData("vn1@gmail.com");
  //await cleanDB();
  console.log("init db: done");
};

const seedUserData = async () => {
  const uList = [
    {
      email: "vn1@gmail.com",
      firstName: "V1",
      lastName: "N1",
      password: "aaa",
      posts: [
        { title: "title-first", text: "this is our first post" },
        { title: "title-two", text: "this is our seccond post" },
        { title: "title-three", text: "this is our third post" }, 
      ]
    },
    {
      email: "vn2@gmail.com",
      firstName: "V2",
      lastName: "N2",
      password: "aaa",
      posts:[],
    },
  ];
  for (var u of uList) {
    let user = await User.findOne({
      where: {
        email: u.email,
      },
    });
    if (!user) {
      const hashedPWD = await argon2.hash(u.password);
      user = User.create({
        username: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        password: hashedPWD,
      });
    }
    for ( var p of u.posts ) {
      const post = await Post.findOne({
        where: {
          title: p.title,
        },
      });
      if (!post) {
        Post.create({ creator: user, ...p }).save();
      }
    }
  }
};
// const seedPostData = async (email: string) => {
//   const user = await User.findOne({
//     where: {
//       email: email,
//     },
//   });
//   if (!user) {
//     console.log("user not found:", email);
//   }
//   const posts = [
//     { title: "title-first", text: "this is our first post" },
//     { title: "title-two", text: "this is our seccond post" },
//     { title: "title-three", text: "this is our third post" },
//   ];
//   for (var p of posts) {
//     const post = await Post.findOne({
//       where: {
//         title: p.title,
//       },
//     });
//     if (!post) {
//       Post.create({ creator: user, ...p }).save();
//     }
//   }
// };

const cleanDB = async () => {
  await getConnection().createQueryBuilder().delete().from(Post).execute();
};

export default init;
