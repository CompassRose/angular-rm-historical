import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>('Local Storage');
export const SESSION_STORAGE = new InjectionToken<Storage>('Session Storage');
