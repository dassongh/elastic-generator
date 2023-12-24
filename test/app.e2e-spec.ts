import * as pactum from 'pactum';
import { DataSource } from 'typeorm';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { DatabaseExceptionFilter } from '../src/common/filter/database-exception.filter';
import { SignUpDto } from '../src/modules/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let db: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new DatabaseExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(4004);

    db = app.get(DataSource);
    await db.getRepository('User').delete({});

    pactum.request.setBaseUrl('http://localhost:4004');
  });

  describe('Auth', () => {
    const dto: SignUpDto = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    };

    describe('SignUp', () => {
      it('Should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody({ ...dto, email: '' })
          .expectStatus(400);
      });

      it('Should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });

      it('Should throw error if body is empty', () => {
        return pactum.spec().post('/auth/sign-up').withBody({}).expectStatus(400);
      });

      it('Should sign up', () => {
        return pactum.spec().post('/auth/sign-up').withBody(dto).expectStatus(201);
      });
    });

    describe('SignIn', () => {
      it('Should sign in', () => {
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'data.access');
      });
    });
  });

  describe('User', () => {
    describe('GetMe', () => {
      it('Should return unauthorized', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });

      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });

    describe('EditMe', () => {});
  });

  describe('Bookmarks', () => {
    describe('CreateBookmark', () => {});

    describe('GetBookmarks', () => {});

    describe('GetBookmarkById', () => {});

    describe('EditBookmark', () => {});

    describe('DeleteBookmark', () => {});
  });

  afterAll(async () => {
    await app.close();
  });
});
