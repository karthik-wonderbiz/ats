import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  @Input() isOn?: boolean;
  @Output() toggle = new EventEmitter<void>();
  @Output() toggleOff = new EventEmitter<void>();

  onToggle(): void {
    this.toggle.emit();
  }

  onToggleOff(): void {
    this.toggleOff.emit();
  }
}
