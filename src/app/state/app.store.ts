import { effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type AppState = {
    isLoading: boolean;
    route: string;
}


const initialAppState: AppState = {
    isLoading: false,
    route: ''
}

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialAppState),
    withMethods((
        store,
        router = inject(Router),
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
            }
        })
    })
);