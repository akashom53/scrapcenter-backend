import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('ApiService', () => {
    let service: ApiService;
    const mockResponse = { data: 'test' };
    const mockError = {
        response: { status: 404, data: 'Not found' },
        config: { url: '/test' }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiService]
        });

        // Initialize service first
        service = TestBed.inject(ApiService);

        // Then spy on its methods
        spyOn(service['axiosInstance'], 'get').and.returnValue(Promise.resolve(mockResponse));
    });

    it('should handle GET requests', async () => {
        const result = await service.get<string>('/test').toPromise();
        expect(result).toEqual('test');
    });

    describe('HTTP Methods', () => {
        it('should handle GET requests', (done) => {
            // No need to spy again, already done in beforeEach
            // If you need different behavior, reset the spy first

            service.get<string>('/test').subscribe({
                next: (res) => {
                    expect(res).toEqual('test');
                    done();
                }
            });
        });

        it('should handle POST errors', (done) => {
            // Reset the previous spy and create a new one for post
            spyOn(service['axiosInstance'], 'post').and.returnValue(Promise.reject(mockError));

            service.post<string>('/error', {}).subscribe({
                error: (err: HttpErrorResponse) => {
                    expect(err.status).toBe(404);
                    done();
                }
            });
        });

        // Similar tests for PUT, PATCH, DELETE
    });

    it('should configure base URL from environment', () => {
        // This test needs a different approach since we can't spy on axios.create after the service is created
        // Consider testing the environment configuration separately
        expect(service['axiosInstance'].defaults.baseURL).toBe(environment.apiUrl);
    });
});