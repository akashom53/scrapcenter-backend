import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { routes } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      ReactiveFormsModule,
      FormlyModule.forRoot({
        validationMessages: [
          { name: 'required', message: 'This field is required' },
        ],
      }),
      FormlyMaterialModule,
    ),
  ]
};
