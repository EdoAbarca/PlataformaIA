import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FunctionalitiesService {
    constructor(private prisma: PrismaService) { }

    //Funcionalidades finales
    /* 
    getUserKeys(idUser: number){
        return this.prisma.key.findMany({where: {user_id: idUser}});
    }

    async createUserKey(idUser: number, createKeyDto: CreateKeyDto){
        return this.prisma.key.create({
            data: {
                ...createKeyDto,
                user_id: idUser,
            },
        });
    }

    deleteUserKey(idUser: number, idKey: number){
        return this.prisma.key.delete({
            where: {
                id: idKey,
                user_id: idUser,
            },
        });
    }

    getUserAnalysis(idUser: number){
        return this.prisma.analysis.findMany({where: {user_id: idUser}});
    }

    getUserDocumentsByAnalysis(idUser: number, idAnalysis: number){
        return this.prisma.document.findMany({where: {user_id: idUser, analysis_id: idAnalysis}});
    }

    getAnalysisDocument(idAnalysis: number, idDocument: number){
        return this.prisma.document.findUnique({where: {id: idDocument, analysis_id: idAnalysis}});
    }

    deleteUserAnalysis(idUser: number, idAnalysis: number){
        return this.prisma.analysis.delete({
            where: {
                id: idAnalysis,
                user_id: idUser,
            },
        });
    }

    async createUserAnalysis(idUser: number, createAnalysisDto: CreateAnalysisDto, createDocumentsDto: CreateDocumentDto[]){
        const analysis =
            await this.prisma.analysis.create({
                data: {
                    ...createAnalysisDto,
                    user_id: idUser,
                },
            });
        
        for (const createDocumentDto of createDocumentsDto) {
            await this.prisma.document.create({
                data: {
                    ...createDocumentDto,
                    analysis_id: analysis.id,
                    user_id: idUser,
                },
            });
        }

        return analysis;
    }*/
    
}
