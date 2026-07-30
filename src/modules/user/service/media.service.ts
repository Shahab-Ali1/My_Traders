import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Media } from "../entity/media.entity";
import { Repository } from "typeorm";
import { fileInfo } from "src/utility/file.util";

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media)
        protected repository: Repository<Media>
    ) { }

    async uploadMedia(file: Express.Multer.File, module: string, original_name: string, ref_type?: string, metadata?: Object) {
        // Create the media record
        const newMedia: any = {
            module: module,
            key: "uploads/images",
            ref_type: ref_type,
            original_name: original_name,
            ...fileInfo(file),
            metadata: metadata
        };

        const create = this.repository.create(newMedia);
        const savedMedia = await this.repository.save(create);
        // TODO Implement S3 for file Uploading

        return savedMedia;
    }

    async deleteMedia(id: number) {
        return await this.repository.delete(id);
    }

};