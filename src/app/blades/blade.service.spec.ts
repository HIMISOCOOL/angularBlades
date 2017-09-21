import { TestBed, inject } from '@angular/core/testing';

import { BladeService } from './blade.service';

describe('BladeService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BladeService]
        });
    });

    it('should be created', inject([BladeService], (service: BladeService) => {
        expect(service).toBeTruthy();
    }));
});
