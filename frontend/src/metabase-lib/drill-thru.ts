import * as ML from "cljs/metabase.lib.js";
import type { ColumnMetadata, Query } from "./types";

// Get a list (possibly empty) of available drill-thrus for a column, or a column + value pair
export function availableDrillThrus(
  query: Query,
  stageNumber: number,
  column: ColumnMetadata,
  value?: unknown,
) {
  if (value != null) {
    return ML.available_drill_thrus(query, stageNumber, column, value);
  }

  return ML.available_drill_thrus(query, stageNumber, column);
}

// Applies the given `drill-thru` to the specified query and stage. Returns the updated query
// ML.drill_thru;

// Returns an array of pivotable columns of the specified type
// ML.pivot_columns_for_type;

// Returns an array of pivot types that are available in this drill-thru, which must be a pivot drill-thru
// ML.pivot_types;
