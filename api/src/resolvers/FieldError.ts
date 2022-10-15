import {
    Field,
    InputType,
    ObjectType,
} from "type-graphql";
import "reflect-metadata";

@ObjectType()
export class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;

    constructor(field: string, message: string) {
        this.field = field;
        this.message = message;
    }
}