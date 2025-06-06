import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmText: string = 'OK';
  @Input() cancelText: string = 'Cancel';

  onConfirm() {
    // Emit confirm event or handle logic
  }

  onCancel() {
    // Emit cancel event or handle logic
  }
}
