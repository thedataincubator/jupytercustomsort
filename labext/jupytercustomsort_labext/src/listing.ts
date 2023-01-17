// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { DirListing } from '@jupyterlab/filebrowser';
import { Contents } from '@jupyterlab/services';
import {
  IIterator,
  toArray
} from '@lumino/algorithm';

export class CustomDirListing extends DirListing {
  sort(state: DirListing.ISortState): void {
    console.log("Look, ma, I'm sorting")
    // Access private attributes
    this['_sortedItems'] = Private.sort(this.model.items(), state);
    this['_sortState'] = state;
    this.update();
  }
}

namespace Private {
  export function sort(
    items: IIterator<Contents.IModel>,
    state: DirListing.ISortState
  ): Contents.IModel[] {
    const copy = toArray(items);
    const reverse = state.direction === 'descending' ? 1 : -1;

    if (state.key === 'last_modified') {
      // Sort by last modified (grouping directories first)
      copy.sort((a, b) => {
        const t1 = a.type === 'directory' ? 0 : 1;
        const t2 = b.type === 'directory' ? 0 : 1;

        const valA = new Date(a.last_modified).getTime();
        const valB = new Date(b.last_modified).getTime();

        return t1 - t2 || (valA - valB) * reverse;
      });
    } else {
      // Sort by name (grouping directories first)
      copy.sort((a, b) => {
        const t1 = a.type === 'directory' ? 0 : 1;
        const t2 = b.type === 'directory' ? 0 : 1;

        return t1 - t2 || b.name.localeCompare(a.name) * reverse;
      });
    }
    return copy;
  }
}
