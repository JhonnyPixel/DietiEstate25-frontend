(window as any).global = window;
(window as any).Buffer = (window as any).Buffer || require('buffer').Buffer;
(window as any).process = {
  env: { DEBUG: undefined },
};
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';



bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
