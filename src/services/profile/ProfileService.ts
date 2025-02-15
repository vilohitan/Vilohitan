import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './schemas/profile.schema';
import { MinioService } from '../shared/minio.service';

@Injectable()
export class ProfileService {
  private readonly timestamp = '2025-02-15 07:48:34';
  private readonly currentUser = 'vilohitan';

  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private minioService: MinioService
  ) {}

  async createProfile(userId: string, profileData: CreateProfileDto): Promise<Profile> {
    const profile = new this.profileModel({
      userId,
      ...profileData,
      createdAt: this.timestamp,
      createdBy: this.currentUser
    });
    return profile.save();
  }

  async uploadPhotos(userId: string, files: Express.Multer.File[]): Promise<string[]> {
    const urls = await Promise.all(
      files.map(file => this.minioService.uploadFile(
        'user-media',
        `${userId}/${file.originalname}`,
        file.buffer
      ))
    );
    await this.profileModel.findOneAndUpdate(
      { userId },
      { $push: { photos: { $each: urls } } }
    );
    return urls;
  }
}