// force-row-title.directive.ts
import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'goa-accordion'            // match every goa-accordion
})
export class ForceRowTitleDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const accordion = this.el.nativeElement;
    const sr = accordion.shadowRoot;
    if (!sr) return;

    // only inject once
    if (sr.getElementById('force-row-title-style')) return;

    const style = document.createElement('style');
    style.id = 'force-row-title-style';
    style.textContent = `
      /* force the hidden .title into a row */
      .title.svelte-1g8h5ss {
        display: flex !important;
        flex-direction: row !important;
      }
    `;
    sr.appendChild(style);
  }
}