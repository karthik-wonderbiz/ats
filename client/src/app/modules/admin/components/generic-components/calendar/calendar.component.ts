import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnChanges {

  @Input() eventJsonData: string = '[]'; // Input property for event JSON data

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    events: []
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventJsonData']) {
      this.updateEvents();
    }
  }

  private updateEvents(): void {
    try {
      const events: { title: string; date: string; type: string }[] = JSON.parse(this.eventJsonData);

      this.calendarOptions.events = events.map(event => ({
        title: event.title,
        start: event.date,
        backgroundColor: this.getColorByType(event.type) // Color code based on type
      }));
    } catch (error) {
      console.error('Failed to parse event data:', error);
    }
  }

  private getColorByType(type: string): string {
    switch (type) {
      case 'absent':
        return 'red';
      case 'present':
        return 'green';
      default:
        return 'blue'; // Default color
    }
  }
}
