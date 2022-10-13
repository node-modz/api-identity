import {MigrationInterface, QueryRunner} from "typeorm";

export class init1665700922020 implements MigrationInterface {
    name = 'init1665700922020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "w3_chain" ("chaninId" uuid NOT NULL DEFAULT uuid_generate_v4(), "entityRefId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid, CONSTRAINT "PK_9825f7abc060dba8cf3ca965a6b" PRIMARY KEY ("chaninId"))`);
        await queryRunner.query(`CREATE TABLE "w3_ledger_account_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityKey" character varying NOT NULL, "txnRefId" character varying, "partnerTxnRefId" character varying, "activityDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "activityType" character varying NOT NULL, "cf" integer NOT NULL, "amount" real NOT NULL, "currency" character varying NOT NULL, "reference" character varying, "description" character varying, "ledgerAccountId" uuid, CONSTRAINT "PK_27ca70ddf307eb71b7998d6d8af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "w3_ledger_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountType" character varying NOT NULL, "accountId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "balance" real NOT NULL DEFAULT '0', "accountHash" character varying, "ledgerId" uuid, CONSTRAINT "PK_b7b8052ab1a92f2c39970a745ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "w3_ledger" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ownerChainId" character varying NOT NULL, "partnerChainId" character varying NOT NULL, "ledgerType" character varying NOT NULL, "entityRefId" character varying, "ledgerId" character varying NOT NULL, "ledgerHash" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid, CONSTRAINT "PK_60b0ee205dd9d9c51427cb8ad82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "w3_chain" ADD CONSTRAINT "FK_d7ab776084b36aca179f5d182a6" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "w3_ledger_account_activity" ADD CONSTRAINT "FK_411e6ad07df9e7c9a4e95e0476b" FOREIGN KEY ("ledgerAccountId") REFERENCES "w3_ledger_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "w3_ledger_account" ADD CONSTRAINT "FK_30b49eda4bc1916780efcd712d9" FOREIGN KEY ("ledgerId") REFERENCES "w3_ledger"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "w3_ledger" ADD CONSTRAINT "FK_3d6daa18d7e03e1234628d0f256" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "w3_ledger" DROP CONSTRAINT "FK_3d6daa18d7e03e1234628d0f256"`);
        await queryRunner.query(`ALTER TABLE "w3_ledger_account" DROP CONSTRAINT "FK_30b49eda4bc1916780efcd712d9"`);
        await queryRunner.query(`ALTER TABLE "w3_ledger_account_activity" DROP CONSTRAINT "FK_411e6ad07df9e7c9a4e95e0476b"`);
        await queryRunner.query(`ALTER TABLE "w3_chain" DROP CONSTRAINT "FK_d7ab776084b36aca179f5d182a6"`);
        await queryRunner.query(`DROP TABLE "w3_ledger"`);
        await queryRunner.query(`DROP TABLE "w3_ledger_account"`);
        await queryRunner.query(`DROP TABLE "w3_ledger_account_activity"`);
        await queryRunner.query(`DROP TABLE "w3_chain"`);
    }

}
