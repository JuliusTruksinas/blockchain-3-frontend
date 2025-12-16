# Tutor Marketplace DApp - System Guide

## Overview
This is a fully functional decentralized tutor marketplace that uses **localStorage** to persist all data. The system is ready for Web3 integration but currently operates with hardcoded users and simulated blockchain events.

## Architecture

### Hardcoded Users (in `/services/dataService.ts`)
```typescript
HARDCODED_USERS = {
  student: {
    address: '0x1234567890123456789012345678901234567890',
    name: 'Alice Johnson',
    role: 'student'
  },
  tutor: {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    name: 'Dr. Sarah Chen',
    role: 'tutor'
  },
  admin: {
    address: '0xADMIN00000000000000000000000000000000000',
    name: 'Admin User',
    role: 'admin'
  }
}
```

## Smart Contract Events (Implemented)

All blockchain events are implemented as functions in `/services/dataService.ts`:

### 1. **SessionRequested**
- **Function:** `requestSession()`
- **Triggered by:** Student booking a session
- **Parameters:** studentAddress, tutorAddress, tutorName, subject, date, duration, amount, details
- **Action:** Creates a new session with `status: 'pending'`, deposits amount to escrow
- **Location:** `/components/BookingModal.tsx`

### 2. **SessionAccepted**
- **Function:** `acceptSession(sessionId)`
- **Triggered by:** Tutor accepting a session request
- **Action:** Changes session status from `pending` to `accepted`
- **Location:** `/components/MySessions.tsx` (Tutor view)

### 3. **SessionRejected**
- **Function:** `rejectSession(sessionId)`
- **Triggered by:** Tutor rejecting a session request
- **Action:** Changes session status to `rejected`, refunds student
- **Location:** `/components/MySessions.tsx` (Tutor view)

### 4. **SessionCompleted**
- **Function:** `completeSession(sessionId)`
- **Triggered by:** Tutor marking session as delivered
- **Action:** Changes session status from `accepted` to `delivered`
- **Location:** `/components/MySessions.tsx` (Tutor view)

### 5. **SessionConfirmed**
- **Function:** `confirmSession(sessionId)`
- **Triggered by:** Student confirming session completion
- **Action:** Changes session status to `confirmed`, releases funds to tutor
- **Location:** `/components/MySessions.tsx` (Student view)

### 6. **DisputeOpened**
- **Function:** `openDispute(sessionId, studentAddress, tutorAddress, reason)`
- **Triggered by:** Student opening a dispute
- **Action:** Changes session status to `disputed`, creates dispute record
- **Location:** `/components/DisputeModal.tsx`

### 7. **DisputeResolved**
- **Function:** `resolveDispute(disputeId, decision, favorStudent)`
- **Triggered by:** Admin resolving a dispute
- **Parameters:** disputeId, decision string, favorStudent boolean
- **Action:** Marks dispute as resolved, updates session status to `resolved`
- **Location:** `/components/AdminDashboard.tsx`

## How to Modify Actions

### Adding a New Action

1. **Add the function to `/services/dataService.ts`:**
```typescript
export function yourNewAction(sessionId: number, otherParams: any): boolean {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session) {
    return false;
  }
  
  // Perform your action
  session.status = 'newStatus';
  saveSessions(sessions);
  
  // Log the blockchain event
  logEvent({
    type: 'YourNewEvent',
    sessionId,
    timestamp: Date.now(),
    data: { /* your event data */ }
  });
  
  return true;
}
```

2. **Import and use in your component:**
```typescript
import { yourNewAction } from '../services/dataService';

const handleAction = () => {
  const success = yourNewAction(sessionId, otherParams);
  if (success) {
    toast.success('Action completed!');
    loadSessions(); // Refresh data
  }
};
```

### Modifying Existing Actions

All action functions are in `/services/dataService.ts`. Simply edit the function logic:

```typescript
// Example: Change what happens when a session is accepted
export function acceptSession(sessionId: number): boolean {
  const sessions = getSessions();
  const session = sessions.find(s => s.id === sessionId);
  
  if (!session || session.status !== 'pending') {
    return false;
  }
  
  // ADD YOUR CUSTOM LOGIC HERE
  session.status = 'accepted';
  session.acceptedAt = Date.now(); // Add custom field
  
  saveSessions(sessions);
  
  logEvent({
    type: 'SessionAccepted',
    sessionId,
    timestamp: Date.now(),
    // Add custom event data
  });
  
  return true;
}
```

## Data Storage

### localStorage Keys
- `tutor_marketplace_sessions` - All sessions
- `tutor_marketplace_disputes` - All disputes
- `tutor_marketplace_events` - Blockchain event log
- `tutor_marketplace_tutors` - Available tutors
- `tutor_marketplace_session_counter` - Auto-increment for session IDs
- `tutor_marketplace_dispute_counter` - Auto-increment for dispute IDs

### Accessing Data
```typescript
import { getSessions, getDisputes, getEvents, getTutors } from '../services/dataService';

const sessions = getSessions();
const disputes = getDisputes();
const events = getEvents();
const tutors = getTutors();
```

### Clearing All Data
```typescript
import { clearAllData } from '../services/dataService';

clearAllData(); // Resets all data to initial state
```

## Session Lifecycle

```
1. PENDING ────→ (Tutor Accepts) ────→ ACCEPTED
       │                                    │
       │                                    │
       │                                    ↓
       └──→ (Tutor Rejects) ───→ REJECTED  │
                                            │
                                            ↓
                                     (Tutor Delivers)
                                            │
                                            ↓
                                       DELIVERED
                                       ↙        ↘
                        (Student Confirms)    (Student Disputes)
                                ↓                    ↓
                           CONFIRMED              DISPUTED
                                                     │
                                                     ↓
                                          (Admin Resolves)
                                                     │
                                                     ↓
                                                 RESOLVED
```

## Adding New Session Statuses

1. **Update the type in `/types/index.ts`:**
```typescript
export type SessionStatus = 
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'delivered'
  | 'confirmed'
  | 'disputed'
  | 'resolved'
  | 'yourNewStatus'; // Add here
```

2. **Add status color in `/components/MySessions.tsx`:**
```typescript
const getStatusColor = (status: SessionStatus) => {
  switch (status) {
    // ... existing cases
    case 'yourNewStatus': return 'bg-purple-100 text-purple-700 border-purple-200';
  }
};
```

3. **Add action button for the new status:**
```typescript
{session.status === 'yourPreviousStatus' && (
  <button onClick={() => handleYourAction(session.id)}>
    Perform Action
  </button>
)}
```

## Real-time Updates

All components refresh their data every 2 seconds:
```typescript
useEffect(() => {
  loadData();
  const interval = setInterval(loadData, 2000);
  return () => clearInterval(interval);
}, [dependencies]);
```

## Switching to Real Web3

To integrate with actual smart contracts:

1. Replace `HARDCODED_USERS` with wallet connection (MetaMask, WalletConnect)
2. Replace localStorage functions with smart contract calls:
   - `requestSession()` → Call contract's `requestSession()` with ETH
   - `acceptSession()` → Call contract's `acceptSession()`
   - etc.
3. Replace `logEvent()` with actual event listeners:
```typescript
contract.on('SessionRequested', (id, student, tutor, amount) => {
  // Handle event
});
```

## Testing

- Switch between Student/Tutor/Admin views using the header buttons
- All actions are immediately saved to localStorage
- Open browser DevTools → Application → Local Storage to inspect data
- Use `clearAllData()` in console to reset

## Component Structure

```
/App.tsx - Main app with role switcher
├── /components/StudentDashboard.tsx
│   ├── /components/TutorBrowser.tsx
│   ├── /components/MySessions.tsx
│   └── /components/BookingModal.tsx
├── /components/TutorDashboard.tsx
│   ├── /components/MySessions.tsx
│   └── /components/TutorProfile.tsx
├── /components/AdminDashboard.tsx
│   └── Dispute resolution UI
└── /services/dataService.ts (All business logic)
```

## Key Features

✅ Complete session lifecycle management
✅ Escrow payment simulation
✅ Dispute resolution system
✅ Real-time data synchronization
✅ Event logging (mimics blockchain events)
✅ Easy to modify and extend
✅ Ready for Web3 integration
