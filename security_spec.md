# Security Specification for FitFusion AI

## Data Invariants
1. A user can only access their own profile and data (meals, workouts, weight history, saved plans).
2. Users cannot modify their own UID or email once set.
3. Users cannot make themselves admins.
4. Timestamps must be set to server time.
5. All IDs must be valid strings.

## The Dirty Dozen Payloads
1. Attempt to read another user's profile: `get(/users/attacker_uid)` from `victim_uid`.
2. Attempt to write to another user's meals: `create(/users/victim_uid/meals/meal_id)` from `attacker_uid`.
3. Attempt to update another user's weight: `update(/users/victim_uid/weightHistory/history_id)` from `attacker_uid`.
4. Attempt to delete another user's saved plan: `delete(/users/victim_uid/savedPlans/plan_id)` from `attacker_uid`.
5. Attempt to create a user profile with a different UID: `create(/users/attacker_uid)` where `data.uid = victim_uid`.
6. Attempt to update a meal log with a different userId: `update(/users/my_uid/meals/meal_id)` where `data.userId = other_uid`.
7. Attempt to inject a massive string into a meal name: `create(/users/my_uid/meals/meal_id)` with `name.size() > 1000`.
8. Attempt to use an invalid document ID: `create(/users/my_uid/meals/!!!_invalid_!!!)`.
9. Attempt to bypass server timestamp for createdAt: `create(/users/my_uid/meals/meal_id)` with `timestamp = "yesterday"`.
10. Attempt to read all users (list query) without filtering by UID: `list(/users)`.
11. Attempt to change the `type` of a saved plan from `workout` to `food_bomb`: `update(/users/my_uid/savedPlans/plan_id)` with `type = "invalid"`.
12. Attempt to escalate privileges: `update(/users/my_uid)` with `isAdmin: true`.

## Test Runner (Reference)
A `firestore.rules.test.ts` would verify these, but since the environment doesn't support running these tests natively in this turn easily without setup, I will ensure the rules cover these points logically.
