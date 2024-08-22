import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {

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
