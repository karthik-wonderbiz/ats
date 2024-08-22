import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.css'
})

export class SectionComponent {

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
