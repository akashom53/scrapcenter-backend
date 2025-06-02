import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { AuthService, LoginRequest } from "../auth.service";
import { finalize, pipe, switchMap, tap } from "rxjs";
import { computed, effect, inject } from "@angular/core";
import { tapResponse } from '@ngrx/operators'
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStore } from "../../state/app.store";
import { Router } from "@angular/router";
import { User } from "../../services/users.service";




type AuthState = {
    isAuthenticated: boolean;
    accessToken: string;
    user: User | null;
    error: string | null;
}

const initialAuthState: AuthState = {
    isAuthenticated: !!localStorage.getItem('access_token'),
    accessToken: localStorage.getItem('access_token') ?? '',
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    error: null,
}

const emptyAuthState: AuthState = {
    isAuthenticated: false,
    accessToken: '',
    user: null,
    error: null,
}

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialAuthState),
    withComputed((store) => ({
        isAdmin: computed(() => store.user()?.isAdmin ?? false),
        isApproved: computed(() => {
            return store.user()?.isApproved ?? false
        }),
    })),
    withMethods((
        store,
        authService = inject(AuthService),
        snackbar = inject(MatSnackBar),
        appStore = inject(AppStore)) => {
        effect(() => {
            const isAuth = store.isAuthenticated;
            if (!isAuth()) {
                localStorage.removeItem('access_token');
                patchState(store, emptyAuthState)
                appStore.navigate('/login');
            } else {
                appStore.navigate('/');
            }
        })
        return ({
            login: rxMethod<LoginRequest>(
                pipe(
                    tap(() => appStore.setLoading(true)),
                    switchMap((request) =>
                        authService.login(request, true).pipe(
                            tapResponse({
                                next: (response) => {
                                    localStorage.setItem('user', JSON.stringify(response.user));
                                    patchState(store, (state) => ({
                                        isAuthenticated: true,
                                        accessToken: response.user.isApproved ? response.access_token : '',
                                        user: response.user,
                                        error: response.user.isApproved ? null : 'User is not approved',
                                    }));

                                },
                                error: (err) => {
                                    snackbar.open('Error Logging In', 'Close', {
                                        duration: 3000,
                                        horizontalPosition: 'center',
                                        verticalPosition: 'top',

                                    });
                                    console.error(err);
                                    patchState(store, (state) => ({
                                        error: 'Error Logging In',
                                    }));
                                },
                            }),
                            finalize(() => appStore.setLoading(false)),
                        )
                    ),
                )
            ),
            logout: () => {
                localStorage.removeItem('access_token');
                patchState(store, emptyAuthState);
            }
        })
    }
    ),

);