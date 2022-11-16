import { Resolver, Query } from "type-graphql";
import 'reflect-metadata'
import { Service } from "typedi";

@Service()
@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello() {
    return "Welcome to neoledgers";
  }
}