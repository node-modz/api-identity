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
  npx typeorm migration:generate -c ledgers -n <name> -d src/migrations/
```  
  
### executes migrations on DB
```bash
  $ npx typeorm migration:run -c ledgers
```


  