# Pricing and Usage Limits Unification Plan

## Current State Analysis

### **Critical Finding: Multiple Systems in Conflict**

Currently **usage-tracking.ts is the ENFORCED system** in production for frontend, while:
- Database migration uses different limits
- Subscription.ts displays different values 
- Marketing copy promises inconsistent amounts

### **What's Actually Enforced (Priority Analysis)**

1. **Frontend Usage Enforcement** (usage-tracking.ts):
   ```
   free: { image: 3, video: 1 }
   pro: { image: 50, video: 5 }
   agency: { image: 200, video: 50 }
   enterprise: { image: 1000, video: 500 }
   ```

2. **Database Function** (migration 002):
   ```
   free: 1, pro: 1000, enterprise: 10000
   ```

3. **Edge Function** (db-schema.ts):
   ```
   free: 1, pro: 50, enterprise: 1000
   ```

4. **Constants.ts** (imported by subscription.ts):
   ```
   free: 1, pro: 25, agency: 200, enterprise: 2000
   ```

### **User Expectation Analysis**

Current messaging promises:
- **"3 free evaluations forever"** (Pricing FAQ)
- **"3 free evaluations per month"** (AuthModal)
- **1 base + 2 signup bonus = 3 total** (constants.ts comment)

## **Unified Solution Plan**

### **Phase 1: Immediate Consistency (Minimal Breaking Changes)**

**Decision: Align ALL systems to usage-tracking.ts limits** - This preserves current user experience and avoids reducing limits.

#### **1.1 Update Core Constants (Priority: HIGH)**
```typescript
// src/lib/constants.ts - UPDATE TO MATCH REALITY
export const TIER_LIMITS = {
  free: 3,      // Match usage-tracking.ts (1 base + 2 bonus = 3 total)
  pro: 50,      // Match usage-tracking.ts  
  agency: 200,  // Already consistent
  enterprise: 1000 // Match usage-tracking.ts (not 2000)
} as const;
```

#### **1.2 Fix Subscription Display Logic (Priority: HIGH)**
```typescript
// src/lib/subscription.ts - REMOVE CONFLICTING evaluationsPerMonth
// Keep only the feature descriptions, remove the redundant limits
// Use TIER_LIMITS from constants.ts as single source of truth
```

#### **1.3 Update Database Migration (Priority: MEDIUM)**
```sql
-- Update the database function limits to match frontend
-- Create new migration 003_fix_usage_limits.sql
CASE 
  WHEN user_tier = 'free' THEN 3
  WHEN user_tier = 'pro' THEN 50  
  WHEN user_tier = 'agency' THEN 200
  WHEN user_tier = 'enterprise' THEN 1000
END
```

#### **1.4 Fix Edge Function (Priority: MEDIUM)**
```typescript
// supabase/functions/evaluate-ad/db-schema.ts
export const TIER_LIMITS = {
  free: 3,      // Updated
  pro: 50,      // Already correct
  agency: 200,  // Add missing tier
  enterprise: 1000 // Updated from 1000 (keep consistent)
} as const;
```

### **Phase 2: Marketing Message Consistency (Priority: HIGH)**

#### **2.1 Unify Free Tier Messaging**
**Decision: "3 free evaluations per month"** (most accurate, sustainable)

**Updates needed:**
```tsx
// src/pages/Pricing.tsx - Line 193
"Better than a trial — you get 3 free evaluations per month. No credit card required."

// src/components/auth/AuthModal.tsx - Already correct
"Sign up to continue and get 3 free evaluations per month"
```

#### **2.2 Fix Annual Savings Calculation**
Current claim: "SAVE 17%" 
Actual calculation: 
- Pro: $290/year vs $348 (12 × $29) = 16.7% ✓
- Agency: $990/year vs $1188 (12 × $99) = 16.7% ✓
- Enterprise: $2990/year vs $3588 (12 × $299) = 16.7% ✓

**Action: Update to "SAVE 17%" is actually correct** - no change needed.

### **Phase 3: System Architecture Improvements (Priority: LOW)**

#### **3.1 Single Source of Truth**
```typescript
// Create src/lib/tier-config.ts
export const TIER_CONFIG = {
  free: {
    imageEvaluations: 3,
    videoEvaluations: 1,
    price: 0,
    features: ['3 image ad evaluations/month', '1 video preview', ...]
  },
  pro: {
    imageEvaluations: 50,
    videoEvaluations: 5, 
    price: 29,
    features: ['50 image ad evaluations/month', '5 video evaluations/month', ...]
  }
  // ... etc
}
```

#### **3.2 Remove Redundant Files**
- Deprecate separate limits in subscription.ts
- Import from tier-config.ts everywhere
- Update all components to use single config

## **Implementation Priority**

### **🔥 URGENT (Do First)**
1. **Fix constants.ts** - Line 6: `free: 3` (currently shows 1)
2. **Fix edge function** - Add agency tier, fix enterprise limit  
3. **Unify marketing copy** - "3 free evaluations per month" everywhere

### **📋 IMPORTANT (Do Second)**  
4. **Update database migration** - New migration with correct limits
5. **Clean up subscription.ts** - Remove redundant evaluationsPerMonth fields
6. **Test all enforcement points** - Ensure consistent behavior

### **🔧 NICE TO HAVE (Do Later)**
7. **Create single config file** - Centralize all tier definitions
8. **Add validation tests** - Prevent future discrepancies
9. **Update documentation** - Reflect correct limits everywhere

## **Risk Assessment**

### **LOW RISK Changes:**
- Updating constants.ts free tier: 1 → 3 (improves user experience)
- Fixing marketing copy consistency
- Database function updates (backend only)

### **MEDIUM RISK Changes:**
- Updating enterprise limit: 2000 → 1000 (could affect heavy users)
- Removing redundant subscription.ts fields (needs testing)

### **Mitigation Strategy:**
- Deploy constants.ts fix first (gives users more evaluations)
- Test thoroughly in staging
- Monitor usage patterns after deployment
- Add logging to track any issues

## **Expected Outcomes**

1. **Consistent user experience** - Same limits everywhere
2. **Accurate marketing** - Promises match reality  
3. **Simplified maintenance** - Single source of truth
4. **Improved trust** - No conflicting messages
5. **Better scalability** - Clean architecture for future changes

## **Success Metrics**

- [ ] All limit checks return same values across systems
- [ ] Marketing copy consistent on all pages
- [ ] Database functions match frontend logic
- [ ] No user complaints about unexpected limit behavior
- [ ] Clean codebase with single source of truth

---

**Recommendation: Start with Phase 1 (constants.ts + marketing copy) as it provides immediate value with minimal risk.**