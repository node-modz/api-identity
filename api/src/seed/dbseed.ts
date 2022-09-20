import initApp from "../app/init-context";
import minimist from "minimist";
import { ActivityType, BankActivity } from "../entities/BankActivity";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import moment from "moment";
import argon2 from "argon2";
import { createConnection, Db, getConnection, QueryRunner } from "typeorm";
import csv from "csv-parser";
import fs from "fs";
import { Tenant } from "../entities/Tenant";

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  console.log("start dbseed:", __dirname);
  console.dir(argv);

  const appCtxt = initApp();
  for (const file of ["../app/init-db"]) {
    await require(file).default(appCtxt);
  }

  await doSeed(argv);

  console.log("dbseed done");
};

main().catch((e) => {
  console.error("main error:", e);
});

const doSeed = async (argv: minimist.ParsedArgs) => {
  if (argv["clean"]) {
    await cleanDB();
  }

  if (argv["users"]) {
    await seedUserData();
  }

  if (argv["tenants"]) {
    await loadCSV(
      "seed-data/tenants/tenants.csv",
      {
        Description: "description",
        ShortName: "name",
      },
      async (obj) => {
        console.log(obj);
        return Tenant.create({
          name: obj["name"],
          description: obj["description"],
        }).save();
      }
    );
  }

  if (argv["activity"]) {
    await loadBankActivityFiles();     
  }
};

const loadBankActivityFiles = async () => {
  const files = fs.readdirSync("seed-data/bank/")
  console.log("all files;", files)
  for (let i=0; i<files.length;i++) {
    let file=files[i]
    if (file.endsWith(".csv")) {
      await seedBankActivity("seed-data/bank/" + file);
    }
  };
}
export const seedBankActivity = async (file: string) => {
  const dataList: {
    activityDate: Date;
    amount: number;
    activityType: ActivityType;
    description: string;
  }[] = [];

  //TODO: i was hoping that this would be sequential, but it doesn't look like it is
  // - it became sequential after returning the promise & await on the outside.

  const promise = new Promise((resolve, _) => {
    console.log("Loading file:", file);
    fs.createReadStream(file)
      .pipe(csv({}))
      .on("data", async (data: any) => {
        if (data["Tran Date"] === "Tran Date") {
          // header line
        } else {
          const activity = {
            activityDate: moment(data["Tran Date"], "DD-MM-YYYY").toDate(),
            amount:
              data["CR"].trim().length > 0
                ? parseFloat(data["CR"].trim())
                : parseFloat(data["DR"].trim()),
            activityType:
              data["CR"].trim().length > 0
                ? ActivityType.Deposit
                : ActivityType.Withdrawal,
            description: data["PARTICULARS"],
          };
          dataList.push(activity);
        }
      })
      .on("end", async () => {
        for (var activity of dataList) {
          //console.log(activity);
          const ba = await BankActivity.create(activity).save();
        }
        resolve("completed");
      });
  }).then((val) => {
    console.log("Loading file:", file, ": ", val);
  });

  return promise
};

export const seedUserData = async () => {
  console.log("loading users:")
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
      ],
    },
    {
      email: "vn2@gmail.com",
      firstName: "V2",
      lastName: "N2",
      password: "aaa",
      posts: [],
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

      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: u.email,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          password: hashedPWD,
        })
        .execute();
      user = result.raw[0];
    }
    for (var p of u.posts) {
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
  console.log("loading usres:done")
};

export const cleanDB = async () => {
  console.log("clean db:")
  await getConnection()
    .createQueryBuilder()
    .delete()
    .from(BankActivity)
    .execute();
  await getConnection().createQueryBuilder().delete().from(Post).execute();
  await getConnection().createQueryBuilder().delete().from(User).execute();
  await getConnection().createQueryBuilder().delete().from(Tenant).execute();
};

export const loadCSV = async (
  file: string,
  fieldMap: any,
  callback: (obj: any) => Promise<any>
) => {
  let keys = Object.keys(fieldMap);
  let prop = fieldMap[keys[0]];
  const dataList: any[] = [];

  const promise = new Promise((resolve, _) => {
    console.log("Loading file:", file);
    fs.createReadStream(file)
      .pipe(csv({}))
      .on("data", async (data: any) => {
        if (data[prop] === prop) {
          // header line
        } else {
          let obj: any = {};
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i]; //ShortName, Description
            var propMap = fieldMap[key]; //name, description
            obj[propMap] = data[key];
          }
          dataList.push(obj);
        }
      })
      .on("end", async () => {
        //TODO: this goes off async.. need to really figure out the async/await model of node.
        for (var obj of dataList) {
          await callback(obj);
        }
        resolve("completed");
      });
  }).then((val) => {
    console.log("Loading file:", file, ": ", val);
  });

  // TODO: neither of the following seem to wait for promise to finish
  // await promise;
  // console.log("promise: done:", file);

  return promise
};

// const result = await  getConnection()
// .createQueryBuilder()
// .insert()
// .into(BankActvity)
// .values(activity)
// .execute();
