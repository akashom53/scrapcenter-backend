import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { ApiService } from '../core/services/api.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
    let service: AuthService;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;

    const correctCredentials = {
        email: 'akash@email.codm',
        password: '123456'
    };

    const incorrectCredentials = {
        email: 'wrong@email.com',
        password: 'wrongpass'
    };

    const mockSuccessResponse = {
        access_token: 'abcd'
    };

    const mockErrorResponse = {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
    };

    beforeEach(() => {
        // Create spy for ApiService
        const spy = jasmine.createSpyObj('ApiService', ['post']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthService,
                { provide: ApiService, useValue: spy }
            ]
        });

        service = TestBed.inject(AuthService);
        apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('should return access token for correct credentials', (done) => {
            // Setup spy to return success response
            apiServiceSpy.post.and.returnValue(of(mockSuccessResponse));

            // Spy on localStorage
            spyOn(localStorage, 'setItem');

            // Call the login method
            service.login(correctCredentials.email, correctCredentials.password).subscribe({
                next: (response) => {
                    // Check response
                    expect(response).toEqual(mockSuccessResponse);

                    // Verify API was called with correct data
                    expect(apiServiceSpy.post).toHaveBeenCalledWith(
                        '/auth/login',
                        { email: correctCredentials.email, password: correctCredentials.password }
                    );

                    // Verify token was stored
                    expect(localStorage.setItem).toHaveBeenCalledWith(
                        'access_token',
                        mockSuccessResponse.access_token
                    );

                    done();
                },
                error: (error) => {
                    fail('Expected successful login but got error: ' + error);
                    done();
                }
            });
        });

        it('should return error for incorrect credentials', (done) => {
            // Setup spy to return error response
            const httpError = new HttpErrorResponse({
                error: mockErrorResponse,
                status: 401
            });

            apiServiceSpy.post.and.returnValue(throwError(() => httpError));

            // Call the login method
            service.login(incorrectCredentials.email, incorrectCredentials.password).subscribe({
                next: () => {
                    fail('Expected error but got successful response');
                    done();
                },
                error: (error) => {
                    // Check error message
                    expect(error.message).toContain('Invalid credentials');

                    // Verify API was called with incorrect data
                    expect(apiServiceSpy.post).toHaveBeenCalledWith(
                        '/auth/login',
                        { email: incorrectCredentials.email, password: incorrectCredentials.password }
                    );

                    done();
                }
            });
        });

        it('should validate email format', (done) => {
            service.login('invalid-email', correctCredentials.password).subscribe({
                next: () => {
                    fail('Expected validation error but got successful response');
                    done();
                },
                error: (error) => {
                    expect(error.message).toContain('valid email');
                    // API should not be called for invalid email
                    expect(apiServiceSpy.post).not.toHaveBeenCalled();
                    done();
                }
            });
        });

        it('should validate password length', (done) => {
            service.login(correctCredentials.email, '12345').subscribe({
                next: () => {
                    fail('Expected validation error but got successful response');
                    done();
                },
                error: (error) => {
                    expect(error.message).toContain('at least 6 characters');
                    // API should not be called for invalid password
                    expect(apiServiceSpy.post).not.toHaveBeenCalled();
                    done();
                }
            });
        });
    });
});