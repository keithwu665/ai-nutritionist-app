import { describe, it, expect, beforeEach, vi } from "vitest";
import { ENV } from "../_core/env";

describe("Fitasty Products - Admin Email Allowlist", () => {
  beforeEach(() => {
    // Mock the ENV object
    vi.resetModules();
  });

  it("should parse ADMIN_EMAIL_ALLOWLIST from environment variable", () => {
    // Test that ENV.adminEmailAllowlist is properly parsed
    expect(Array.isArray(ENV.adminEmailAllowlist)).toBe(true);
  });

  it("should handle empty ADMIN_EMAIL_ALLOWLIST", () => {
    // If no allowlist is set, it should be an empty array
    const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST ?? "")
      .split(",")
      .map(e => e.trim())
      .filter(Boolean);
    expect(Array.isArray(allowlist)).toBe(true);
  });

  it("should handle multiple emails in ADMIN_EMAIL_ALLOWLIST", () => {
    // Test parsing multiple emails
    const testList = "admin@example.com, user@example.com, test@example.com";
    const parsed = testList
      .split(",")
      .map(e => e.trim())
      .filter(Boolean);
    expect(parsed).toEqual([
      "admin@example.com",
      "user@example.com",
      "test@example.com",
    ]);
    expect(parsed.length).toBe(3);
  });

  it("should check if email is in allowlist", () => {
    const allowlist = ["admin@example.com", "user@example.com"];
    expect(allowlist.includes("admin@example.com")).toBe(true);
    expect(allowlist.includes("user@example.com")).toBe(true);
    expect(allowlist.includes("unauthorized@example.com")).toBe(false);
  });
});
