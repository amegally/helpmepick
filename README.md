# Help Me Pick 🎯

An AI-powered product recommendation wizard that guides users through a structured process to find their perfect product match using ChatGPT.

## Overview

Help Me Pick simplifies the product selection process through a guided wizard interface:
1. Initial product category selection with popular examples
2. One targeted follow-up question based on AI analysis
3. Final recommendations with Amazon affiliate links
4. Shareable results page with permalink

## Tech Stack

### Frontend
- **Next.js** - React framework for production
- **TypeScript** - For type safety and better development experience
- **Tailwind CSS** - For styling and rapid UI development
- **React Query** - For state management and API calls
- **Framer Motion** - For smooth wizard transitions and animations

### Backend
- **Next.js API Routes** - For handling API requests
- **OpenAI API** - For ChatGPT integration
- **Amazon Associates API** - For generating affiliate links

### Deployment
- **Vercel** - For hosting and deployment

## Implementation Plan

### Phase 1: Project Setup ⏳
- [x] Initialize Next.js project with TypeScript
- [x] Set up Tailwind CSS and Framer Motion
- [x] Configure ESLint and Prettier
- [x] Set up environment variables
- [x] Create basic project structure

### Phase 2: Core UI Development 🎨
- [x] Create main landing page with example categories
- [x] Design wizard step components and progress bar
- [x] Build product category selection interface
- [x] Create follow-up question component
- [x] Design results display grid
- [x] Implement responsive design

### Phase 3: Wizard Flow & State Management 🔄
- [x] Implement wizard step navigation
- [x] Create progress indicator component
- [x] Add step validation logic
- [x] Implement back/forward navigation
- [x] Add transition animations between steps

### Phase 4: ChatGPT Integration 🤖
- [x] Set up OpenAI API integration
- [x] Create prompt engineering for initial category analysis
- [x] Implement follow-up question generation
- [x] Develop product recommendation logic
- [x] Add error handling for API calls

### Phase 5: Amazon Integration 🛍️
- [x] Set up Amazon Associates account
- [x] Implement Amazon affiliate link generation
- [x] Create product card components with links
- [x] Add product search result formatting

### Phase 6: Additional Features 🌟
- [x] Implement permalink functionality
- [x] Add copy-to-clipboard for sharing
- [x] Create loading states and progress animations
- [x] Implement error boundaries
- [ ] Add analytics tracking

### Phase 7: Testing and Optimization 🧪
- [x] Implement API rate limiting
- [x] Optimize API calls and prevent unnecessary refreshes
- [ ] Write unit tests for core functionality
- [ ] Perform end-to-end testing
- [ ] Test cross-browser compatibility
- [ ] Implement SEO optimizations

### Phase 8: Deployment and Launch 🚀
- [ ] Set up Vercel deployment
- [ ] Configure production environment variables
- [ ] Implement monitoring and logging
- [ ] Perform security audit
- [ ] Launch MVP

## User Flow

1. **Step 1: Category Selection**
   - User sees example categories
   - Enters what they want help picking
   - Progress: 25%

2. **Step 2: Criteria Refinement**
   - AI generates one specific follow-up question
   - User provides additional context
   - Progress: 50%

3. **Step 3: Recommendations**
   - Display 5 personalized product recommendations
   - Show AI-generated explanation for each pick
   - Progress: 75%

4. **Step 4: Results & Sharing**
   - Final recommendations display
   - Shareable permalink generated
   - Progress: 100%

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
cd help-me-pick
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Then add your API keys to `.env.local`:
```
OPENAI_API_KEY=your_key_here
AMAZON_AFFILIATE_ID=your_id_here
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Required environment variables:
- `OPENAI_API_KEY` - Your OpenAI API key
- `AMAZON_AFFILIATE_ID` - Your Amazon Associates ID

## Development Notes

### 2024-03-20
- Phase 2: Updated UI concept from chat interface to wizard-style
- Debug Info: Added Framer Motion for handling wizard transitions
- Files Affected: README.md, .cursor/rules/readme-management.mdc

### 2024-03-20 - Phase 1 Completion
- Phase 1: Completed project setup
- Debug Info: Successfully initialized Next.js project with TypeScript, Tailwind CSS, and additional dependencies
- Files Affected: 
  - All project configuration files
  - package.json
  - tsconfig.json
  - next.config.js
  - tailwind.config.js
  - .eslintrc.json

### 2024-03-20 - Phase 2 Completion
- Phase 2: Completed all UI components
- Debug Info: Implemented all wizard steps with animations and responsive design
- Files Affected:
  - src/app/components/wizard/CategoryStep.tsx
  - src/app/components/wizard/CriteriaStep.tsx
  - src/app/components/wizard/RecommendationsStep.tsx
  - src/app/components/wizard/ResultsStep.tsx
  - src/app/components/wizard/Wizard.tsx

### 2024-03-20 - Phase 3 Completion
- Phase 3: Implemented ChatGPT integration and API routes
- Debug Info: Added OpenAI integration for follow-up questions and recommendations
- Files Affected:
  - src/lib/api/openai.ts
  - src/app/api/wizard/question/route.ts
  - src/app/api/wizard/recommendations/route.ts
  - src/app/components/wizard/CriteriaStep.tsx
  - src/app/components/wizard/RecommendationsStep.tsx

### 2024-03-20 - Phase 5 Completion
- Phase 5: Completed Amazon integration
- Debug Info: Implemented Amazon affiliate link generation and product card components
- Files Affected:
  - src/app/components/wizard/ResultsStep.tsx

## Version History

### v0.1.0 (2024-03-20)
- Added: Initial project structure and documentation
- Added: Wizard-style interface design
- Added: Implementation plan with 8 phases
- Added: README management rules
- Changed: UI concept from chat-based to wizard-based interface

### v0.1.1 (2024-03-20)
- Added: Next.js project initialization
- Added: TypeScript configuration
- Added: Tailwind CSS setup
- Added: Framer Motion integration
- Added: React Query integration
- Added: ESLint and Prettier configuration

### v0.1.2 (2024-03-20)
- Added: Wizard UI components
- Added: Progress indicator with animations
- Added: TypeScript types for wizard state
- Added: Responsive layout and styling
- Added: Framer Motion animations for transitions

### v0.1.3 (2024-03-20)
- Added: Category selection step with examples
- Added: Criteria collection step with dynamic questions
- Added: Recommendations display with product cards
- Added: Results summary with sharing functionality
- Added: Responsive design for all components
- Added: Smooth transitions between steps

### v0.1.4 (2024-03-20)
- Added: OpenAI API integration
- Added: Dynamic follow-up questions
- Added: AI-powered product recommendations
- Added: Error handling for API calls
- Added: Loading states for API requests
- Changed: Mock data replaced with real API calls

### v0.1.5 (2024-03-21)
- Added: API rate limiting to prevent abuse
- Fixed: Unnecessary API refreshes in wizard steps
- Added: Better error handling for rate limits
- Added: Request cleanup for memory management
- Changed: Optimized state management in wizard components

## API Rate Limits

The application implements rate limiting to prevent abuse and ensure fair usage:

- Question Generation: 10 requests per minute per IP
- Recommendations: 10 requests per minute per IP

Rate limit headers are included in API responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when the rate limit resets

When rate limit is exceeded, the API returns a 429 status code with an error message.

## Contributing

This is a private project in development. Contributing guidelines will be added later.

## License

This project is private and confidential. All rights reserved. 