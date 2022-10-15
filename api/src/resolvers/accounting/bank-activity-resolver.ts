import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Int,
  Field,
  InputType,
  ObjectType,
  GraphQLTimestamp,
} from "type-graphql";
import "reflect-metadata";
import { BankActivity } from "../../entities/accounting/BankActivity";

@ObjectType()
class PaginatedBankActivity {
  @Field(() => [BankActivity])
  activity: BankActivity[];
  @Field()
  hasMore: boolean;
}

@Resolver()
export class BankActivityResolver {
  @Query(() => PaginatedBankActivity)
  async bankActivity(
    @Arg("offset", () => Int) offset: number,
    @Arg("limit", () => Int) limit: number
  ): Promise<PaginatedBankActivity> {
    
    const realLimit = Math.min(100, limit);
    const reaLimitPlusOne = realLimit + 1;

    const qb = BankActivity.createQueryBuilder("ba")
      .orderBy("ba.createdAt", "DESC")
      .offset(offset)
      .limit(reaLimitPlusOne);

    // if (cursor > 0) {
    //   qb.where("ba.createdAt < :cursor", {
    //     cursor: new Date(cursor),
    //   });
    // }

    const activity = await qb.getMany();

    // if (activity.length > 0) {
    //   console.log(
    //     "activity length:",
    //     activity.length,
    //     "first:",
    //     activity[0].createdAt,
    //     "last:",
    //     activity[activity.length - 1].createdAt
    //     );
    // }
    console.log("offset:", offset, " limit:", limit, " activity:", activity.length);

    return {
      activity: activity.slice(0, realLimit),
      hasMore: activity.length === reaLimitPlusOne,
    };
  }
}
