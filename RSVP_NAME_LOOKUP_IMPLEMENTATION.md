# RSVP Name Lookup Implementation

## Overview
This implementation adds flexible RSVP sign-in options controlled by a Firebase flag. Users can either sign in with their traditional RSVP code or search for their invitation by name, based on a policy configuration.

## Features Implemented

### 1. Policy-Controlled Sign-in Options
- **Firebase Policy Document**: `rsvp/policy` collection with `allowNameLookup` boolean flag
- **Dynamic UI**: Shows either code-only or dual sign-in options based on the flag
- **Context Provider**: `RsvpPolicyProvider` fetches and provides policy data across the app

### 2. Name Lookup Functionality
- **Search by First and Last Name**: Users enter both first and last names in separate fields for better matching accuracy
- **Intelligent Matching**: Uses a scoring algorithm that considers:
  - Exact name matches (highest score)
  - Partial name matches
  - Full name containing both search terms
- **Sorted Results**: Search results are sorted by match quality, with the best matches shown first
- **Comprehensive Search**: Searches both primary invitee names and guest names
- **Radio Selection**: Users select their specific name from search results with "Best match" indicators

### 3. Updated Components

#### New Components:
- `RsvpPolicyProvider.tsx` - Context provider for policy data
- `RsvpPolicyContext.tsx` - React context for policy
- `IRsvpPolicyData.ts` - TypeScript interface for policy data
- `useRsvpPolicy.ts` - Custom hook to access policy data
- `RsvpNameLookup.tsx` - Name search and selection component
- `SignInMethodSelection.tsx` - Component to choose between code/name sign-in

#### Modified Components:
- `RsvpSignIn.tsx` - Now orchestrates different sign-in modes
- `App.tsx` - Added `RsvpPolicyProvider` to the protected layout

### 4. User Experience Flow

#### When `allowNameLookup = true`:
1. User sees two sign-in options: "Sign in with RSVP Code" and "Sign in with Name"
2. If they choose code: original RSVP code flow
3. If they choose name: 
   - Enter first and last name in separate fields
   - View search results sorted by match quality (best matches first)
   - Select their name and continue to RSVP form

#### When `allowNameLookup = false`:
1. User goes directly to the RSVP code sign-in (original behavior)

### 5. Error Handling & Analytics
- Maintains existing error tracking and analytics
- Adds new analytics events for name-based lookups
- Graceful fallback to code-only mode if policy fetch fails
- Proper error messages for failed name searches

### 6. Firebase Structure Required

The Firebase `rsvp` collection should include a `policy` document:
```javascript
{
  allowNameLookup: true  // or false
}
```

### 7. Security & Performance Considerations
- Name search fetches all RSVP documents but filters client-side for optimal UX
- Excludes the policy document from search results
- Maintains existing deadline and validation checks
- Same authentication requirements as original RSVP flow

## Usage
1. Set the `allowNameLookup` flag in Firebase `rsvp/policy` collection
2. The UI automatically adapts based on this flag
3. No additional configuration needed - the feature is fully backward compatible

## Backward Compatibility
- When `allowNameLookup = false` or policy document doesn't exist, behaves exactly like the original code-only system
- All existing RSVP codes continue to work normally
- No breaking changes to existing functionality
