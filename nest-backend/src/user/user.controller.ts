import {
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
//import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

//@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    /*
    @Patch()
    changePassword(@Body() password: string) {
        return this.userService.changePassword(password);
    }
    */
}
