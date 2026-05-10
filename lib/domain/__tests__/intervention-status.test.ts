import {
  isValidStatusTransition,
  getAllowedTransitions,
} from "../intervention-status";

describe("intervention-status state machine", () => {
  describe("happy path", () => {
    it("planned → in_progress is allowed", () => {
      expect(isValidStatusTransition("planned", "in_progress")).toBe(true);
    });
    it("in_progress → completed is allowed", () => {
      expect(isValidStatusTransition("in_progress", "completed")).toBe(true);
    });
    it("planned → postponed is allowed", () => {
      expect(isValidStatusTransition("planned", "postponed")).toBe(true);
    });
    it("postponed → planned is allowed (rescheduled)", () => {
      expect(isValidStatusTransition("postponed", "planned")).toBe(true);
    });
  });

  describe("idempotent self-transitions", () => {
    it.each([
      ["planned"],
      ["in_progress"],
      ["completed"],
      ["cancelled"],
      ["postponed"],
    ] as const)("%s → %s is allowed", (s) => {
      expect(isValidStatusTransition(s, s)).toBe(true);
    });
  });

  describe("forbidden transitions", () => {
    it("completed → planned is rejected (terminal)", () => {
      expect(isValidStatusTransition("completed", "planned")).toBe(false);
    });
    it("completed → in_progress is rejected", () => {
      expect(isValidStatusTransition("completed", "in_progress")).toBe(false);
    });
    it("cancelled → planned is rejected (terminal)", () => {
      expect(isValidStatusTransition("cancelled", "planned")).toBe(false);
    });
    it("in_progress → planned is rejected (no rewind)", () => {
      expect(isValidStatusTransition("in_progress", "planned")).toBe(false);
    });
    it("in_progress → postponed is rejected", () => {
      expect(isValidStatusTransition("in_progress", "postponed")).toBe(false);
    });
  });

  describe("getAllowedTransitions", () => {
    it("returns full set for planned", () => {
      expect(getAllowedTransitions("planned").sort()).toEqual(
        ["planned", "in_progress", "cancelled", "postponed"].sort()
      );
    });
    it("returns only self for completed (terminal)", () => {
      expect(getAllowedTransitions("completed")).toEqual(["completed"]);
    });
    it("returns only self for cancelled (terminal)", () => {
      expect(getAllowedTransitions("cancelled")).toEqual(["cancelled"]);
    });
  });
});
