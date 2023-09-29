import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    //UseGuards,
} from '@nestjs/common';
//import { JwtGuard } from '../auth/guard';
import { RoleService } from './role.service';
import {
    CreateRoleDto,
    EditRoleDto,
} from './dto';

//@UseGuards(JwtGuard)
@Controller('roles')
export class RoleController {
    constructor(
        private roleService: RoleService,
    ) { }

    @Get()
    getRoles() {
        return this.roleService.getRoles();
    }

    @Get(':id')
    getRoleById(
        @Param('id', ParseIntPipe) roleId: number,
    ) {
        return this.roleService.getRoleById(
            roleId,
        );
    }

    @Post()
    createRole(
        @Body() dto: CreateRoleDto,
    ) {
        return this.roleService.createRole(
            dto,
        );
    }

    @Patch(':id')
    editRoleById(
        @Param('id', ParseIntPipe) roleId: number,
        @Body() dto: EditRoleDto,
    ) {
        return this.roleService.editRoleById(
            roleId,
            dto,
        );
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteRoleById(
        @Param('id', ParseIntPipe) roleId: number,
    ) {
        return this.roleService.deleteRoleById(
            roleId,
        );
    }
}

