// accordion-filters.component.ts
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input } from '@angular/core';
import { FilterService } from './filter.service';
import { FilterSection } from '../home/types';
import { MatChipsModule } from '@angular/material/chips';
import { ChipListComponent } from "./chip-list.component";
import { CommonModule } from '@angular/common';
import { ForceRowTitleDirective } from './force-row-title-directive';

@Component({
  selector: 'app-accordion-filters',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatChipsModule, CommonModule,     ForceRowTitleDirective  ],
  templateUrl: 'accordian-filters.component.html',
})
export class AccordionFiltersComponent {
 
  @Input() sections!: FilterSection[];

  constructor(
    public filterSvc: FilterService, 
    private el: ElementRef<HTMLElement>,
    private cd: ChangeDetectorRef
  ) {


  }



  hasUpdates(section: FilterSection): boolean {

    return section.items.some(item => item.selected);
  }




  toggle(value: string) {
    const svc = this.filterSvc;
    const already = svc.accordionChips().includes(value);

    // 1) update service
    if (already) {
      svc.removeAccordion(value);
    } else {
      svc.addAccordion(value);
    }

    // 2) flip the item.selected in your in-memory sections
    for (const section of this.sections) {
      const itm = section.items.find(i => i.value === value);
      if (itm) {
        itm.selected = !already;
        break;
      }
    }

    this.cd.markForCheck(); 
    console.log("Change Detector Ref", this.cd)
  }

  handleDropdownRemove(labelOrEvent: string | Event) {

    console.log('handleDropdownRemove', labelOrEvent);


    const label = typeof labelOrEvent === 'string'
      ? labelOrEvent
      : (labelOrEvent as unknown as string);
      this.filterSvc.removeAccordion(label);

      for (const sec of this.sections) {
        const it = sec.items.find(i => i.value === label);
        if (it) {
          it.selected = false;
          break;
        }
      }


  }

}