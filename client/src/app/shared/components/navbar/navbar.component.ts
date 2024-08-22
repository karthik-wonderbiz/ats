import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
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
