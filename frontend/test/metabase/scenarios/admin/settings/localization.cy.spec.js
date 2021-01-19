import { restore, signInAsAdmin } from "__support__/cypress";
import { SAMPLE_DATASET } from "__support__/cypress_sample_dataset";

const { ORDERS, ORDERS_ID } = SAMPLE_DATASET;

describe("scenarios > admin > permissions", () => {
  before(restore);
  beforeEach(() => {
    signInAsAdmin();
    setFirstWeekDayTo("monday");
  });

  it("should correctly apply start of the week to a bar chart (metabase#13516)", () => {
    // programatically create and save a question based on Orders table
    // filter: created before June 1st, 2016
    // summarize: Count by CreatedAt: Week

    cy.request("POST", "/api/card", {
      name: "Orders created before June 1st 2016",
      dataset_query: {
        database: 1,
        query: {
          "source-table": ORDERS_ID,
          aggregation: [["count"]],
          breakout: [
            ["datetime-field", ["field-id", ORDERS.CREATED_AT], "week"],
          ],
          filter: ["<", ["field-id", ORDERS.CREATED_AT], "2016-06-01"],
        },
        type: "query",
      },
      display: "line",
      visualization_settings: {},
    });

    // find and open that question
    cy.visit("/collection/root");
    cy.findByText("Orders created before June 1st 2016").click();

    cy.log("**Assert the dates on the X axis**");
    // it's hard and tricky to invoke hover in Cypress, especially in our graphs
    // that's why we have to assert on the x-axis, instead of a popover that shows on a dot hover
    cy.get(".axis.x").contains("April 25, 2016");
  });

  it("should display days on X-axis correctly when grouped by 'Day of the Week' (metabase#13604)", () => {
    cy.request("POST", "/api/card", {
      name: "13604",
      dataset_query: {
        database: 1,
        query: {
          "source-table": ORDERS_ID,
          aggregation: [["count"]],
          breakout: [
            ["datetime-field", ["field-id", ORDERS.CREATED_AT], "day-of-week"],
          ],
          filter: [
            "between",
            ["field-id", ORDERS.CREATED_AT],
            "2020-03-02", // Monday
            "2020-03-03", // Tuesday
          ],
        },
        type: "query",
      },
      display: "bar",
      visualization_settings: {
        "graph.dimensions": ["CREATED_AT"],
        "graph.metrics": ["count"],
        "graph.x_axis.scale": "ordinal",
      },
    });

    cy.visit("/collection/root");
    cy.findByText("13604").click();

    cy.log("**Reported failing on v0.37.0.2 and labeled as `.Regression`**");
    cy.get(".axis.x")
      .contains(/sunday/i)
      .should("not.exist");
    cy.get(".axis.x").contains(/monday/i);
    cy.get(".axis.x").contains(/tuesday/i);
  });

  it.skip("should not display excessive options in localization tab (metabase#14426)", () => {
    cy.visit("/admin/settings/localization");
    cy.findByText(/Instance language/i);
    cy.findByText(/Report timezone/i);
    cy.findByText(/First day of the week/i);
    cy.findByText(/Localization options/i);
    cy.contains(/Column title/i).should("not.exist");
  });
});

function setFirstWeekDayTo(day) {
  cy.request("PUT", "/api/setting/start-of-week", {
    value: day.toLowerCase(),
  });
}
