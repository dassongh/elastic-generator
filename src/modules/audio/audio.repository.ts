import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { Audio } from './audio.entity';

@Injectable()
export class AudioRepository extends Repository<Audio> {
  constructor(dataSource: DataSource) {
    super(Audio, dataSource.createEntityManager());
  }
}
