import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { Image } from './image.entity';

@Injectable()
export class ImageRepository extends Repository<Image> {
  constructor(dataSource: DataSource) {
    super(Image, dataSource.createEntityManager());
  }
}
