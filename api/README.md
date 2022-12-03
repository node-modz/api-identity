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
  $ node dist/lib/seeder/seeder-run.js --init dist/seeder-config.ts --loaders dist/seed-data/seed-loaders --clean
  $ node dist/lib/seeder/seeder-run.js --init dist/seeder-config.ts --loaders dist/seed-data/seed-loaders
```

```bash
  $ yarn run:dev; // this should start on localhost:4000
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
  $ npx ts-node src/seeder/seeder.ts --clean --all | [ --tenants --users --activity --dacchain ]
```  

### Working on new domains
```bash    
  $ export wip_feature=dac
  
  $ yarn mig:gen:all $wip_feature ;  "all|identity|oauth2|accounting|dacchain"
  $ yarn mig:gen:identity $wip_feature
  $ yarn mig:gen:oauth2 $wip_feature
  $ yarn mig:gen:accounting $wip_feature
  $ yarn mig:gen:dacchain $wip_feature
  $ yarn mig:run
  $ npx typeorm migration:run -c ledgers  -f ormconfig.json

  #
  # any issues, revert the recent migration & redo.
  #
  $ npx typeorm migration:revert -c ledgers
  $ rm dist/migrations/*/*-${wip_feature}* src/migrations/*/*-${wip_feature}*
```  

### CURL oauth requests
```
curl -s -d 'token='$token'' \
  http://localhost:4000/oauth2/verify | jq 

curl -s -d grant_type=client_credentials \
  -d client_id=service-to-service \
  -d client_secret=sts-secret \
  http://localhost:4000/oauth2/token | jq '.access_token' | xargs ~/bin/jwt.sh

curl -s -d grant_type=password \
  -d username=vn1@gmail.com \
  -d password=aaa \
  -d client_id=password-client \
  -d client_secret=pc-secret \
  http://localhost:4000/oauth2/token  | jq '.access_token' | xargs ~/bin/jwt.sh

curl -s -d 'refresh_token='$ref_token'' \
  -d grant_type=refresh_token \
  -d client_id=password-client \
  -d client_secret=pc-secret \
  http://localhost:4000/oauth2/token  | jq '.access_token' 
```