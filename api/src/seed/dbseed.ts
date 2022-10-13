import initApp from "../app/init-context";
import minimist from "minimist";
import { ActivityType, BankActivity } from "../entities/accounting/BankActivity";
import { Post } from "../entities/core/Post";
import moment from "moment";
import argon2 from "argon2";
import { createConnection, Db, getConnection, QueryRunner } from "typeorm";
import csv from "csv-parser";
import fs from "fs";
import { Tenant, User, } from "../entities/core/index";
import {
  Payment,
  W3Chain,
  W3Ledger,
  W3LedgerAccount,
  W3LedgerAccountActivity,
  __LEDGER_RULES__
} from "../entities/dacchain/index";
import { W3ChainService } from "../services/dacchain/W3ChainService";

const uList = [
  {
    email: "vn1@gmail.com", firstName: "V1", lastName: "N1", password: "aaa",
    posts: [
      { title: "title-first", text: "this is our first post" },
      { title: "title-two", text: "this is our seccond post" },
      { title: "title-three", text: "this is our third post" },
    ],
  },
  { email: "vn2@gmail.com", firstName: "V2", lastName: "N2", password: "aaa", posts: [], },
  { email: "kn1@gmail.com", firstName: "K1", lastName: "N1", password: "aaa", posts: [], },
  { email: "hn1@gmail.com", firstName: "H1", lastName: "N1", password: "aaa",posts: [],},
  { email: "ad1@gmail.com", firstName: "A1",lastName: "D1", password: "aaa", },
  { email: "payroll-in@wavelabs.ai",firstName: "WL",lastName: "PVT. LTD",password: "aaa", },
  { email: "chain.reserve@dacchain.com",firstName: "DC",lastName: "reserve",password: "aaa", },
];

const userTenants = [
  { username: 'vn1@gmail.com', tenantName: 't-VRN' },
  { username: 'kn1@gmail.com', tenantName: 't-KITTY' },
  { username: 'hn1@gmail.com', tenantName: 't-HITHA' },
  { username: 'ad1@gmail.com', tenantName: 't-AD' },
  { username: 'payroll-in@wavelabs.ai', tenantName: 't-WaveLabs' },
  { username: 'chain.reserve@dacchain.com', tenantName: 't-DACChain' },
]


const main = async () => {
  const argv = minimist(process.argv.slice(2));
  console.log("start dbseed:", __dirname);
  console.dir(argv);

  const appCtxt = initApp("db-seed");
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

  if (argv["dacchain"]) {
    await seedDACChain()
  }
  if (argv["dact"]) {
    await dacTest();
  }
};

const loadBankActivityFiles = async () => {
  const files = fs.readdirSync("seed-data/bank/")
  console.log("all files;", files)
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
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
    if (u.posts != undefined ) {
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
  }
  console.log("loading usres:done")
};

export const cleanDB = async () => {
  console.log("clean db:")
  await getConnection().createQueryBuilder().delete().from(W3LedgerAccountActivity).execute();
  await getConnection().createQueryBuilder().delete().from(W3LedgerAccount).execute();
  await getConnection().createQueryBuilder().delete().from(W3Ledger).execute();
  await getConnection().createQueryBuilder().delete().from(W3Chain).execute();
  await getConnection().createQueryBuilder().delete().from(BankActivity).execute();
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

type Transaction = { 
  from:string, to:string, 
  ledgerRefId:string, 
  txnType:string, 
  txnRefId:string,  
  txnDate?:Date,       
  payment:Payment
}

const dacTest = async() => {
  const chainService = new W3ChainService()
  const vn1Chain = await chainService.findChainByEmail('vn1@gmail.com');
  const kn1Chain = await chainService.findChainByEmail('kn1@gmail.com');
  const ledger = await chainService.findLedger(vn1Chain!,kn1Chain!?.chaninId,"loan:id-xxx-yyy")
  const activity = await chainService.findActivityByTxnRef(ledger!,"loan:txn:id:1")

  console.log("activity:",activity)
}

const seedDACChain = async () => {
  const userRepo = getConnection().getRepository(User)
  const chainRepo = getConnection().getRepository(W3Chain)
  const ledgerRepo = getConnection().getRepository(W3Ledger)
  const acctRepo = getConnection().getRepository(W3LedgerAccount)
  const chainService = new W3ChainService()
   
  for (var ut of userTenants) {
    const tenant = await Tenant.findOne({ where: { name: ut.tenantName } })
    const user = await User.findOne({
      where: { username: ut.username },
      relations: ["tenant"]
    })

    if( user!=undefined){
      if (tenant != null && !user?.tenant) {
        console.log("associating user: ", user.email, " with: ", tenant.name)
  
        user.tenant = tenant
        await userRepo.save(user)
      }
      /**
       * creat a chain for user
       */
      let chain = await chainService.findChainByUser(user)

      if (chain == undefined) {
        console.log("  creating chain: ", user.username);
        chain = await chainService.createNewChain(user)
      }

      let walletLedger = await chainService.findWalletLedger(chain)

      if (walletLedger == undefined) {
        /**
         * create wallets
         */
        await chainService.createWalletLedger(chain!)
      }
    }
    
  }
  
  const transactions: Transaction[] = [
    {
      ledgerRefId:"wallet", from:'chain.reserve@dacchain.com', to:'chain.reserve@dacchain.com', 
      txnRefId:"loan.issue:chain.reserve@dacchain.com:id:1", txnType:"loan.issue", 
      txnDate: new Date("2022-01-01T14:00:00"),
      payment:{
        principal:{amount:1000000000, currency:'USD',description:'seed the chain with 1B'}
      }
    },
    {
      ledgerRefId:"peer-to-peer", from:'chain.reserve@dacchain.com', to:'vn1@gmail.com', 
      txnRefId:"seed.xfr:chain.reserve@dacchain.com:id:1", txnType:"seed.xfr", 
      txnDate: new Date("2022-02-01T14:00:00"),
      payment:{
        principal:{amount:40000, currency:'USD',description:'seed the chain with 1B'}
      }
    },
    {
      ledgerRefId:"peer-to-peer", from:'chain.reserve@dacchain.com', to:'payroll-in@wavelabs.ai', 
      txnRefId:"seed.xfr:chain.reserve@dacchain.com:id:2", txnType:"seed.xfr", 
      txnDate: new Date("2022-02-01T14:00:00"),
      payment:{
        principal:{amount:60000, currency:'USD',description:'seed the chain with 1B'}
      }
    },
    {
      ledgerRefId:"loan:id-xxx-yyy", from:'vn1@gmail.com', to:'kn1@gmail.com',       
      txnRefId:"loan.issue:vn1@gmail.com:id:1",   txnType:"loan.issue", 
      txnDate: new Date("2022-03-01T14:00:00"),
      payment:{
        principal:{amount:1000, currency:'USD',description:'loan issued for loan:id-xxx-yyy'}
      }
    },
    {
      ledgerRefId:"peer-to-peer", from:'vn1@gmail.com', to:'kn1@gmail.com',       
      txnRefId:"gift.issue:vn1@gmail.com:id:1", txnType:"gift.issue",            
      txnDate: new Date("2022-04-01T14:00:00"),
      payment:{
        principal:{amount:1500, currency:'USD',description:'gifted for her 1st birthday'}
      }
    },
    
    
    {
      ledgerRefId:"peer-to-peer", from:'vn1@gmail.com', to:'kn1@gmail.com',       
      txnRefId:"gift.issue:vn1@gmail.com:id:2", txnType:"gift.issue",   
      txnDate: new Date("2022-04-01T14:00:00"),   
      payment:{
        principal:{amount:500, currency:'USD',description:'gifted for her 2nd birthday'}
      }
    },
    {
      ledgerRefId:"loan:id-xxx-yyy", from:'kn1@gmail.com', to:'vn1@gmail.com',       
      txnRefId:"loan.pay:kn1@gmail.com:id:1",      txnType:"loan.pay",      
      txnDate: new Date("2022-05-01T14:00:00"),
      payment:{
        principal:{amount:100, currency:'USD',description:'loan principal pay for loan:id-xxx-yyy'},
        interest: {amount:10, currency:'USD',description:'loan interest pay for loan:id-xxx-yyy'}
      }
    },
    {
      ledgerRefId:"loan:id-xxx-yyy", from:'kn1@gmail.com', to:'vn1@gmail.com',       
      txnRefId:"loan.pay:kn1@gmail.com:id:2",      txnType:"loan.pay",      
      txnDate: new Date("2022-05-01T14:00:00"),
      payment:{
        principal:{amount:100, currency:'USD',description:'loan principal pay for loan:id-xxx-yyy'},
        interest: {amount:10, currency:'USD',description:'loan interest pay for loan:id-xxx-yyy'}
      }
    },
    {
      ledgerRefId:"peer-to-peer", from:'payroll-in@wavelabs.ai', to:'vn1@gmail.com',       
      txnRefId:"salary.pay:payroll-in@wavelabs.ai:id:1", txnType:"salary.pay",           
      txnDate: new Date("2022-06-01T14:00:00"),
      payment:{
        principal:{amount:10000, currency:'USD',description:'salary for month of 2022 jan'},
      }
    },
    {
      ledgerRefId:"peer-to-peer", from:'payroll-in@wavelabs.ai', to:'vn1@gmail.com',       
      txnRefId:"salary.pay:payroll-in@wavelabs.ai:id:2",  txnType:"salary.pay",           
      txnDate: new Date("2022-07-01T14:00:00"),
      payment:{
        principal:{amount:10000, currency:'USD',description:'salary for month of 2022 feb'},
      }
    }
  ]

  for ( const txn of transactions) {
    /**
     * find the two chains
     */
    const fromChain = await chainService.findChainByEmail(txn.from);
    const toChain = await chainService.findChainByEmail(txn.to);
    if( fromChain === undefined || toChain === undefined ) {
      console.log("error chain not found were they created earlier:",{fromChain,toChain})
    } else {
      /**
       * create NetworkLedgers
       */
      let ledger = await chainService.findLedger(fromChain,toChain.chaninId,txn.ledgerRefId)
      if( ledger === undefined ) {
        console.log("ledger not found between: ", {from:txn.from,to:txn.to})
        ledger = await chainService.createNetworkLedger(fromChain,toChain.chaninId,txn.ledgerRefId)
      }
      const activity = await chainService.findActivityByTxnRef(ledger,txn.txnRefId);
      if( activity.length <=0 ) {
        /**
         * no activity lets create one.
         */
        await chainService.applyPayment(ledger,txn.txnType,txn.payment,txn.txnRefId, txn.txnDate)
      }      
    }    
  }
}
