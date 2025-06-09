
import { computed, Injectable, signal, WritableSignal } from '@angular/core';

export interface FilterState {
  dropdownMap: Record<string,string>;
  accordion: string[];
}

@Injectable({ providedIn: 'root' })

export class FilterService {

    private _state: WritableSignal<FilterState> = signal({
      dropdownMap: {},    // keys: “geoA” or “geoB”

      accordion: [],
    });

    readonly dropdownChips = computed(() => Object.values(this._state().dropdownMap));
    readonly accordionChips = computed(() => this._state().accordion);

      /** 
     * Add/Update Chips based on Geo Dropdowns
     */
      setDropdown(id: string, label: string) {
        this._state.update(s => ({
          ...s,
          dropdownMap: { ...s.dropdownMap, [id]: label }
        }));
      }


      removeDropdown(label: string) {
        this._state.update(s => {
          const m = { ...s.dropdownMap };
          for (const key of Object.keys(m)) {
            if (m[key] === label) {
              delete m[key];
              break;
            }
          }
          return { ...s, dropdownMap: m };
        });
      }


    

        /** 
       * Add a chip based on accordion buttons
       */

      addAccordion(label: string) {
        const arr = this._state().accordion;
        if (arr.length >= 2 || arr.includes(label)) return;
        this._state.update(s => ({ ...s, accordion: [...s.accordion, label] }));

      }
      removeAccordion(label: string) {
        this._state.update(s => ({ ...s, accordion: s.accordion.filter(l => l !== label) }));
      }
      
}