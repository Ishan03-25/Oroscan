# User Role System

## Roles

The system now supports three user roles:

1. **ADMIN** - Full system access, routes to admin panel (localhost:3001)
2. **DOCTOR** - Medical professionals who can diagnose patients
3. **HEALTH_ASSISTANT** - Can register patients and collect data (default role)

## Setting Up an Admin User

To set a user as admin, run:

```bash
npm run set-admin
# or
pnpm run set-admin
# or
npx tsx scripts/set-admin.ts
```

This will prompt you to enter a username or email and confirm the change.

## Login Flow

- **ADMIN users** → Redirected to Admin Panel (http://localhost:3001)
- **DOCTOR/HEALTH_ASSISTANT users** → Redirected to Dashboard (http://localhost:3000/dashboard)

## Database Schema

The `User` model now includes:
- `role` field (enum: ADMIN, DOCTOR, HEALTH_ASSISTANT)
- Default role is HEALTH_ASSISTANT
- Legacy `isDoctor` field is retained for compatibility

## Migration

Run this to apply the schema changes:
```bash
pnpm prisma migrate dev
```

Existing users have been updated with appropriate roles based on their `isDoctor` status.
