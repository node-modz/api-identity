import Container from 'typedi';
import * as apiConfig from './api-config';
import { BankActivitySeeder } from './components/accounting/seeder/bank-activity-seeder';
import { UserChainSeeder } from './components/dacchain/seeder/user-chain-seeder';
import { UserTransactionSeeder } from './components/dacchain/seeder/user-transaction-seeder';
import { ClientSeeder } from './components/identity/seeder/client-seeder';
import { TenantSeeder } from './components/identity/seeder/tenant-seeder';
import { IdentityUserSeeder } from './components/identity/seeder/user-seeder';

export const __SERVER_CONFIG__ = {
    ... apiConfig.__SERVER_CONFIG__ ,
    config : [        
        {prop:'db',container_ref:'DBConfigOptions'},   
        {prop:'identity',container_ref:'IdentityConfigOptions'},     
    ],
    setup: [
        { init: "dist/lib/core/init-db"  },        
    ], 
    seed_loaders : () => {
        return  [
            { cmd: "users", fileName: "dist/seed-data/identity/users.ts", seeder: Container.get(IdentityUserSeeder) },
            { cmd: "tenants", fileName: "dist/seed-data/identity/tenants.csv", seeder: Container.get(TenantSeeder) },
            { cmd: "activity", fileName: "dist/seed-data/accounting/", seeder: Container.get(BankActivitySeeder) },
            { cmd: "w3chains", fileName: "dist/seed-data/dacchain/user-chain.ts", seeder: Container.get(UserChainSeeder) },
            { cmd: "w3activity", fileName: "dist/seed-data/dacchain/user-transactions.ts", seeder: Container.get(UserTransactionSeeder) },
            { cmd: "oauthclients", fileName: "dist/seed-data/oauth2/clients.ts", seeder: Container.get(ClientSeeder) },
        ];
    }      
}
