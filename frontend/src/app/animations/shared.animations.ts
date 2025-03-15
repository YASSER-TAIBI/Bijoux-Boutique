import { animate, style, transition, trigger } from '@angular/animations';

export const fadeSlideInAnimation = trigger('fadeSlideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);
