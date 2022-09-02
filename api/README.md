# Run on local environment

```bash
  $ docker-compose up
```
```
  $ yarn install
```

```
  $ npx typeorm migration:run -c ledgers
```

```bash
  $ yarn dev; // this should start on localhost:4000
```

```bash
  $ yarn watch
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
  $ npx ts-node src/seed/dbseed.ts --clean --tenants --users --activity
```  

### Working on new domains
```bash    
  $ npx typeorm migration:generate -c ledgers -d src/migrations/ -n bank_activity
  $ npx typeorm migration:run -c ledgers
  $ npx typeorm migration:revert -c ledgers
  $ rm dist/migrations/*bank* src/migrations/*bank*
```  