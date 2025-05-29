import { effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Lead, LeadsService } from '../services/leads/leads.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

type AppState = {
    isLoading: boolean;
    route: string;
    leads: Lead[]
}


const initialAppState: AppState = {
    isLoading: false,
    route: '',
    leads: [],
}



export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialAppState),
    withMethods((
        store,
        router = inject(Router),
        leadsService = inject(LeadsService),
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
        })
    })
);