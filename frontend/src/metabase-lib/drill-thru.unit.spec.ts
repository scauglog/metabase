import { availableDrillThrus } from "metabase-lib/drill-thru";
import { fieldableColumns } from "metabase-lib/fields";
import { columnFinder, createQuery } from "./test-helpers";

describe("availableDrillThrus", () => {
  it("should return list of available drills", () => {
    const query = createQuery();
    const stageIndex = -1;
    const columns = fieldableColumns(query, stageIndex);
    const column = columnFinder(query, columns)("ORDERS", "TOTAL");

    expect(availableDrillThrus(query, stageIndex, column)).toEqual({});
  });
});
