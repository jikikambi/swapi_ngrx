import { animate, state, style, transition, trigger } from '@angular/animations';

export const expandCollapse = trigger('expandCollapse', [
  state(
    'expanded',
    style({ height: '*', opacity: 1, overflow: 'hidden' })
  ),
  state(
    'collapsed',
    style({ height: '0px', opacity: 0, overflow: 'hidden' })
  ),
  transition('expanded <=> collapsed', animate('300ms ease-in-out')),
]);