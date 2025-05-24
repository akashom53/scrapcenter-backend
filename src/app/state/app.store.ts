import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type AppState = {
    isLoading: boolean;

}


const initialAppState: AppState = {
    isLoading: false,
}

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialAppState),
    withMethods((store) => ({
        setLoading: (isLoading: boolean) => {
            patchState(store, { isLoading });
        },
    }))
);