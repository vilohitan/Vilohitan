import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match } from './schemas/match.schema';
import { MLService } from '../ml/ml.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class MatchingService {
  private readonly timestamp = '2025-02-15 07:48:34';
  private readonly currentUser = 'vilohitan';

  constructor(
    @InjectModel(Match.name) private matchModel: Model<Match>,
    private mlService: MLService,
    private profileService: ProfileService
  ) {}

  async findMatches(userId: string, preferences: MatchPreferences): Promise<MatchResult[]> {
    const userProfile = await this.profileService.getProfile(userId);
    const potentialMatches = await this.findPotentialMatches(userProfile, preferences);
    
    const scoredMatches = await Promise.all(
      potentialMatches.map(async profile => ({
        profile,
        score: await this.mlService.calculateMatchScore(userProfile, profile)
      }))
    );

    return scoredMatches
      .filter(match => match.score >= preferences.minimumScore)
      .sort((a, b) => b.score - a.score);
  }

  async createMatch(userId: string, matchedUserId: string): Promise<Match> {
    const match = new this.matchModel({
      users: [userId, matchedUserId],
      createdAt: this.timestamp,
      createdBy: this.currentUser
    });
    return match.save();
  }
}