---
name: code-orientation
description: Apply SoC, DRY, KISS, YAGNI when writing or refactoring code. Use on any coding task — features, fixes, scripts, reviews. Output code only; no principle commentary unless asked.
---

# Code Orientation

These four principles orient how code gets written. They are not a checklist to narrate — apply them silently, the way an experienced engineer would, and let the resulting code speak for itself. Don't add comments, summaries, or callouts explaining that SoC/DRY/KISS/YAGNI were followed; just write the code that follows them.

## Core Principles

**SoC — Separation of Concerns.** Each unit of code (function, class, module) should have one reason to change. If a function is fetching data, transforming it, AND formatting it for display, that's three concerns wearing one coat — split them. The test: can you name what this function does in one short phrase without using "and"? If not, split it.

**DRY — Don't Repeat Yourself.** Extract duplicated logic only when the duplication is real (same logic, same reason to change together) and the resulting abstraction stays simple. Two call sites that happen to look similar today but represent different concerns are not duplication — they're coincidence, and extracting them couples things that should stay independent. Wait for a third real occurrence, or a clear case where two copies will rot out of sync, before reaching for an abstraction.

**KISS — Keep It Simple.** Prefer the direct, idiomatic solution for the language and context over a clever or generalized one. If a plain loop reads more clearly than a chain of higher-order functions, use the loop. If a single function does the job, don't wrap it in a class. Idiomatic beats impressive.

**YAGNI — You Aren't Gonna Need It.** Don't add config options, extension points, abstract base classes, feature flags, or speculative parameters for needs that don't exist yet. Build for the requirement in front of you. It is cheaper to add an abstraction later, once a second real use case shows up, than to carry one now that may never be used.

## Examples by Principle

### SoC — Separation of Concerns

**❌ Multiple responsibilities (don't do this):**
```javascript
// Fetching, transforming, AND formatting all in one function
function getUserSummary(id) {
  const response = await fetch(`/api/users/${id}`);
  const user = await response.json();
  return `${user.name} (${user.email}) - Active: ${user.isActive ? 'Yes' : 'No'}`;
}
```

**✅ Separated concerns (do this):**
```javascript
// Responsibility: fetch
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Responsibility: transform
function enrichUser(user) {
  return {
    ...user,
    status: user.isActive ? 'Active' : 'Inactive'
  };
}

// Responsibility: format for display
function formatUserSummary(user) {
  return `${user.name} (${user.email}) - Active: ${user.status}`;
}
```

### DRY — Don't Repeat Yourself

**Extract only when:**
- The logic is truly identical
- Both call sites have the same reason to change
- The extracted function has a clear, single name

**❌ Premature extraction (don't do this):**
```javascript
// Two call sites that look similar but have different reasons to change
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function formatDiscount(discount) {
  return `${discount.toFixed(2)}%`;
}
// These look the same but represent different domains (commerce vs analytics)
// Don't extract to formatNumber() — they will diverge
```

**✅ Legitimate extraction (do this when you have 2+ real occurrences):**
```javascript
// Third occurrence confirms the pattern is real
function calculateTax(amount, rate) {
  return amount * rate;
}

function calculateDiscount(amount, rate) {
  return amount * rate;
}

function calculateCommission(amount, rate) {
  return amount * rate;
}

// Now extract:
function applyPercentage(amount, rate) {
  return amount * rate;
}
```

### KISS — Keep It Simple

**❌ Clever but hard to read:**
```javascript
const activeUsers = users
  .filter(u => u.isActive)
  .map(u => ({ ...u, formatted: `${u.name}:${u.email}` }))
  .reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
```

**✅ Idiomatic and clear:**
```javascript
const activeUsers = {};
for (const user of users) {
  if (user.isActive) {
    activeUsers[user.id] = {
      ...user,
      formatted: `${user.name}:${user.email}`
    };
  }
}
```

### YAGNI — You Aren't Gonna Need It

**❌ Speculative abstraction (don't do this):**
```javascript
// Config for features that don't exist yet
const userConfig = {
  enableCaching: false,
  cacheStrategy: 'lru', // not used
  maxRetries: 3,         // not used
  fallbackApi: null,     // not used
  customFormatter: null  // not used
};

function getUser(id, config = userConfig) {
  // lots of conditional logic for unused features
}
```

**✅ Build for the current requirement (do this):**
```javascript
function getUser(id) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// Add config/strategies later when a real second use case appears
```

## DRY — Extraction Threshold Guide

Extract a shared function/module after the **second occurrence** if:
- The logic is identical AND will change together (same lifecycle)
- The extracted unit has a clear, single-word-phrase name
- The extraction doesn't require conditionals or branching

**Don't extract** if:
- There's only one call site
- The two call sites represent different domains (will diverge over time)
- One is stable; the other is experimental
- Extraction forces you to add parameters to handle differences

## Resolving conflicts between principles

These principles sometimes pull in different directions — most often DRY (which wants to extract) against KISS/YAGNI (which want to leave things alone). When that happens, **simplicity wins**: don't extract a helper, base class, or config layer for a single current use case just because the logic looks reusable in theory. Duplication that is small, stable, and easy to read beats an abstraction built ahead of need. Revisit the decision when a real second or third use case actually appears — that's the trigger DRY is waiting for, not foresight.

SoC is mostly compatible with the others and rarely needs trading off: splitting unrelated responsibilities tends to make code simpler to read, not more complex. Apply it readily.

## Language-Specific Pitfalls

### TypeScript
- ❌ Generic types for single use cases (`<T extends Base<U>>`).
- ✅ Use concrete types; extract generics when a pattern emerges.

### JavaScript / Node.js
- ❌ Wrapping pure functions in utility classes (`Utils.format()`).
- ✅ Export plain functions directly.

### Python
- ❌ Deep inheritance hierarchies for "data types" (use dataclasses/NamedTuple instead).
- ✅ Composition and protocols over class inheritance.

### React / Frontend
- ❌ Custom hooks for single-use logic; custom providers for single feature.
- ✅ Inline hooks; add abstraction when reused across 2+ components.

### Java / JVM Languages
- ❌ Abstract base class for two implementations.
- ✅ Wait for three implementations or use composition/interfaces first.

## Trade-offs: When to Override These Principles

**Simplicity is not enough** when:

- **Security is at stake**: Don't simplify auth, encryption, or validation logic. Complexity here is justified.
- **Performance is critical**: Measure first (premature optimization is waste), but after profiling, targeted refactoring is valid.
- **Compliance/legal requirements**: Financial, healthcare, and regulated industries may require explicit structure over simplicity.
- **Team standards conflict**: If your codebase consistently uses a pattern, follow it for consistency (communication > perfection).
- **Framework conventions**: Next.js, Django, Spring Boot have idioms; align with them even if it bends these rules.

## Refactoring Existing Code

When improving legacy code, apply principles in this order:

1. **First: Separate concerns** — Extract functions doing multiple jobs, even if it means duplication initially.
2. **Then: Identify DRY opportunities** — Only after concerns are separated will real patterns emerge.
3. **Finally: Simplify within each concern** — Remove complexity that accumulated over time.

This order prevents creating premature abstractions across unrelated concerns.

## How to apply this while coding

- Before writing a function or module, ask: "What is its one job?" If the request bundles multiple jobs ("fetch the file, parse it, and email a summary"), write separate units for each.
- While writing, default to the most ordinary, idiomatic shape for the language — the version another engineer would write without thinking twice. Reach for uncommon patterns only when they remove real complexity.
- Before adding a parameter, flag, config option, or extension hook, ask: "Does the current requirement need this?" If it's there for a "might want later" reason, leave it out.
- Before extracting a shared helper, verify there are genuinely 2+ current call sites with identical logic and the same reason to change. If conditions differ or there's only one caller, write each plainly.
- When in doubt between a simpler and a more "complete" version, write the simpler one. Extension is cheaper than unwinding speculative structure.

## What not to do

- Don't produce a written explanation, checklist, or comment block listing which principles were applied — the code should reflect them implicitly.
- Don't pre-emptively split a small, cohesive function just to "demonstrate" SoC if it genuinely has one job.
- Don't leave obvious duplication unaddressed when a third occurrence makes the pattern clear and the abstraction would be simple.
- Don't build generic, configurable, or pluggable structures for a single concrete use case.
- Don't extract logic across different domains just because it looks similar today.
- Don't add complexity to handle "future scenarios" — wait for them to be real.
