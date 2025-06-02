import { effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Lead } from '../models/lead.model';
import { LeadsService } from '../services/leads/leads.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { User, UsersService } from '../services/users.service';

type AppState = {
    isLoading: boolean;
    route: string;
    leads: Lead[];
    users: User[];
}


const initialAppState: AppState = {
    isLoading: false,
    route: '',
    leads: [],
    users: [],
}



export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialAppState),
    withMethods((
        store,
        router = inject(Router),
        leadsService = inject(LeadsService),
        usersService = inject(UsersService),
    ) => {
        effect(() => {
            router.navigate([store.route()]);
        })
        return ({
            setLoading: (isLoading: boolean) => {
                patchState(store, { isLoading });
            },
            navigate: (route: string) => {
                patchState(store, { route });
            },
            back: () => {
                patchState(store, (oldState) => ({ route: oldState.route.slice(0, oldState.route.lastIndexOf('/')) }));
            },
            fetchLeads: rxMethod<void>(
                pipe(
                    tap(() => {
                        patchState(store, { isLoading: true });
                    }),
                    switchMap(() => leadsService.getLeads()
                        .pipe(
                            tapResponse({
                                next: (leads) => {
                                    leads.sort((a, b) => {
                                        const dateA = new Date(a.createdAt ?? '');
                                        const dateB = new Date(b.createdAt ?? '');

                                        const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
                                        const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();

                                        return timeB - timeA;
                                    });
                                    patchState(store, { leads, isLoading: false });
                                    console.log(leads);
                                },
                                error: (err) => {
                                    patchState(store, { isLoading: false });
                                    console.error(err);
                                },
                            })
                        )
                    ),
                )
            ),
            fetchUsers: rxMethod<void>(
                pipe(
                    tap(() => {
                        patchState(store, { isLoading: true });
                    }),
                    switchMap(() => usersService.getAllUsers()
                        .pipe(
                            tapResponse({
                                next: (users) => {
                                    patchState(store, { users, isLoading: false });
                                },
                                error: (err) => {
                                    patchState(store, { isLoading: false });
                                    console.error(err);
                                },
                            })
                        )
                    ),
                )
            ),
            setAdmin: rxMethod<User>(
                pipe(
                    tap(() => {
                        patchState(store, { isLoading: true });
                    }),
                    switchMap((user) => usersService.updateUser(user.id, {
                        isAdmin: true,
                    })
                        .pipe(
                            tapResponse({
                                next: (user) => {
                                    patchState(store, { users: store.users().map(u => u.id === user.id ? user : u) });
                                },
                                error: (err) => {
                                    patchState(store, { isLoading: false });
                                    console.error(err);
                                },
                            })
                        )
                    ),
                )
            ),
            setApproved: rxMethod<User>(
                pipe(
                    tap(() => {
                        patchState(store, { isLoading: true });
                    }),
                    switchMap((user) => usersService.updateUser(user.id, {
                        isApproved: true,
                    })
                        .pipe(
                            tapResponse({
                                next: (user) => {
                                    patchState(store, { users: store.users().map(u => u.id === user.id ? user : u) });
                                },
                                error: (err) => {
                                    patchState(store, { isLoading: false });
                                    console.error(err);
                                },
                            })
                        )
                    ),
                )
            ),
        })
    })
);