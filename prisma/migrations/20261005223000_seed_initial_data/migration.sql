-- Seed initial categories, group, participants, and expense to keep database active
INSERT INTO "Category" (id, grouping, name) VALUES (0, 'General', 'Uncategorized') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Category" (id, grouping, name) VALUES (1, 'Entertainment', 'Food & Dining') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Group" (id, name, information, currency, "currencyCode") VALUES ('demo-group-welcome', 'Welcome & Demo Group', 'Initial group created to keep database active.', '₹', 'INR') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Participant" (id, name, "groupId") VALUES ('part-1', 'Alex', 'demo-group-welcome'), ('part-2', 'Sam', 'demo-group-welcome'), ('part-3', 'Jordan', 'demo-group-welcome') ON CONFLICT (id) DO NOTHING;
INSERT INTO "Expense" (id, "groupId", title, amount, "originalAmount", "originalCurrency", "paidById", "categoryId") VALUES ('exp-sample-1', 'demo-group-welcome', 'Team Welcome Dinner', 150000, 150000, 'INR', 'part-1', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO "ExpensePaidFor" ("expenseId", "participantId", shares) VALUES ('exp-sample-1', 'part-1', 1), ('exp-sample-1', 'part-2', 1), ('exp-sample-1', 'part-3', 1) ON CONFLICT ("expenseId", "participantId") DO NOTHING;
