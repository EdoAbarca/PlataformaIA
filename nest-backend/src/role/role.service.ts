import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CreateRoleDto,
    EditRoleDto,
} from './dto';

@Injectable()
export class RoleService {
    constructor(private prisma: PrismaService) { }

    getRoles() {
        return this.prisma.role.findMany({});
    }

    getRoleById(
        roleId: number,
    ) {
        return this.prisma.role.findUnique({
            where: {
                id: roleId,
            },
        });
    }

    async createRole(
        dto: CreateRoleDto,
    ) {
        const role =
            await this.prisma.role.create({
                data: {
                    ...dto,
                },
            });

        return role;
    }

    async editRoleById(
        roleId: number,
        dto: EditRoleDto,
    ) {
        // get the role by id
        const role =
            await this.prisma.role.findUnique({
                where: {
                    id: roleId,
                },
            });

        return this.prisma.role.update({
            where: {
                id: roleId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deleteRoleById(
        roleId: number,
    ) {
        const role =
            await this.prisma.role.findUnique({
                where: {
                    id: roleId,
                },
            });

        await this.prisma.role.delete({
            where: {
                id: roleId,
            },
        });
    }
}
