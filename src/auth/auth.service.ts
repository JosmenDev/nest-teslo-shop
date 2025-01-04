import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcrypt: BcryptAdapter,
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return {
      ...user,
      token: this.jwtToken({id: user.id})
    };
  }

  async login (loginUserDto: LoginUserDto): Promise<any> {

    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true}
    });
    if(!user) throw new UnauthorizedException('Credentials are not valid (email)');
    
    const isPasswordValid = await this.bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.jwtToken({id: user.id})
    };
  }

  async checkAuthStatus (user: User) {
    return {
      ...user,
      token: this.jwtToken({id: user.id})
    }
  }

  private jwtToken (payload: JwtPayload): string {
    // Generar token con el jwtService
    const token = this.jwtService.sign(payload);
    return token;
  }

}
