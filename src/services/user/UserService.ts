import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '../shared/hashing.service';

@Injectable()
export class UserService {
  private readonly timestamp = '2025-02-15 07:48:34';
  private readonly currentUser = 'vilohitan';

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private hashingService: HashingService
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashingService.hash(userData.password);
    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
      createdAt: this.timestamp,
      createdBy: this.currentUser
    });
    return user.save();
  }

  async authenticate(credentials: AuthCredentialsDto): Promise<AuthResponse> {
    const user = await this.userModel.findOne({ email: credentials.email });
    if (!user) throw new UnauthorizedException();

    const isValid = await this.hashingService.compare(
      credentials.password,
      user.password
    );
    if (!isValid) throw new UnauthorizedException();

    const token = this.jwtService.sign({ userId: user._id });
    return { token, user };
  }
}