import { Signal, WritableSignal } from '@angular/core';

export interface Section<T> {
    title: string;
    data: WritableSignal<T[]>;
    type: string;
    expanded: boolean;
    hasData: Signal<boolean>;
}