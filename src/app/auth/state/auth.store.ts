import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { AuthService, LoginRequest } from "../auth.service";
import { finalize, pipe, switchMap, tap } from "rxjs";
import { effect, inject } from "@angular/core";
import { tapResponse } from '@ngrx/operators'
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStore } from "../../state/app.store";
import { Router } from "@angular/router";




type AuthState = {
    isAuthenticated: boolean;
    accessToken: string;
}

const initialAuthState: AuthState = {
    isAuthenticated: false,
    accessToken: '',
}

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialAuthState),
    withMethods((
        store,
        authService = inject(AuthService),
        snackbar = inject(MatSnackBar),
        appStore = inject(AppStore)) => {
        effect(() => {
            const isAuth = store.isAuthenticated;
            if (!isAuth()) {
                localStorage.removeItem('access_token');
                patchState(store, initialAuthState)
                appStore.navigate('/login');
            } else {
                appStore.navigate('/home');
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
                                    patchState(store, (state) => ({
                                        accessToken: response.access_token,
                                        isAuthenticated: true,
                                    }));
                                },
                                error: (err) => {
                                    snackbar.open('Error Logging In', 'Close', {
                                        duration: 3000,
                                        horizontalPosition: 'center',
                                        verticalPosition: 'top',

                                    });
                                    console.error(err);
                                },
                            }),
                            finalize(() => appStore.setLoading(false)),
                        )
                    ),
                )
            ),
            logout: () => {
                patchState(store, initialAuthState);
            }
        })
    }
    ),

);