import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { before } from 'node:test';
import { CreateAIDto, EditAIDto } from '../src/ai/dto';
import { CreateAnalysisDto, EditAnalysisDto } from 'src/analysis/dto';
import { CreateKeyDto, EditKeyDto } from 'src/key/dto';
import { CreateDocumentDto, EditDocumentDto } from 'src/document/dto';
import { CreateResultDto, EditResultDto } from 'src/result/dto';

describe('Test alpha e2e', () => { //Corregir para siguiente commit
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => {
    prisma.cleanDb();
    app.close();
  });

  describe('Test AI CRUD', () => {
    const PostAIDto: CreateAIDto = {
      name: 'Test name AI',
    };
    const EditAIDto: EditAIDto = {
      name: 'Test name AI edited',
    };

    it('Should get no AIs', () => {
      return pactum
        .spec()
        .get('/ai')
        .expectStatus(200)
        .expectBody([])
        .inspect()
        .toss();
    });
    it('Should throw if AI name is empty', () => {
      return pactum
        .spec()
        .post('/ai')
        .withBody({
          name: '',
        })
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should throw if no body AI is provided', () => {
      return pactum
        .spec()
        .post('/ai')
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should create AI', () => {
      return pactum
        .spec()
        .post('/ai')
        .withBody(PostAIDto)
        .expectStatus(201)
        .stores('AIid', 'id')
        .inspect()
        .toss();
    });
    it('Should get the AI created', () => {
      return pactum
        .spec()
        .get('/ai/{id}')
        .withPathParams('id', '$S{AIid}')
        .expectStatus(200)
        .expectBodyContains('$S{AIid}')
        .inspect()
        .toss();
    });
    it('Should get the AI created as list', () => {
      return pactum
        .spec()
        .get('/ai')
        .expectStatus(200)
        .expectJsonLength(1)
        .inspect()
        .toss();
    });
    it('Should edit the AI created', () => {
      return pactum
        .spec()
        .patch('/ai/{id}')
        .withPathParams('id', '$S{AIid}')
        .withBody(EditAIDto)
        .expectStatus(200)
        .expectBodyContains('$S{AIid}')
        .inspect()
        .toss();
    });
    it('Should delete the AI created', () => {
      return pactum
        .spec()
        .delete(`/ai/{id}`)
        .withPathParams('id', '$S{AIid}')
        .expectStatus(204)
        .inspect()
        .toss();
    });
  })

  describe('Test Analysis CRUD', () => {
    const PostAnalysisDTO: CreateAnalysisDto = {
      title: 'Test name analysis',
    };
    const EditAnalysisDTO: EditAnalysisDto = {
      title: 'Test name analysis edited',
    };

    it('Should get no analyses', () => {
      return pactum
        .spec()
        .get('/analysis')
        .expectStatus(200)
        .expectBody([])
        .inspect()
        .toss();
    });
    it('Should throw if analysis title is empty', () => {
      return pactum
        .spec()
        .post('/analysis')
        .withBody({
          title: '',
        })
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should throw if no body analysis is provided', () => {
      return pactum
        .spec()
        .post('/analysis')
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should create analysis', () => {
      return pactum
        .spec()
        .post('/ai')
        .withBody(PostAnalysisDTO)
        .expectStatus(201)
        .stores('analysisID', 'id')
        .inspect()
        .toss();
    });
    it('Should get the analysis created', () => {
      return pactum
        .spec()
        .get('/analysis/{id}')
        .withPathParams('id', '$S{analysisID}')
        .expectStatus(200)
        .expectBodyContains('$S{analysisID}')
        .inspect()
        .toss();
    });
    it('Should get the analysis created as list', () => {
      return pactum
        .spec()
        .get('/analysis')
        .expectStatus(200)
        .expectJsonLength(1)
        .inspect()
        .toss();
    });
    it('Should edit the analysis created', () => {
      return pactum
        .spec()
        .patch('/analysis/{id}')
        .withPathParams('id', '$S{analysisID}')
        .withBody(EditAnalysisDTO)
        .expectStatus(200)
        .expectBodyContains('$S{analysisID}')
        .inspect()
        .toss();
    });
    it('Should delete the analysis created', () => {
      return pactum
        .spec()
        .delete('/analysis/{id}')
        .withPathParams('id', '$S{analysisID}')
        .expectStatus(204)
        .inspect()
        .toss();
    });
  })

  describe('Test Key CRUD', () => {

    const PostAIDto: CreateAIDto = {
      name: 'Mock AI',
    };
    it('Should create AI mock', () => {
      return pactum
        .spec()
        .post('/ai')
        .withBody(PostAIDto)
        .expectStatus(201)
        .stores('MockAIid', 'id')
        .inspect()
        .toss();
    });

    const PostKeyDTO: CreateKeyDto = {
      ai_key: '1234567890',
      ai_id: parseInt('$S{MockAIid}'),
    };
    const EditKeyDTO: EditKeyDto = {
      ai_key: '0987654321',
    };

    it('Should get no keys', () => {
      return pactum
        .spec()
        .get('/key')
        .expectStatus(200)
        .expectBody([])
        .inspect()
        .toss();
    });
    it('Should throw if key title is empty', () => {
      return pactum
        .spec()
        .post('/key')
        .withBody({
          ai_key: '',
        })
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should throw if no body key is provided', () => {
      return pactum
        .spec()
        .post('/key')
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should create key', () => {
      return pactum
        .spec()
        .post('/key')
        .withBody(PostKeyDTO)
        .expectStatus(201)
        .stores('keyID', 'id')
        .inspect()
        .toss();
    });
    it('Should get the key created', () => {
      return pactum
        .spec()
        .get('/key/{id}')
        .withPathParams('id', '$S{keyID}')
        .expectStatus(200)
        .expectBodyContains('$S{keyID}')
        .inspect()
        .toss();
    });
    it('Should get the key created as list', () => {
      return pactum
        .spec()
        .get('/analysis')
        .expectStatus(200)
        .expectJsonLength(1)
        .inspect()
        .toss();
    });
    it('Should edit the key created', () => {
      return pactum
        .spec()
        .patch('/key/{id}')
        .withPathParams('id', '$S{keyID}')
        .withBody(EditKeyDTO)
        .expectStatus(200)
        .expectBodyContains('$S{keyID}')
        .inspect()
        .toss();
    });
    it('Should delete the key created', () => {
      return pactum
        .spec()
        .delete('/key/{id}')
        .withPathParams('id', '$S{keyID}')
        .expectStatus(204)
        .inspect()
        .toss();
    });

    it('Should delete the AI mock', () => {
      return pactum
        .spec()
        .delete('/ai/{id}')
        .withPathParams('id', '$S{MockAIid}')
        .expectStatus(204)
        .inspect()
        .toss();
    });
  })


  describe('Test Document CRUD', () => {
    const PostAnalysisDTO: CreateAnalysisDto = {
      title: 'Mock analysis',
    };
    it('Should create analysis mock', () => {
      return pactum
        .spec()
        .post('/analysis')
        .withBody(PostAnalysisDTO)
        .expectStatus(201)
        .stores('MockAnalysisID', 'id')
        .inspect()
        .toss();
    });
    const PostDocumentDTO:CreateDocumentDto = {
      title: 'Mock document',
      analysis_id: parseInt('$S{MockAnalysisID}'),
    }
    const EditDocumentDTO: EditDocumentDto = {
      title: 'Mock document edited',
      analysis_id: parseInt('$S{MockAnalysisID}'),
    }

    it('Should get no documents', () => {
      return pactum
        .spec()
        .get('/document')
        .expectStatus(200)
        .expectBody([])
        .inspect()
        .toss();
    })
    it('Should throw if document title is empty', () => {
      return pactum
        .spec()
        .post('/document')
        .withBody({
          title: '',
        })
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should throw if no body document is provided', () => {
      return pactum
        .spec()
        .post('/document')
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should create document', () => {
      return pactum
        .spec()
        .post('/document')
        .withBody(PostDocumentDTO)
        .expectStatus(201)
        .stores('documentID', 'id')
        .inspect()
        .toss();
    });
    it('Should get the document created', () => {
      return pactum
        .spec()
        .get('/document/{id}')
        .withPathParams('id', '$S{documentID}')
        .expectStatus(200)
        .expectBodyContains('$S{documentID}')
        .inspect()
        .toss();
    });
    it('Should get the document created as list', () => {
      return pactum
        .spec()
        .get('/document')
        .expectStatus(200)
        .expectJsonLength(1)
        .inspect()
        .toss();
    });
    it('Should edit the document created', () => {
      return pactum
        .spec()
        .patch('/document/{id}')
        .withPathParams('id', '$S{documentID}')
        .withBody(EditDocumentDTO)
        .expectStatus(200)
        .expectBodyContains('$S{documentID}')
        .inspect()
        .toss();
    });
    it('Should delete the document created', () => {
      return pactum
        .spec()
        .delete('/document/{id}')
        .withPathParams('id', '$S{documentID}')
        .expectStatus(204)
        .inspect()
        .toss();
    });
    it('Should delete the analysis mock', () => {
      return pactum
        .spec()
        .delete('/analysis/{id}')
        .withPathParams('id', '$S{MockAnalysisID}')
        .expectStatus(204)
        .inspect()
        .toss();
    });
  })

  describe('Test Result CRUD', () => {
    const PostAIDto: CreateAIDto = {
      name: 'Mock AI document',
    };
    it('Should create AI mock', () => {
      return pactum
        .spec()
        .post('/ai')
        .withBody(PostAIDto)
        .expectStatus(201)
        .stores('MockAIid', 'id')
        .inspect()
        .toss();
    });
    const PostAnalysisDTO: CreateAnalysisDto = {
      title: 'Mock analysis document',
    };
    it('Should create analysis mock', () => {
      return pactum
        .spec()
        .post('/analysis')
        .withBody(PostAnalysisDTO)
        .expectStatus(201)
        .stores('MockAnalysisID', 'id')
        .inspect()
        .toss();
    });
    const PostDocumentDTO :CreateDocumentDto = {
      title: 'Mock document',
      analysis_id: parseInt('$S{MockAnalysisID}'),
    };
    it('Should create document mock', () => {
      return pactum
        .spec()
        .post('/document')
        .withBody(PostDocumentDTO)
        .expectStatus(201)
        .stores('MockDocumentID', 'id')
        .inspect()
        .toss();
    });
    const PostResultDTO: CreateResultDto = {
      ia_score: 65,
      ia_result: 'Partly built by AI',
      ai_id: parseInt('$S{MockAIid}'),
      document_id: parseInt('$S{MockDocumentID}'),
    };
    const EditResultDTO: EditResultDto = {
      ia_score: 90,
      ia_result: 'Mostly AI',
      ai_id: parseInt('$S{MockAIid}'),
      document_id: parseInt('$S{MockDocumentID}'),
    };
    it('Should get no results', () => {
      return pactum
        .spec()
        .get('/result')
        .expectStatus(200)
        .expectBody([])
        .inspect()
        .toss();
    })
    it('Should throw if result score is empty', () => {
      return pactum
        .spec()
        .post('/result')
        .withBody({
          ia_score: '',
        })
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should throw if no body result is provided', () => {
      return pactum
        .spec()
        .post('/result')
        .expectStatus(400)
        .inspect()
        .toss();
    });
    it('Should create result', () => {
      return pactum
        .spec()
        .post('/result')
        .withBody(PostResultDTO)
        .expectStatus(201)
        .stores('resultID', 'id')
        .inspect()
        .toss();
    });
    it('Should get the result created', () => {
      return pactum
        .spec()
        .get('/result/{id}')
        .withPathParams('id', '$S{resultID}')
        .expectStatus(200)
        .expectBodyContains('$S{resultID}')
        .inspect()
        .toss();
    });
    it('Should get the result created as list', () => {
      return pactum
        .spec()
        .get('/result')
        .expectStatus(200)
        .expectJsonLength(1)
        .inspect()
        .toss();
    });
    it('Should edit the result created', () => {
      return pactum
        .spec()
        .patch('/result/{id}')
        .withPathParams('id', '$S{resultID}')
        .withBody(EditResultDTO)
        .expectStatus(200)
        .expectBodyContains('$S{resultID}')
        .inspect()
        .toss();
    });
    it('Should delete the result created', () => {
      return pactum
        .spec()
        .delete('/result/{id}')
        .withPathParams('id', '$S{resultID}')
        .expectStatus(204)
        .inspect()
        .toss();
    });
    it('Should delete the AI mock', () => {
      return pactum
        .spec()
        .delete('/ai/{id}')
        .withPathParams('id', '$S{MockAIid}')
        .expectStatus(204)
        .inspect()
        .toss();
    });
    it('Should delete the analysis mock', () => {
      return pactum
        .spec()
        .delete('/analysis/{id}')
        .withPathParams('id', '$S{MockAnalysisID}')
        .expectStatus(204)
        .inspect()
        .toss();
    });
    it('Should delete the document mock', () => {
      return pactum
        .spec()
        .delete('/document/{id}')
        .withPathParams('id', '$S{MockDocumentID}')
        .expectStatus(204)
        .inspect()
        .toss();
    });
  })

  describe('Test funcionalidades alpha final', () => {
    before(() => {
      
      prisma.fillDb();//Llenar base de datos con datos de prueba
      //Variables con datos de prueba en BD

    });
    it('Should get all analyses', () => {
      return pactum
        .spec()
        .get('/alpha/final/analysis')
        .expectStatus(200)
        .expectJsonLength(1)
        .inspect()
        .toss();
    });

    it('Should get all AIs', () => {
      return pactum
        .spec()
        .get('/alpha/final/ai')
        .expectStatus(200)
        .expectJsonLength(3)
        .inspect()
        .toss();
    });

    it('Should create key', () => { //Corregir
      return pactum
        .spec()
        .post('/alpha/final/key')
        .withBody({
          key: '1234567890',
        })
        .expectStatus(201)
        .inspect()
        .toss();
    });

    it('Should get all keys', () => {
      return pactum
        .spec()
        .get('/alpha/final/key')
        .expectStatus(200)
        .expectJsonLength(2)
        .inspect()
        .toss();
    });

    it('Should edit key', () => { //Corregir
      return pactum
        .spec()
        .patch('/alpha/final/key/{id}')
        .withPathParams('id', '1')
        .withBody({
          key: '0987654321',
        })
        .expectStatus(200)
        .inspect()
        .toss();
    });

    it('Should delete key', () => { //Corregir
      return pactum
        .spec()
        .delete('/alpha/final/key/{id}')
        .withPathParams('id', '1')
        .expectStatus(204)
        .inspect()
        .toss();
    });

    it('Should get all analyses', () => {
      return pactum
        .spec()
        .get('/alpha/final/analysis')
        .expectStatus(200)
        .expectJsonLength(1)
        .inspect()
        .toss();
    });

    it('Should delete analysis', () => {
      return pactum
        .spec()
        .delete('/alpha/final/analysis/{id}')
        .withPathParams('id', '1')
        .expectStatus(204)
        .inspect()
        .toss();
    });

    it('Should get all analysis documents', () => { //Corregir
      return pactum
        .spec()
        .get('/alpha/final/analysis/{id}')
        .withPathParams('id', '1')
        .expectStatus(200)
        .expectJsonLength(2)
        .inspect()
        .toss();
    });
  })
});