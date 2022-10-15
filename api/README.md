# Run on local environment

```bash
  $ docker-compose up
```
```
  $ yarn install
  $ yarn watch
```

```
  $ npx typeorm migration:run -c ledgers
  $ npx ts-node src/seed/dbseed.ts --clean --tenants --users --activity
```

```bash
  $ yarn dev; // this should start on localhost:4000
```


## Creating entity migrations & running them    
  
### creates migration files
```bash
  npx typeorm migration:generate -c ledgers -d src/migrations/ -n <name> 
```  
  
### executes migrations on DB
```bash
  $ npx typeorm migration:run -c ledgers
```

### Seeding Database
```bash
  $ npx ts-node src/seed/dbseed.ts --clean --tenants --users --activity --dacchain
```  

### Working on new domains
```bash    
  $ export wip_feature=dac
  $ npx typeorm migration:revert -c ledgers
  $ rm dist/migrations/*/*-${wip_feature}* src/migrations/*/*-${wip_feature}*
  $ yarn mig:gen:all $wip_feature
  $ yarn mig:run
  $ npx typeorm migration:run -c ledgers  -f ormconfig.json
```  