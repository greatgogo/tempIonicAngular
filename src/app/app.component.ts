import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private readonly translate: TranslateService) {
    this.initializeTranslation();
  }

  private initializeTranslation() {
    const defaultLang = 'en';
    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang); // Use the default language
  }
}
