/*
  Warnings:

  - You are about to drop the column `social_id` on the `auths` table. All the data in the column will be lost.
  - The values [KaKao,Google,Client] on the enum `auths_type` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `auths` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `auths_user_id_social_id_type_key` ON `auths`;

-- AlterTable
ALTER TABLE `auths` DROP COLUMN `social_id`,
    MODIFY `type` ENUM('SuperAdmin', 'Admin', 'User', 'Etc') NOT NULL;

-- AlterTable
ALTER TABLE `restaurants` ADD COLUMN `review_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    ADD COLUMN `total_score` DECIMAL(2, 1) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `socials` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `type` ENUM('Kakao', 'Google', 'Apple', 'Facebook', 'Naver', 'Etc') NOT NULL,
    `social_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `socials_user_id_key`(`user_id`),
    UNIQUE INDEX `socials_social_id_type_key`(`social_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `auths_user_id_key` ON `auths`(`user_id`);

-- AddForeignKey
ALTER TABLE `socials` ADD CONSTRAINT `socials_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
