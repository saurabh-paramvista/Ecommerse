import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLCart1748329080559 implements MigrationInterface {
    name = 'AddTBLCart1748329080559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "carts" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "addedById" integer, "productsId" integer, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."users_roles_enum" RENAME TO "users_roles_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" TYPE "public"."users_roles_enum"[] USING "roles"::"text"::"public"."users_roles_enum"[]`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT '{user}'`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum_old"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_44a33d35bf799364972ed3888cd" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_db0cbf0956e17fa3cc5968911ab" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_db0cbf0956e17fa3cc5968911ab"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_44a33d35bf799364972ed3888cd"`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum_old" AS ENUM('admin', 'buyer', 'agent', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" TYPE "public"."users_roles_enum_old"[] USING "roles"::"text"::"public"."users_roles_enum_old"[]`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "roles" SET DEFAULT '{user}'`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_roles_enum_old" RENAME TO "users_roles_enum"`);
        await queryRunner.query(`DROP TABLE "carts"`);
    }

}
