import {MigrationInterface, QueryRunner} from "typeorm";

export class init1665700587536 implements MigrationInterface {
    name = 'init1665700587536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "oauth_scopes" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_be79cc7cb2b1c4a1662c0403250" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a1491742119edf77929115186b" ON "oauth_scopes" ("name") `);
        await queryRunner.query(`CREATE TABLE "oauth_clients" ("id" uuid NOT NULL, "secret" character varying(128), "name" character varying(128) NOT NULL, "redirectUris" text NOT NULL, "allowedGrants" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c4759172d3431bae6f04e678e0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "oauth_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_e1e362edda08183b5c03266cab3" UNIQUE ("email"), CONSTRAINT "PK_c1e31b84cedaa9135fd13ca1620" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "oauth_auth_codes" ("code" character varying(128) NOT NULL, "userId" uuid, "clientId" uuid NOT NULL, "redirectUri" character varying, "codeChallenge" character varying(128), "codeChallengeMethod" character varying(128), "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d40c87f888fba2e9fcaf77bef58" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22541b7182ffa065fcd07e58c8" ON "oauth_auth_codes" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7e3edc468b1eb03a1b4d16d38c" ON "oauth_auth_codes" ("clientId") `);
        await queryRunner.query(`CREATE TABLE "oauth_tokens" ("accessToken" character varying(128) NOT NULL, "accessTokenExpiresAt" TIMESTAMP NOT NULL, "refreshToken" character varying(128), "refreshTokenExpiresAt" TIMESTAMP, "clientId" uuid NOT NULL, "userId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d41d9ae6c789d78311f43754572" PRIMARY KEY ("accessToken"))`);
        await queryRunner.query(`CREATE INDEX "IDX_114470cd5f69a26f2e42f33024" ON "oauth_tokens" ("refreshToken") `);
        await queryRunner.query(`CREATE INDEX "IDX_3d9dfb37837e5dd891bbc81b32" ON "oauth_tokens" ("clientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8c200cc4c90d24e832caf0a18" ON "oauth_tokens" ("userId") `);
        await queryRunner.query(`CREATE TABLE "oauth_client_scopes" ("clientId" uuid NOT NULL, "scopeId" integer NOT NULL, CONSTRAINT "PK_4418822562d4ad6e14804390f1f" PRIMARY KEY ("clientId", "scopeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_95bf597cdb3cf7df1907a49e93" ON "oauth_client_scopes" ("clientId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b94f84e99819eb0effb8473c54" ON "oauth_client_scopes" ("scopeId") `);
        await queryRunner.query(`CREATE TABLE "oauth_auth_code_scopes" ("authCodeCode" character varying(128) NOT NULL, "scopeId" integer NOT NULL, CONSTRAINT "PK_9926b24c8edf422cbdae5fbfa7d" PRIMARY KEY ("authCodeCode", "scopeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0fd9c5213a95410865db78d72" ON "oauth_auth_code_scopes" ("authCodeCode") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5b748d36de7d54b6faa465d67" ON "oauth_auth_code_scopes" ("scopeId") `);
        await queryRunner.query(`CREATE TABLE "oauth_token_scopes" ("tokenAccessToken" character varying(128) NOT NULL, "scopeId" integer NOT NULL, CONSTRAINT "PK_37e0c88c7bda2a2b4f4805e6886" PRIMARY KEY ("tokenAccessToken", "scopeId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b6d5539ba7967844dbceedb586" ON "oauth_token_scopes" ("tokenAccessToken") `);
        await queryRunner.query(`CREATE INDEX "IDX_339cf46d38a9a44c888f481a1d" ON "oauth_token_scopes" ("scopeId") `);
        await queryRunner.query(`ALTER TABLE "oauth_auth_codes" ADD CONSTRAINT "FK_22541b7182ffa065fcd07e58c82" FOREIGN KEY ("userId") REFERENCES "oauth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "oauth_auth_codes" ADD CONSTRAINT "FK_7e3edc468b1eb03a1b4d16d38c5" FOREIGN KEY ("clientId") REFERENCES "oauth_clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "oauth_tokens" ADD CONSTRAINT "FK_3d9dfb37837e5dd891bbc81b324" FOREIGN KEY ("clientId") REFERENCES "oauth_clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "oauth_tokens" ADD CONSTRAINT "FK_a8c200cc4c90d24e832caf0a180" FOREIGN KEY ("userId") REFERENCES "oauth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "oauth_client_scopes" ADD CONSTRAINT "FK_95bf597cdb3cf7df1907a49e938" FOREIGN KEY ("clientId") REFERENCES "oauth_clients"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "oauth_client_scopes" ADD CONSTRAINT "FK_b94f84e99819eb0effb8473c547" FOREIGN KEY ("scopeId") REFERENCES "oauth_scopes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "oauth_auth_code_scopes" ADD CONSTRAINT "FK_a0fd9c5213a95410865db78d72a" FOREIGN KEY ("authCodeCode") REFERENCES "oauth_auth_codes"("code") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "oauth_auth_code_scopes" ADD CONSTRAINT "FK_f5b748d36de7d54b6faa465d67e" FOREIGN KEY ("scopeId") REFERENCES "oauth_scopes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "oauth_token_scopes" ADD CONSTRAINT "FK_b6d5539ba7967844dbceedb5866" FOREIGN KEY ("tokenAccessToken") REFERENCES "oauth_tokens"("accessToken") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "oauth_token_scopes" ADD CONSTRAINT "FK_339cf46d38a9a44c888f481a1dc" FOREIGN KEY ("scopeId") REFERENCES "oauth_scopes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "oauth_token_scopes" DROP CONSTRAINT "FK_339cf46d38a9a44c888f481a1dc"`);
        await queryRunner.query(`ALTER TABLE "oauth_token_scopes" DROP CONSTRAINT "FK_b6d5539ba7967844dbceedb5866"`);
        await queryRunner.query(`ALTER TABLE "oauth_auth_code_scopes" DROP CONSTRAINT "FK_f5b748d36de7d54b6faa465d67e"`);
        await queryRunner.query(`ALTER TABLE "oauth_auth_code_scopes" DROP CONSTRAINT "FK_a0fd9c5213a95410865db78d72a"`);
        await queryRunner.query(`ALTER TABLE "oauth_client_scopes" DROP CONSTRAINT "FK_b94f84e99819eb0effb8473c547"`);
        await queryRunner.query(`ALTER TABLE "oauth_client_scopes" DROP CONSTRAINT "FK_95bf597cdb3cf7df1907a49e938"`);
        await queryRunner.query(`ALTER TABLE "oauth_tokens" DROP CONSTRAINT "FK_a8c200cc4c90d24e832caf0a180"`);
        await queryRunner.query(`ALTER TABLE "oauth_tokens" DROP CONSTRAINT "FK_3d9dfb37837e5dd891bbc81b324"`);
        await queryRunner.query(`ALTER TABLE "oauth_auth_codes" DROP CONSTRAINT "FK_7e3edc468b1eb03a1b4d16d38c5"`);
        await queryRunner.query(`ALTER TABLE "oauth_auth_codes" DROP CONSTRAINT "FK_22541b7182ffa065fcd07e58c82"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_339cf46d38a9a44c888f481a1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6d5539ba7967844dbceedb586"`);
        await queryRunner.query(`DROP TABLE "oauth_token_scopes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5b748d36de7d54b6faa465d67"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0fd9c5213a95410865db78d72"`);
        await queryRunner.query(`DROP TABLE "oauth_auth_code_scopes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b94f84e99819eb0effb8473c54"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95bf597cdb3cf7df1907a49e93"`);
        await queryRunner.query(`DROP TABLE "oauth_client_scopes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8c200cc4c90d24e832caf0a18"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d9dfb37837e5dd891bbc81b32"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_114470cd5f69a26f2e42f33024"`);
        await queryRunner.query(`DROP TABLE "oauth_tokens"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7e3edc468b1eb03a1b4d16d38c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22541b7182ffa065fcd07e58c8"`);
        await queryRunner.query(`DROP TABLE "oauth_auth_codes"`);
        await queryRunner.query(`DROP TABLE "oauth_user"`);
        await queryRunner.query(`DROP TABLE "oauth_clients"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1491742119edf77929115186b"`);
        await queryRunner.query(`DROP TABLE "oauth_scopes"`);
    }

}
