import {MigrationInterface, QueryRunner} from "typeorm";

export class tenantActivity1662037266431 implements MigrationInterface {
    name = 'tenantActivity1662037266431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bank_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "activityType" character varying NOT NULL, "amount" real NOT NULL, "reference" character varying, "description" character varying, CONSTRAINT "PK_1f676862a8a84560fe196a32df1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenant"`);
        await queryRunner.query(`DROP TABLE "bank_activity"`);
    }

}
