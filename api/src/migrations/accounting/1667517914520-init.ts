import {MigrationInterface, QueryRunner} from "typeorm";

export class init1667517914520 implements MigrationInterface {
    name = 'init1667517914520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "activityType" character varying NOT NULL, "amount" real NOT NULL, "reference" character varying, "description" character varying, CONSTRAINT "PK_1f676862a8a84560fe196a32df1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bank_activity"`);
    }

}
