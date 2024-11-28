import { TestBed } from '@angular/core/testing';

import { GraphqlLinkService } from './graphql.link.service';

describe('GraphqlLinkService', () => {
  let service: GraphqlLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphqlLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
