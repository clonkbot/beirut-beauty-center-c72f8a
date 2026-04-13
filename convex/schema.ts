import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // Consultation requests from potential clients
  consultations: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    serviceInterest: v.string(),
    message: v.optional(v.string()),
    preferredContact: v.string(), // "phone", "whatsapp", "email"
    status: v.string(), // "pending", "contacted", "scheduled", "completed"
    createdAt: v.number(),
    userId: v.optional(v.id("users")),
  }).index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  // Services offered
  services: defineTable({
    name: v.string(),
    slug: v.string(),
    category: v.string(), // "electrolysis", "permanent-makeup", "facial", "body"
    shortDescription: v.string(),
    fullDescription: v.string(),
    duration: v.optional(v.string()),
    featured: v.boolean(),
    order: v.number(),
    createdAt: v.number(),
  }).index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_slug", ["slug"]),

  // FAQ items
  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    order: v.number(),
    createdAt: v.number(),
  }).index("by_category", ["category"]),

  // Contact messages
  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    status: v.string(), // "unread", "read", "replied"
    createdAt: v.number(),
  }).index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  // AI Consultation conversations
  aiConsultations: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.id("users")),
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
      timestamp: v.number(),
    })),
    recommendedServices: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_session", ["sessionId"])
    .index("by_user", ["userId"]),

  // Testimonials (placeholders for verified reviews)
  testimonials: defineTable({
    clientInitials: v.string(),
    content: v.string(),
    serviceType: v.string(),
    verified: v.boolean(),
    googleReviewId: v.optional(v.string()),
    featured: v.boolean(),
    createdAt: v.number(),
  }).index("by_featured", ["featured"]),
});
