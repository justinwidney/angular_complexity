// chip-list.component.ts
import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-chip-list',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['my-filters.component.scss'],
  template: `
    <mat-chip-set aria-label="Selected filters">
      <mat-chip-row 
        *ngFor="let chip of chips" 
        removable 
        (removed)="remove.emit(chip)"
      >
        {{ chip }}
        <button matChipRemove >
          <goa-icon-button 
            variant="dark" 
            size="small" 
            icon="close-circle" 
            ariaLabel="Remove icon"
          ></goa-icon-button>
        </button>
      </mat-chip-row>
    </mat-chip-set>
  `
})
export class ChipListComponent {

  @Input() chips: string[] = [];
  @Output() remove = new EventEmitter<string>();




}