import { MetaReducer } from '@ngrx/store';
import { AppState } from './app.state';
import { isDevMode } from '@angular/core';

// Meta-reducers can intercept all actions (useful for logging, hydration, etc.)
export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
