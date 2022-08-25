import {MigrationInterface, QueryRunner} from "typeorm";

export class posts1661260641252 implements MigrationInterface {
    name = 'posts1661260641252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "text" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ADD "creatorId" uuid`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "text"`);
    }

}
